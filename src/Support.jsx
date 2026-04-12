import { Link } from "react-router-dom";

const accent = "#00FF9C";
const dim = "#0a0a0a";

const S = {
  page: { background: dim, color: "#e8e8e0", minHeight: "100vh", fontFamily: "'Courier New', monospace" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 36px", borderBottom: "1px solid #1a1a1a" },
  logo: { fontSize: "14px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none" },
  body: { padding: "60px 36px", maxWidth: "680px", margin: "0 auto" },
  h1: { fontSize: "28px", fontWeight: 900, color: "#fff", marginBottom: "12px" },
  tag: { display: "inline-block", background: "#111", border: "1px solid #2a2a2a", color: accent, fontSize: "8px", letterSpacing: "2px", padding: "2px 6px", textTransform: "uppercase", marginBottom: "16px" },
  p: { fontSize: "14px", lineHeight: 1.8, color: "#999", marginBottom: "16px" },
  card: { border: "1px solid #1e1e1e", background: "#0d0d0d", padding: "24px", marginBottom: "16px" },
  h3: { fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "8px" },
  footer: { borderTop: "1px solid #1a1a1a", padding: "32px 36px", fontSize: "10px", color: "#333", letterSpacing: "1.5px", textTransform: "uppercase", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
  footerLink: { color: "#444", textDecoration: "none", marginLeft: "16px" },
};

export default function Support() {
  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <Link to="/" style={S.logo}><span style={{ color: accent }}>CODEX</span><span style={{ color: "#fff" }}> TRADING</span></Link>
        <Link to="/" style={{ fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>← Back</Link>
      </nav>

      <div style={S.body}>
        <div style={S.tag}>Help & Support</div>
        <h1 style={S.h1}>Support</h1>
        <p style={S.p}>
        Need help with your account, subscription, or have questions about Codex Trading?
        Reach out and we will get back to you.
        </p>

        <div style={S.card}>
          <div style={S.h3}>Email Support</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            Contact us at{" "}
            <a href="mailto:hello@codextrading.se" style={{ color: accent, textDecoration: "none" }}>
              hello@codextrading.se
            </a>
            <br />We aim to respond within 24 hours on business days.
          </p>
        </div>

        <div style={S.card}>
          <div style={S.h3}>Subscription & Billing</div>
          <p style={{ ...S.p, marginBottom: 0 }}>
            All payments are processed securely through Stripe. To manage your subscription,
            cancel, or update your payment method, use the link in your Stripe receipt email
            or contact us and we'll send you a direct link to the Stripe customer portal.
          </p>
        </div>

        <div style={S.card}>
          <div style={S.h3}>FAQ</div>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ ...S.p, color: "#ccc", fontWeight: 700, marginBottom: "4px" }}>What do I get with my subscription?</p>
            <p style={{ ...S.p, fontSize: "13px" }}>
              Full access to the live dashboard with real-time data, system architecture documentation,
              trade log, risk monitor, graduation tracker, and all future features.
            </p>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ ...S.p, color: "#ccc", fontWeight: 700, marginBottom: "4px" }}>Is this financial advice?</p>
            <p style={{ ...S.p, fontSize: "13px" }}>
              No. Codex Trading Bot is an educational and research tool. It is currently in a paper trading
              validation phase. We do not provide financial advice, and past or simulated performance
              does not guarantee future results.
            </p>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <p style={{ ...S.p, color: "#ccc", fontWeight: 700, marginBottom: "4px" }}>Can I cancel anytime?</p>
            <p style={{ ...S.p, fontSize: "13px" }}>
              Yes. Monthly subscriptions can be cancelled at any time. You retain access until the end
              of your current billing period. Lifetime access is non-recurring and does not expire.
            </p>
          </div>
          <div>
            <p style={{ ...S.p, color: "#ccc", fontWeight: 700, marginBottom: "4px" }}>What currency is the pricing in?</p>
            <p style={{ ...S.p, fontSize: "13px", marginBottom: 0 }}>
              All prices are in Swedish kronor (SEK) including 25% moms (VAT).
              Stripe handles currency conversion automatically for international customers.
            </p>
          </div>
        </div>

        <div style={S.card}>
          <div style={S.h3}>Company Information</div>
          <p style={{ ...S.p, fontSize: "13px", marginBottom: 0 }}>
            BZK - Beyond Zero Knowledge<br />
            Malmo, Sweden<br />
            <a href="mailto:hello@codextrading.se" style={{ color: accent, textDecoration: "none" }}>hello@codextrading.se</a>
          </p>
        </div>
      </div>

      <footer style={S.footer}>
        <div>© {new Date().getFullYear()} BZK - Beyond Zero Knowledge</div>
        <div>
          <Link to="/privacy-policy" style={S.footerLink}>Privacy</Link>
          <Link to="/terms-of-service" style={S.footerLink}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}
