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

export default function Terms() {
  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <Link to="/" style={S.logo}><span style={{ color: accent }}>CODEX</span><span style={{ color: "#fff" }}> TRADING</span></Link>
        <Link to="/" style={{ fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none" }}>← Back</Link>
      </nav>

      <div style={S.body}>
        <div style={S.tag}>Legal</div>
        <h1 style={S.h1}>Terms of Service</h1>
        <p style={{ ...S.p, color: "#555" }}>Last updated: April 9, 2026</p>

        <p style={S.p}>
          These Terms of Service ("Terms") govern your use of codextrading.se and associated services
          (the "Service") operated by BZK - Beyond Zero Knowledge ("we", "us", "our"), Malmo, Sweden.
          By accessing or using the Service, you agree to be bound by these Terms.
        </p>

        <h2 style={S.h2}>1. Service Description</h2>
        <p style={S.p}>
          Codex Trading provides a web-based dashboard and automated trading signals based on publicly
          available congressional disclosure data. The Service operates using paper trading (simulated)
          during its current phase.
        </p>

        <h2 style={S.h2}>2. Not Financial Advice</h2>
        <p style={S.p}>
          <strong style={{ color: "#fff" }}>The Service does not constitute financial, investment, or trading advice.</strong>{" "}
          All signals, data, and outputs are for informational and educational purposes only. You are
          solely responsible for your own investment decisions. Past performance does not guarantee
          future results. We are not a licensed financial advisor, broker, or dealer.
        </p>

        <h2 style={S.h2}>3. Eligibility</h2>
        <p style={S.p}>
          You must be at least 18 years old to use the Service. By subscribing, you confirm that you
          meet this requirement and that the information you provide is accurate.
        </p>

        <h2 style={S.h2}>4. Accounts & Subscriptions</h2>
        <p style={S.p}>
          Access to premium features requires a paid subscription. Payments are processed by Stripe.
          Your subscription will automatically renew at the end of each billing period unless cancelled.
          You may cancel at any time through Stripe's customer portal or by contacting us at{" "}
          <a href="mailto:hello@codextrading.se" style={{ color: accent, textDecoration: "none" }}>hello@codextrading.se</a>.
        </p>

        <h2 style={S.h2}>5. Refund Policy</h2>
        <p style={S.p}>
          Monthly subscriptions: No refunds for partial months. You retain access until the end of
          the current billing period after cancellation.<br />
          Lifetime access: Refund requests may be submitted within 14 days of purchase if the Service
          has not been substantially used, in accordance with EU consumer rights (ångerrätt). Contact
          us to request a refund.
        </p>

        <h2 style={S.h2}>6. Acceptable Use</h2>
        <p style={S.p}>
          You agree not to:<br />
          • Reverse-engineer, copy, or redistribute the Service or its content<br />
          • Use the Service for any unlawful purpose<br />
          • Attempt to gain unauthorized access to any part of the Service<br />
          • Share your account credentials with third parties<br />
          • Resell or sublicense access to the Service
        </p>

        <h2 style={S.h2}>7. Intellectual Property</h2>
        <p style={S.p}>
          All content, code, design, and branding associated with Codex Trading belong to
          BZK - Beyond Zero Knowledge. You may not use our trademarks or brand assets
          without prior written consent.
        </p>

        <h2 style={S.h2}>8. Limitation of Liability</h2>
        <p style={S.p}>
          To the maximum extent permitted by law, BZK - Beyond Zero Knowledge is not liable
          for any indirect, incidental, special, consequential, or punitive damages, including but
          not limited to financial losses resulting from trading decisions based on the Service.
          Our total liability is limited to the amount you have paid for the Service in the
          preceding 12 months.
        </p>

        <h2 style={S.h2}>9. Service Availability</h2>
        <p style={S.p}>
          We aim to keep the Service available but do not guarantee uninterrupted access.
          The Service may be temporarily unavailable due to maintenance, updates, or factors
          beyond our control. We reserve the right to modify, suspend, or discontinue the
          Service at any time with reasonable notice.
        </p>

        <h2 style={S.h2}>10. Termination</h2>
        <p style={S.p}>
          We can suspend or terminate your account if you break these Terms.
          Upon termination, your right to use the Service ceases immediately. Sections that by
          their nature should survive termination will remain in effect.
        </p>

        <h2 style={S.h2}>11. Changes to These Terms</h2>
        <p style={S.p}>
          We may update these Terms from time to time. Changes will be posted on this page.
          Continued use of the Service after changes constitutes acceptance of the updated Terms.
          For material changes, we will notify subscribers via email.
        </p>

        <h2 style={S.h2}>12. Governing Law</h2>
        <p style={S.p}>
          These Terms follow the laws of Sweden.
          Any disputes will be handled by the courts of Malmo, Sweden.
          EU consumers retain the right to bring claims in their country of residence.
        </p>

        <h2 style={S.h2}>13. Contact</h2>
        <p style={S.p}>
          Questions about these Terms? Contact us at:<br />
          <a href="mailto:hello@codextrading.se" style={{ color: accent, textDecoration: "none" }}>hello@codextrading.se</a>
        </p>
      </div>

      <footer style={S.footer}>
        <div>© {new Date().getFullYear()} BZK - Beyond Zero Knowledge</div>
        <div>
          <Link to="/support" style={S.footerLink}>Support</Link>
          <Link to="/privacy-policy" style={S.footerLink}>Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
