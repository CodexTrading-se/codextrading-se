/**
 * Payment verification endpoint.
 *
 * After a successful Stripe checkout, the browser is redirected to:
 *   /app?session={CHECKOUT_SESSION_ID}
 *
 * The app calls this endpoint with that session ID.
 * We verify the payment with Stripe server-side, then issue a signed
 * access token the client stores in localStorage.
 *
 * Env vars required:
 *   STRIPE_SECRET_KEY — Stripe secret key (sk_live_... or sk_test_...)
 *   JWT_SECRET        — secret used to sign access tokens (see _auth.js)
 */

import Stripe from "stripe";
import { generateToken } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId } = req.body || {};
  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  // Basic sanity check — Stripe session IDs start with cs_
  if (!sessionId.startsWith("cs_")) {
    return res.status(400).json({ error: "Invalid sessionId format" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(500).json({ error: "Payment system not configured" });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(402).json({ error: "Payment not complete" });
    }

    // Use Stripe customer ID if available, fall back to session ID
    const customerId = session.customer || session.id;
    const token = generateToken(customerId);

    return res.json({ token });
  } catch (err) {
    // Don't leak Stripe error details to the client
    console.error("Stripe verification error:", err.message);
    return res.status(500).json({ error: "Payment verification failed" });
  }
}
