import "server-only";

import { RATE_LIMIT } from "@/lib/constants";

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Good enough for a single-instance MVP. On serverless platforms each instance
 * keeps its own state, which is acceptable for the 5 req/min budget here.
 * Swap this out for Upstash Redis (`@upstash/ratelimit`) for exact limits.
 */

interface Bucket {
  /** Timestamps (ms) of requests inside the current window. */
  hits: number[];
}

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Returns ok=false when the caller has exceeded RATE_LIMIT.max requests
 * inside RATE_LIMIT.windowMs. Identifiers are IP-based (see callers).
 */
export function rateLimit(
  identifier: string,
  scope = "global",
): RateLimitResult {
  const key = `${scope}:${identifier}`;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT.windowMs;

  const bucket = store.get(key);
  const hits = bucket
    ? bucket.hits.filter((t) => t > windowStart)
    : [];

  if (hits.length >= RATE_LIMIT.max) {
    const oldest = Math.min(...hits);
    return {
      ok: false,
      remaining: 0,
      resetMs: oldest + RATE_LIMIT.windowMs,
    };
  }

  hits.push(now);
  store.set(key, { hits });

  return {
    ok: true,
    remaining: Math.max(0, RATE_LIMIT.max - hits.length),
    resetMs: now + RATE_LIMIT.windowMs,
  };
}

/** Extract a best-effort client IP from a Request / NextRequest / Headers. */
export function getClientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
