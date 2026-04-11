/**
 * Live data endpoint — serves the real-time dashboard snapshot.
 * Requires a valid access token in the Authorization header.
 *
 * Env vars required:
 *   GIST_LIVE_URL — full Gist raw URL for dashboard_data.json
 *   JWT_SECRET    — secret used to sign/verify tokens (see _auth.js)
 */

import { verifyToken } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract Bearer token from Authorization header
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const url = process.env.GIST_LIVE_URL;
  if (!url) {
    return res.status(500).json({ error: "Data source not configured" });
  }

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(502).json({ error: "Upstream error", status: upstream.status });
    }
    const data = await upstream.json();

    // Never cache live data on CDN edge — paid users must get fresh data
    res.setHeader("Cache-Control", "no-store");
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch data" });
  }
}
