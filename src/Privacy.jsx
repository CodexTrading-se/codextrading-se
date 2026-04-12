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
  p: { fontSize: "13px", lineHeight: 1.9, color: "#999", marginBottom: "16px" },
  h2: { fontSize: "16px", fontWeight: 700, color: "#ccc", marginTop: "32px", marginBottom: "12px" },
  footer: { borderTop: "1px solid #1a1a1a", padding: "32px 36px", fontSize: "10px", color: "#333", letterSpacing: "1.5px", textTransform: "uppercase", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
  footerLink: { color: "#444", textDecoration: "none", marginLeft: "16px" },
};

export default function Privacy() {
  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <Link to="/" style={S.logo}><span style={{ color: accent }}>CODEX</span><span style={{ color: "#fff" }}> TRADING</span></Link>
        <Link to="/" style={{ fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>← Back</Link>
      </nav>

      <div style={S.body}>
        <div style={S.tag}>Legal</div>
        <h1 style={S.h1}>Privacy Policy</h1>
        <p style={{ ...S.p, color: "#555" }}>Last updated: April 9, 2026</p>

        <p style={S.p}>
          BZK - Beyond Zero Knowledge ("we", "us", "our"), operating under the brand Codex Trading,
          respects your privacy. This Privacy Policy explains how we collect, use,
          and protect your personal data when you use codextrading.se (the "Service").
        </p>

        <h2 style={S.h2}>1. Data Controller</h2>
        <p style={S.p}>
          BZK - Beyond Zero Knowledge<br />
          Malmo, Sweden<br />
          Contact: <a href="mailto:hello@codextrading.se" style={{ color: accent, textDecoration: "none" }}>hello@codextrading.se</a>
        </p>

        <h2 style={S.h2}>2. What Data We Collect</h2>
        <p style={S.p}>
          <strong style={{ color: "#ccc" }}>Waitlist signups:</strong> Email address (via Formspree).<br />
          <strong style={{ color: "#ccc" }}>Paid subscribers:</strong> Email address, name, and payment information (processed by Stripe. We do not store card details).<br />
          <strong style={{ color: "#ccc" }}>Automatically collected:</strong> We use Vercel's built-in analytics which may collect anonymized page view data. We do not use cookies for tracking.
        </p>

        <h2 style={S.h2}>3. How We Use Your Data</h2>
        <p style={S.p}>
          • To provide and maintain the Service<br />
          • To process payments and manage subscriptions (via Stripe)<br />
          • To send you service-related communications (e.g., product launch notification)<br />
          • To respond to support requests<br />
          • We do not sell, rent, or share your personal data with third parties for marketing purposes.
        </p>

        <h2 style={S.h2}>4. Third-Party Processors</h2>
        <p style={S.p}>
          <strong style={{ color: "#ccc" }}>Stripe</strong> (payment processing): <a href="https://stripe.com/privacy" style={{ color: "#666" }} target="_blank" rel="noopener noreferrer">stripe.com/privacy</a><br />
          <strong style={{ color: "#ccc" }}>Formspree</strong> (waitlist form): <a href="https://formspree.io/legal/privacy-policy" style={{ color: "#666" }} target="_blank" rel="noopener noreferrer">formspree.io/legal/privacy-policy</a><br />
          <strong style={{ color: "#ccc" }}>Vercel</strong> (hosting): <a href="https://vercel.com/legal/privacy-policy" style={{ color: "#666" }} target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
        </p>

        <h2 style={S.h2}>5. Data Retention</h2>
        <p style={S.p}>
          We keep your personal data only as long as we need it for the purposes listed above.
          Waitlist emails are retained until the product launches or you request removal.
          Subscription data is retained as required by Swedish accounting law (Bokforingslagen, 7 years).
        </p>

        <h2 style={S.h2}>6. Your Rights (GDPR)</h2>
        <p style={S.p}>
          Under the General Data Protection Regulation (GDPR), you have the right to:<br />
          • Access your personal data<br />
          • Rectify inaccurate data<br />
          • Request erasure ("right to be forgotten")<br />
          • Restrict processing<br />
          • Data portability<br />
          • Object to processing<br /><br />
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:hello@codextrading.se" style={{ color: accent, textDecoration: "none" }}>hello@codextrading.se</a>.
          We will respond within 30 days.
        </p>

        <h2 style={S.h2}>7. Security</h2>
        <p style={S.p}>
          We use reasonable technical and organizational measures to protect your personal data.
          All data is transmitted over HTTPS. Payment data is handled exclusively by Stripe (PCI DSS compliant).
          We do not store credit card information.
        </p>

        <h2 style={S.h2}>8. Changes to This Policy</h2>
        <p style={S.p}>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with
          an updated "Last updated" date. Continued use of the Service constitutes acceptance of the updated policy.
        </p>

        <h2 style={S.h2}>9. Contact</h2>
        <p style={S.p}>
          For privacy-related questions or requests, contact:<br />
          <a href="mailto:hello@codextrading.se" style={{ color: accent, textDecoration: "none" }}>hello@codextrading.se</a>
        </p>
      </div>

      <footer style={S.footer}>
        <div>© {new Date().getFullYear()} BZK - Beyond Zero Knowledge</div>
        <div>
          <Link to="/support" style={S.footerLink}>Support</Link>
          <Link to="/terms-of-service" style={S.footerLink}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}
