// Small in-memory cache with expiry, shared by all requests of a server process
// (and by the page in the browser). Stores promises so concurrent calls share one request.

type CacheEntry = { expiresAt: number; value: Promise<unknown> };

const MAX_ENTRIES = 2000;
const cache = new Map<string, CacheEntry>();

export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;

export default function memoryCache<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>,
): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) return hit.value as Promise<T>;

  const value = fn();
  cache.delete(key);
  cache.set(key, { expiresAt: now + ttlMs, value });

  // failed requests are not cached
  value.catch(() => {
    if (cache.get(key)?.value === value) cache.delete(key);
  });

  // drop the oldest entries (Map keeps insertion order)
  while (cache.size > MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) break;
    cache.delete(oldestKey);
  }

  return value;
}
