type Entry = { count: number; resetAt: number };

// In-memory store — resets on cold start, sufficient for basic brute-force protection
const store = new Map<string, Entry>();

/**
 * Returns true if the request is allowed, false if rate limit exceeded.
 * identifier: unique key, e.g. `signup:1.2.3.4`
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) return false;

  entry.count += 1;
  return true;
}
