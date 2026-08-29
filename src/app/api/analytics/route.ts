import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { allowRequest, rateLimited } from '@/lib/security';
import { getAnalyticsEvents, appendAnalyticsEvents, type AnalyticsEvent } from '@/lib/blobStore';

const CTA_EVENTS = new Set([
  'phone_click', 'sms_click', 'map_click', 'waze_click',
  'form_submit', 'chat_open', 'chat_message', 'facebook_click',
  'instagram_click', 'callback_click',
]);

// In-memory buffer for batched writes
const writeBuffer: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

function scheduleFlush() {
  if (flushTimeout) return;
  flushTimeout = setTimeout(async () => {
    flushTimeout = null;
    if (writeBuffer.length) {
      const toFlush = writeBuffer.splice(0, writeBuffer.length);
      try {
        await appendAnalyticsEvents(toFlush);
      } catch {
        // Silent fail - events lost but don't crash the request
      }
    }
  }, 5000);
}

function aggregate(events: AnalyticsEvent[]) {
  const now = Date.now();

  const days = Array.from({ length: 14 }, (_, i) => {
    const start = now - (13 - i) * 864e5;
    const end = start + 864e5;
    const label = new Date(start).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
    const count = events.filter(e => e.event === 'pageview' && e.timestamp >= start && e.timestamp < end).length;
    return { label, count };
  });

  const sessionEventMap = new Map<string, Set<string>>();
  events.forEach(e => {
    if (!sessionEventMap.has(e.sessionId)) sessionEventMap.set(e.sessionId, new Set());
    sessionEventMap.get(e.sessionId)!.add(e.event);
  });

  const uniqueSessions = sessionEventMap.size;

  const passiveSessions = Array.from(sessionEventMap.entries()).filter(
    ([, evts]) => Array.from(evts).every(ev => !CTA_EVENTS.has(ev))
  );
  const passivePercent = uniqueSessions > 0
    ? Math.round((passiveSessions.length / uniqueSessions) * 100)
    : 0;

  const eventCounts = new Map<string, number>();
  events.forEach(e => {
    if (e.event !== 'pageview') {
      eventCounts.set(e.event, (eventCounts.get(e.event) ?? 0) + 1);
    }
  });
  const eventStats = Array.from(eventCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const topEvent = eventStats[0]?.name ?? null;

  const referrerCounts = new Map<string, number>();
  events
    .filter(e => e.event === 'pageview' && e.referrer)
    .forEach(e => {
      const ref = e.referrer ?? '';
      if (!ref) return;
      let host = ref;
      try { host = new URL(ref).hostname || 'direct'; } catch { host = ref.slice(0, 40); }
      referrerCounts.set(host, (referrerCounts.get(host) ?? 0) + 1);
    });
  const referrers = Array.from(referrerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));

  const recentPassive = passiveSessions
    .map(([sid]) => {
      const sessEvents = events.filter(e => e.sessionId === sid);
      const last = sessEvents.reduce((a, b) => (a.timestamp > b.timestamp ? a : b), sessEvents[0]);
      return { sessionId: sid, lastSeen: last?.timestamp ?? 0, pathname: last?.pathname ?? '' };
    })
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .slice(0, 10);

  const surveyResults = events
    .filter(e => e.event === 'survey_submit')
    .map(e => ({ ...(e.data as object), timestamp: e.timestamp }));

  return {
    total: events.filter(e => e.event === 'pageview').length,
    uniqueSessions,
    topEvent,
    passivePercent,
    days,
    eventStats,
    referrers,
    recentPassive,
    surveyResults,
  };
}

export async function GET(request: Request) {
  const auth = request.headers.get('authorization') ?? '';
  if (!verifyAdminToken(auth.startsWith('Bearer ') ? auth.slice(7) : '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const fourteenDaysMs = 14 * 864e5;
  const events = await getAnalyticsEvents(Date.now() - fourteenDaysMs);
  const data = aggregate(events);

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    if (!allowRequest(request, 'analytics-post', 90, 60 * 1000)) return rateLimited();
    const body = await request.json();
    const { event, data, sessionId, timestamp, pathname, referrer } = body;
    if (typeof event !== 'string' || typeof sessionId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const newEvent: AnalyticsEvent = {
      event,
      data,
      sessionId,
      timestamp: timestamp ?? Date.now(),
      pathname,
      referrer,
    };

    writeBuffer.push(newEvent);
    if (writeBuffer.length >= 100) {
      const toFlush = writeBuffer.splice(0, writeBuffer.length);
      try {
        await appendAnalyticsEvents(toFlush);
      } catch {
        // Silent fail
      }
      if (flushTimeout) {
        clearTimeout(flushTimeout);
        flushTimeout = null;
      }
    } else {
      scheduleFlush();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}