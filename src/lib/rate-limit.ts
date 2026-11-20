interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * In-memory sliding-window rate limiter for sensitive routes.
 * @param key Unique identifier (e.g. IP + route)
 * @param limit Maximum allowed requests in window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 20,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetInMs: number; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || record.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: limit - 1,
      resetInMs: windowMs,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    const resetInMs = Math.max(0, record.resetAt - now);
    return {
      allowed: false,
      remaining: 0,
      resetInMs,
      retryAfterSeconds: Math.ceil(resetInMs / 1000) || 1,
    };
  }

  record.count += 1;
  const resetInMs = Math.max(0, record.resetAt - now);
  return {
    allowed: true,
    remaining: limit - record.count,
    resetInMs,
    retryAfterSeconds: Math.ceil(resetInMs / 1000),
  };
}

export const bookingLimiter = {
  check: (ip: string, limit: number = 10, windowMs: number = 60000) =>
    checkRateLimit(`booking:${ip}`, limit, windowMs),
};

export const authLimiter = {
  check: (ip: string, limit: number = 5, windowMs: number = 60000) =>
    checkRateLimit(`auth:${ip}`, limit, windowMs),
};

/**
 * Extract client IP for rate-limiting from Headers or a Request/NextRequest object.
 */
export function getClientIp(input: Headers | { headers: Headers } | unknown): string {
  try {
    let headers: Headers | undefined;
    if (input && typeof (input as { headers?: Headers }).headers?.get === "function") {
      headers = (input as { headers: Headers }).headers;
    } else if (input && typeof (input as Headers).get === "function") {
      headers = input as Headers;
    }

    if (headers) {
      const forwarded = headers.get("x-forwarded-for");
      if (forwarded) {
        return forwarded.split(",")[0].trim();
      }
      const realIp = headers.get("x-real-ip");
      if (realIp) {
        return realIp.trim();
      }
    }
  } catch {
    // ignore
  }

  return "127.0.0.1";
}
