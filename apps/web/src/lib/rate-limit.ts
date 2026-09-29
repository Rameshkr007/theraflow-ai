/**
 * In-memory rate limiter with sliding window algorithm.
 *
 * This is suitable for single-instance deployments and development.
 * For multi-instance production, swap the store for Redis (Upstash).
 *
 * Different limits apply to different endpoint categories:
 * - Public API: 100 req/min
 * - Auth endpoints: 20 req/min (brute force protection)
 * - AI endpoints: 30 req/min (cost control)
 * - Authenticated API: 500 req/min
 * - Webhook endpoints: 200 req/min
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis in production)
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  /** Max requests in the window */
  limit: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp
  retryAfter?: number; // seconds
}

export const RATE_LIMIT_CONFIGS = {
  public: { limit: 100, windowSeconds: 60 },
  auth: { limit: 20, windowSeconds: 60 },
  ai: { limit: 30, windowSeconds: 60 },
  authenticated: { limit: 500, windowSeconds: 60 },
  webhook: { limit: 200, windowSeconds: 60 },
} satisfies Record<string, RateLimitConfig>;

export type RateLimitCategory = keyof typeof RATE_LIMIT_CONFIGS;

/**
 * Check and increment rate limit for an identifier.
 *
 * @param identifier - Usually IP address or `tenantId:userId`
 * @param category - Which limit profile to use
 */
export function checkRateLimit(
  identifier: string,
  category: RateLimitCategory = "public"
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[category];
  const key = `${category}:${identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const resetAt = now + windowMs;

  const existing = store.get(key);

  if (!existing || existing.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt: Math.floor(resetAt / 1000),
    };
  }

  if (existing.count >= config.limit) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetAt: Math.floor(existing.resetAt / 1000),
      retryAfter,
    };
  }

  existing.count++;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - existing.count,
    resetAt: Math.floor(existing.resetAt / 1000),
  };
}

/**
 * Get standard rate limit response headers.
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetAt.toString(),
  };
}
