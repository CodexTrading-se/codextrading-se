import { useState } from "react";
import { Link } from "react-router-dom";

const MONTHLY_LINK = "https://buy.stripe.com/aFa14o0bdfW82CQ1Owc7u01";
const LIFETIME_LINK = "https://buy.stripe.com/9B69AU8HJdO04KYal2c7u00";
const FORMSPREE = "https://formspree.io/f/xeepwjpd";

const accent = "#00FF9C";
const dim = "#0a0a0a";
const red = "#FF4444";

const S = {
  page: { background: dim, color: "#e8e8e0", minHeight: "100vh", fontFamily: "'Courier New', monospace" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 36px", borderBottom: "1px solid #1a1a1a", position: "sticky", top: 0, background: dim, zIndex: 100 },
  logo: { fontSize: "14px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none" },
  navLinks: { display: "flex", gap: "24px", alignItems: "center" },
  navLink: { fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", transition: "color .2s" },
  ctaBtn: { display: "inline-block", padding: "10px 24px", background: accent, color: "#000", fontSize: "11px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", textDecoration: "none", border: "none", cursor: "pointer", transition: "opacity .2s" },
  ctaBtnOutline: { display: "inline-block", padding: "10px 24px", background: "transparent", color: accent, fontSize: "11px", fontWeight: 900, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "'Courier New', monospace", textDecoration: "none", border: `1px solid ${accent}`, cursor: "pointer" },
  section: { padding: "80px 36px", maxWidth: "900px", margin: "0 auto" },
  sectionWide: { padding: "80px 36px", maxWidth: "1100px", margin: "0 auto" },
  tag: { display: "inline-block", background: "#111", border: "1px solid #2a2a2a", color: accent, fontSize: "8px", letterSpacing: "2px", padding: "2px 6px", textTransform: "uppercase", marginBottom: "12px" },
  h1: { fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: "20px" },
  h2: { fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, color: "#fff", marginBottom: "12px", letterSpacing: "-0.5px" },
  h3: { fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "8px", letterSpacing: "0.5px" },
  p: { fontSize: "15px", lineHeight: 1.8, color: "#999", marginBottom: "16px" },
  pLead: { fontSize: "17px", lineHeight: 1.8, color: "#bbb", marginBottom: "24px" },
  highlight: { color: accent, fontWeight: 700 },
  divider: { borderTop: "1px solid #1a1a1a", margin: "0" },
  card: { border: "1px solid #1e1e1e", background: "#0d0d0d", padding: "28px 24px" },
  mono: { background: "#0f1a12", border: "1px solid #1a3020", color: "#7dffb3", fontSize: "12px", padding: "16px 20px", lineHeight: 1.7, whiteSpace: "pre", overflowX: "auto" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "24px" },
  footer: { borderTop: "1px solid #1a1a1a", padding: "32px 36px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", fontSize: "10px", color: "#333", letterSpacing: "1.5px", textTransform: "uppercase" },
  footerLink: { color: "#444", textDecoration: "none", marginLeft: "16px" },
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div style={{ ...S.section, paddingTop: "100px", paddingBottom: "100px", textAlign: "center" }}>
      <div style={S.tag}>Paper-Proven · Systematic · Congressional Edge</div>
      <h1 style={S.h1}>
        Trade the Disclosure.<br />
        <span style={{ color: accent }}>Not the Noise.</span>
      </h1>
      <p style={{ ...S.pLead, maxWidth: "640px", margin: "0 auto 32px" }}>
        An automated trading bot that tracks congressional stock disclosures,
        spots multi-member clustering patterns, and places bracket orders.
        Every trading day, without you in the chair.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <a href="#pricing" style={S.ctaBtn}>Get Access →</a>
        <Link to="/app" style={S.ctaBtnOutline}>Live Dashboard</Link>
      </div>
      <p style={{ fontSize: "10px", color: "#333", marginTop: "16px", letterSpacing: "1px" }}>
        Currently in 90-day paper trading validation · Not financial advice
      </p>
    </div>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: "01", title: "Congress Discloses", desc: "Members of Congress are legally required to disclose stock trades. We pull every filing daily from the Quiver Quantitative API." },
    { num: "02", title: "Clustering Detected", desc: "A single purchase is noise. When multiple members across both parties buy the same ticker in the same window, that is a signal." },
    { num: "03", title: "Signal Validated", desc: "Technical analysis confirms the setup: MA-20 above MA-50 (uptrend), enough volume, and ATR-based volatility filtering." },
    { num: "04", title: "Risk-Gated Execution", desc: "Position sized at 2% equity risk. Bracket order placed with stop-loss and take-profit. Four safety gates must pass before any trade." },
  ];

  return (
    <div style={S.sectionWide}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={S.tag}>How It Works</div>
        <h2 style={S.h2}>From Disclosure to Execution</h2>
        <p style={{ ...S.p, maxWidth: "560px", margin: "0 auto" }}>Four autonomous steps. Zero human intervention. Every trading day.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        {steps.map((s, i) => (
          <div key={i} style={S.card}>
            <div style={{ fontSize: "32px", fontWeight: 900, color: accent, marginBottom: "8px", letterSpacing: "-2px" }}>{s.num}</div>
            <div style={S.h3}>{s.title}</div>
            <p style={{ ...S.p, fontSize: "13px", marginBottom: 0 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EDGE ─────────────────────────────────────────────────────────────────────
function Edge() {
  return (
    <div style={S.section}>
      <div style={S.tag}>The Edge</div>
      <h2 style={S.h2}>Why Congressional Data?</h2>
      <p style={S.p}>
        Members of Congress trade stocks while writing the laws that move those stocks.
        The STOCK Act forced them to disclose. Most investors ignore this data.
        The ones who don't are still doing it manually.
      </p>
      <div style={S.mono}>{`  The data is public.
  The edge is speed of interpretation,
  systematic filtering,
  and emotionless execution.

  A bot doesn't hesitate.
  A bot doesn't second-guess.
  A bot doesn't miss market open because it overslept.`}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginTop: "24px" }}>
        {[
          { val: "454", label: "Disclosures / 30 days" },
          { val: "2%", label: "Max risk per trade" },
          { val: "24/7", label: "SL/TP monitoring" },
          { val: "0", label: "Human intervention" },
        ].map((s, i) => (
          <div key={i} style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: 900, color: accent, letterSpacing: "-1px" }}>{s.val}</div>
            <div style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RISK ─────────────────────────────────────────────────────────────────────
function Risk() {
  const gates = [
    { name: "Fixed-Fractional Sizing", desc: "Every position risks exactly 2% of equity. Downside is capped by design." },
    { name: "ATR-Based Stops", desc: "Stop-losses adapt to each stock's volatility. Tight on calm stocks, wide on volatile ones." },
    { name: "Drawdown Gate", desc: "System shuts down if portfolio drawdown exceeds 10%. No overrides." },
    { name: "Holding Period Limits", desc: "Positions force-closed after max days. The longer you hold a swing trade, the weaker the thesis gets." },
  ];

  return (
    <div style={S.sectionWide}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={S.tag}>Risk Framework</div>
        <h2 style={S.h2}>Built to Not Blow Up</h2>
        <p style={{ ...S.p, maxWidth: "520px", margin: "0 auto" }}>The real value is in what the system <span style={S.highlight}>refuses to do</span>.</p>
      </div>
      <div style={S.grid3}>
        {gates.map((g, i) => (
          <div key={i} style={{ ...S.card, borderColor: "#1e3d28" }}>
            <div style={{ ...S.h3, color: accent, fontSize: "13px" }}>{g.name}</div>
            <p style={{ ...S.p, fontSize: "13px", marginBottom: 0 }}>{g.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TRANSPARENCY ─────────────────────────────────────────────────────────────
function Transparency() {
  return (
    <div style={S.section}>
      <div style={S.tag}>Build in Public</div>
      <h2 style={S.h2}>No Black Boxes</h2>
      <p style={S.p}>
        There are no secret algorithms here. The system architecture,
        trade logic, risk framework, and live performance are all open for you to inspect.
      </p>
      <div style={S.grid3}>
        {[
          { title: "Live Dashboard", desc: "Real-time equity, positions, risk gauges, trade log. Updated after every bot cycle." },
          { title: "System Manifesto", desc: "Four theses explaining why this approach works. Read the philosophy before you invest." },
          { title: "Architecture Docs", desc: "Full module-by-module breakdown. Signal pipeline, data flow, and storage." },
        ].map((f, i) => (
          <div key={i} style={S.card}>
            <div style={S.h3}>{f.title}</div>
            <p style={{ ...S.p, fontSize: "13px", marginBottom: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        <Link to="/app" style={S.ctaBtnOutline}>Explore the System →</Link>
      </div>
    </div>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <div id="pricing" style={{ ...S.sectionWide, paddingTop: "80px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div style={S.tag}>Pricing</div>
        <h2 style={S.h2}>Straightforward Pricing</h2>
        <p style={{ ...S.pLead, maxWidth: "640px", margin: "0 auto 32px" }}>
          Access the full system during paper trading validation.
          Free dashboard runs on a 24-hour delay.
          <br />Lifetime pricing only available during this phase.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", maxWidth: "700px", margin: "0 auto" }}>
        {/* Monthly */}
        <div style={{ ...S.card, padding: "36px 28px", position: "relative" }}>
          <div style={S.tag}>Monthly</div>
          <div style={{ fontSize: "42px", fontWeight: 900, color: "#fff", letterSpacing: "-2px", marginBottom: "4px" }}>
            299 <span style={{ fontSize: "16px", fontWeight: 400, color: "#555" }}>kr/mån</span>
          </div>
          <p style={{ fontSize: "11px", color: "#444", marginBottom: "24px" }}>Inkl. moms · Cancel anytime</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px" }}>
            {["Real-time dashboard (no delay)", "Full signal log and trade history", "Trade alerts via email", "All architecture and system docs", "Priority support"].map((f, i) => (
              <li key={i} style={{ fontSize: "13px", color: "#999", marginBottom: "8px", paddingLeft: "16px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: accent }}>✓</span>{f}
              </li>
            ))}
          </ul>
          <a href={MONTHLY_LINK} style={{ ...S.ctaBtnOutline, width: "100%", textAlign: "center", display: "block", boxSizing: "border-box" }}>
            Subscribe Monthly
          </a>
        </div>

        {/* Lifetime */}
        <div style={{ ...S.card, padding: "36px 28px", borderColor: accent, position: "relative" }}>
          <div style={{ position: "absolute", top: "-12px", right: "16px", background: accent, color: "#000", fontSize: "9px", fontWeight: 900, letterSpacing: "2px", padding: "4px 10px", textTransform: "uppercase" }}>
            Best Value
          </div>
          <div style={S.tag}>Lifetime</div>
          <div style={{ fontSize: "42px", fontWeight: 900, color: "#fff", letterSpacing: "-2px", marginBottom: "4px" }}>
            4 999 <span style={{ fontSize: "16px", fontWeight: 400, color: "#555" }}>kr</span>
          </div>
          <p style={{ fontSize: "11px", color: "#444", marginBottom: "24px" }}>Inkl. moms · One-time payment · Forever</p>
          <ul style={{ listStyle: "none", padding: 0, marginBottom: "28px" }}>
            {["Everything in Monthly", "Lifetime access, no recurring fees", "All future features and updates", "Priority support, always", "Early adopter pricing (limited)"].map((f, i) => (
              <li key={i} style={{ fontSize: "13px", color: "#999", marginBottom: "8px", paddingLeft: "16px", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: accent }}>✓</span>{f}
              </li>
            ))}
          </ul>
          <a href={LIFETIME_LINK} style={{ ...S.ctaBtn, width: "100%", textAlign: "center", display: "block", boxSizing: "border-box" }}>
            Get Lifetime Access →
          </a>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: "10px", color: "#333", marginTop: "20px", letterSpacing: "1px" }}>
        Powered by Stripe · Secure payments · Swedish moms included
      </p>
    </div>
  );
}

// ─── WAITLIST (free tier) ─────────────────────────────────────────────────────
function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, _subject: "Codex Trading - Waitlist Signup" }),
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) setEmail("");
    } catch { setStatus("error"); }
  };

  return (
    <div style={{ ...S.section, textAlign: "center" }}>
      <div style={S.tag}>Not Ready to Pay?</div>
      <h2 style={S.h2}>Join the Waitlist (Free)</h2>
      <p style={{ ...S.p, maxWidth: "480px", margin: "0 auto 24px" }}>
        Get notified when the bot graduates from paper to live trading.
        No spam. One email when we go live.
      </p>
      {status === "success" ? (
        <div style={{ ...S.card, borderColor: accent, maxWidth: "400px", margin: "0 auto", padding: "24px" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>✓</div>
          <div style={{ color: accent, fontWeight: 700, fontSize: "14px" }}>You're on the list.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", maxWidth: "440px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={{ flex: "1 1 260px", padding: "12px 16px", background: "#111", border: "1px solid #2a2a2a", color: "#e8e8e0", fontSize: "14px", fontFamily: "'Courier New', monospace", outline: "none", boxSizing: "border-box" }}
          />
          <button type="submit" disabled={status === "sending"} style={{ ...S.ctaBtn, opacity: status === "sending" ? 0.6 : 1 }}>
            {status === "sending" ? "..." : "Join →"}
          </button>
        </form>
      )}
      {status === "error" && <p style={{ color: red, fontSize: "11px", marginTop: "8px" }}>Something went wrong. Try again.</p>}
    </div>
  );
}

// ─── DISCLAIMER ───────────────────────────────────────────────────────────────
function Disclaimer() {
  return (
    <div style={{ ...S.section, paddingTop: "40px", paddingBottom: "40px" }}>
      <div style={{ ...S.card, borderColor: "#2a1a1a" }}>
        <div style={{ ...S.tag, color: "#FF6644", borderColor: "#3a2020" }}>Disclaimer</div>
        <p style={{ ...S.p, fontSize: "11px", color: "#555", marginBottom: 0, lineHeight: 1.8 }}>
          Codex Trading Bot is currently in a 90-day paper trading validation phase using simulated capital.
          Past performance, real or simulated, does not guarantee future results.
          This product is not financial advice. Trading stocks carries risk of loss.
          The congressional disclosure data used is publicly available under the STOCK Act.
          BZK - Beyond Zero Knowledge is a Swedish-registered entity. By purchasing access,
          you agree to our <Link to="/terms-of-service" style={{ color: "#666", textDecoration: "underline" }}>Terms of Service</Link> and{" "}
          <Link to="/privacy-policy" style={{ color: "#666", textDecoration: "underline" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={S.footer}>
      <div>© {new Date().getFullYear()} BZK - Beyond Zero Knowledge / Malmo, Sweden</div>
      <div>
        <Link to="/support" style={S.footerLink}>Support</Link>
        <Link to="/privacy-policy" style={S.footerLink}>Privacy</Link>
        <Link to="/terms-of-service" style={S.footerLink}>Terms</Link>
        <Link to="/app" style={S.footerLink}>Dashboard</Link>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <Link to="/" style={S.logo}><span style={{ color: accent }}>CODEX</span><span style={{ color: "#fff" }}> TRADING</span></Link>
        <div style={S.navLinks}>
          <a href="#pricing" style={S.navLink}>Pricing</a>
          <Link to="/app" style={S.navLink}>Dashboard</Link>
          <Link to="/support" style={S.navLink}>Support</Link>
          <a href={MONTHLY_LINK} style={{ ...S.ctaBtn, padding: "8px 16px", fontSize: "9px" }}>Get Access</a>
        </div>
      </nav>
      <Hero />
      <hr style={S.divider} />
      <HowItWorks />
      <hr style={S.divider} />
      <Edge />
      <hr style={S.divider} />
      <Risk />
      <hr style={S.divider} />
      <Transparency />
      <hr style={S.divider} />
      <Pricing />
      <hr style={S.divider} />
      <WaitlistSection />
      <Disclaimer />
      <Footer />
    </div>
  );
}
