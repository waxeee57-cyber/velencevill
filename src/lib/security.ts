import { NextResponse } from 'next/server';

const RATE_BUCKETS = new Map<string, { count: number; resetAt: number }>();
const RATE_BUCKET_CAP = 8000;

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim().slice(0, 64);
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/** In-memory IP limit. Serverless instance-local — better than nothing, not a WAF. */
export function allowRequest(req: Request, bucket: string, limit: number, windowMs: number): boolean {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const current = RATE_BUCKETS.get(key);
  if (!current || now >= current.resetAt) {
    if (RATE_BUCKETS.size >= RATE_BUCKET_CAP) {
      const oldest = RATE_BUCKETS.keys().next().value;
      if (oldest) RATE_BUCKETS.delete(oldest);
    }
    RATE_BUCKETS.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function rateLimited(): NextResponse {
  return NextResponse.json({ error: 'Túl sok kérés. Próbálja később.' }, { status: 429 });
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function sanitizeForEmail(data: Record<string, unknown>): Record<string, string> {
  const sanitized: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = escapeHtml(String(value ?? ''));
  }
  return sanitized;
}
