import "server-only";

import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from "@/lib/constants";
import { signSession, verifyToken } from "@/lib/auth/token";

// Re-export the edge-safe verifier for callers that want it.
export { verifyToken };

/** Compare a candidate password against the configured admin password. */
export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // No password configured -> block all admin access in production.
    return process.env.NODE_ENV !== "production";
  }
  return candidate === expected;
}

/** Sign and set the admin session cookie. */
export async function createSession(): Promise<string> {
  const token = await signSession();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return token;
}

/** Clear the admin session cookie. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
}

/** Verify the current request has a valid admin session (server components). */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return verifyToken(token);
}

/** Guard for API route handlers. */
export async function requireAdmin(): Promise<boolean> {
  return isAuthenticated();
}
