import { SignJWT, jwtVerify } from "jose";
import { ADMIN_COOKIE_MAX_AGE } from "@/lib/constants";

/**
 * Edge-safe token helpers. This module must NOT import `next/headers` so it can
 * be used from middleware (which runs on the edge runtime).
 */

const encoder = new TextEncoder();

function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET;
  if (!raw || raw.length < 16) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[auth] AUTH_SECRET is missing or short. Using an insecure dev secret. Set AUTH_SECRET in production.",
      );
    }
    return encoder.encode("popthelogo-dev-secret-do-not-use-in-prod");
  }
  return encoder.encode(raw);
}

/** Sign a fresh admin session JWT. */
export async function signSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_COOKIE_MAX_AGE}s`)
    .setIssuer("popthelogo")
    .sign(getSecret());
}

/** Verify a token string. Returns true when valid. Edge-safe. */
export async function verifyToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret(), { issuer: "popthelogo" });
    return true;
  } catch {
    return false;
  }
}
