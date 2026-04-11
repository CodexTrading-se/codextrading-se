/**
 * Public data endpoint — serves the delayed (24h) dashboard snapshot.
 * No authentication required. Gist URL is stored server-side only.
 *
 * Env vars required:
 *   GIST_PUBLIC_URL — full Gist raw URL for dashboard_data_public.json
 */

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = process.env.GIST_PUBLIC_URL;
  if (!url) {
    return res.status(500).json({ error: "Data source not configured" });
  }

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(502).json({ error: "Upstream error", status: upstream.status });
    }
    const data = await upstream.json();

    // Cache for 5 minutes on CDN edge, allow stale for 60s during revalidation
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    return res.json(data);
  } catch (err) {
    return res.status(502).json({ error: "Failed to fetch data" });
  }
}
