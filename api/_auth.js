/**
 * Shared auth utilities for Vercel API routes.
 *
 * Token format: base64url(customerId).<timestamp_ms>.<hmac_hex>
 * Signed with JWT_SECRET env var (server-side only, never in browser).
 * Tokens expire after 30 days. Verification uses constant-time comparison.
 *
 * Underscore prefix means Vercel does NOT expose this as an HTTP endpoint.
 */

import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generate a signed access token for a Stripe customer.
 * @param {string} customerId - Stripe customer ID or checkout session ID.
 * @returns {string} Opaque token safe to store in localStorage.
 */
export function generateToken(customerId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET env var not set");

  const id = Buffer.from(String(customerId)).toString("base64url");
  const ts = Date.now().toString();
  const payload = `${id}.${ts}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

/**
 * Verify a token produced by generateToken.
 * Returns true only if the signature is valid and the token is not expired.
 * @param {string} token
 * @returns {boolean}
 */
export function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || !token) return false;

    const lastDot = token.lastIndexOf(".");
    if (lastDot < 0) return false;

    const payload = token.slice(0, lastDot);
    const sig = token.slice(lastDot + 1);

    const expected = createHmac("sha256", secret).update(payload).digest("hex");

    // Reject if lengths differ (also prevents padding attacks)
    if (sig.length !== expected.length) return false;

    const sigBuf = Buffer.from(sig, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;

    // Constant-time comparison — prevents timing attacks
    if (!timingSafeEqual(sigBuf, expBuf)) return false;

    // Check token age
    const parts = payload.split(".");
    if (parts.length < 2) return false;
    const ts = parseInt(parts[parts.length - 1], 10);
    if (isNaN(ts) || Date.now() - ts > TOKEN_MAX_AGE_MS) return false;

    return true;
  } catch {
    return false;
  }
}
