export function trackEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const sessionId = getOrCreateSessionId();

  if (event !== 'pageview') {
    try {
      const active: string[] = JSON.parse(localStorage.getItem('vv_active_events') ?? '[]');
      if (!active.includes(event)) {
        active.push(event);
        localStorage.setItem('vv_active_events', JSON.stringify(active));
      }
    } catch { /* ignore */ }
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      data,
      sessionId,
      timestamp: Date.now(),
      pathname: window.location.pathname,
      referrer: document.referrer,
    }),
  }).catch(() => {});
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let sid = localStorage.getItem('vv_sid');
  if (!sid) {
    sid = Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem('vv_sid', sid);
  }
  return sid;
}

export function hasClickedCTA(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const active: string[] = JSON.parse(localStorage.getItem('vv_active_events') ?? '[]');
    return active.length > 0;
  } catch {
    return false;
  }
}
