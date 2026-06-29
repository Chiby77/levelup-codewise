/**
 * Retry an async operation with exponential backoff.
 * Designed for transient network/Supabase failures on slow connections.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: {
    retries?: number;
    baseDelayMs?: number;
    onAttempt?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> {
  const { retries = 3, baseDelayMs = 600, onAttempt } = opts;
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      onAttempt?.(attempt, err);
      if (attempt === retries) break;
      const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.random() * 200;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

export function friendlyNetworkMessage(err: unknown, fallback = 'Something went wrong.'): string {
  const msg = (err as any)?.message || String(err || '');
  if (!navigator.onLine) return 'You appear to be offline. Check your connection and try again.';
  if (/Failed to fetch|NetworkError|network|timeout|ETIMEDOUT|ECONNRESET/i.test(msg)) {
    return 'Slow or unstable connection. Please try again.';
  }
  if (/JWT|auth|permission|denied|RLS/i.test(msg)) {
    return 'Access denied. Please sign in again or contact your admin.';
  }
  return msg || fallback;
}
