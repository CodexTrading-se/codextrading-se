import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ─── GIST CONFIG ──────────────────────────────────────────────────────────────
// Public sees delayed data. Add ?key=live to URL for real-time access.
const GIST_BASE = "https://gist.githubusercontent.com/LedgerGuardian/8642d42f61a7302686730b95d2687275/raw/";
const isLive = new URLSearchParams(window.location.search).get("key") === "live";
const GIST_URL = GIST_BASE + (isLive ? "dashboard_data.json" : "dashboard_data_public.json");

const FALLBACK = {
  account: { equity: 0, cash: 0, buying_power: 0, start_equity: 100000, peak_equity: 0 },
  day: 0,
  target_days: 90,
  graduation_date: "—",
  positions: [],
  recent_trades: [],
  signals_today: { disclosures_fetched: 0, tickers_scanned: 0, signals_generated: 0, orders_submitted: 0, orders_blocked: 0 },
  risk_state: { consecutive_losses: 0, max_consecutive: 5, drawdown_pct: 0, max_drawdown: 10, exposure_pct: 0, max_exposure: 30, open_positions: 0, max_positions: 3 },
  performance: { total_trades: 0, wins: 0, losses: 0, open: 0, win_rate: null, avg_r_multiple: null, total_pnl: 0, best_trade: null, worst_trade: null },
  top_disclosures: [],
  graduation: {},
};

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const accent = "#00FF9C";
const red = "#FF4444";
const amber = "#FFB800";
const dim = "#0a0a0a";

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const S = {
  root: { background: dim, color: "#e8e8e0", minHeight: "100vh", fontFamily: "'Courier New', monospace" },
  header: { borderBottom: "1px solid #1f1f1f", padding: "28px 36px 20px", position: "sticky", top: 0, background: dim, zIndex: 100 },
  kicker: { fontSize: "9px", letterSpacing: "4px", color: accent, textTransform: "uppercase", marginBottom: "6px" },
  title: { fontSize: "clamp(17px, 2.8vw, 26px)", fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.1 },
  nav: { display: "flex", gap: "4px", marginTop: "18px", flexWrap: "wrap" },
  navBtn: (a) => ({ padding: "5px 12px", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", border: `1px solid ${a ? accent : "#2a2a2a"}`, background: a ? accent : "transparent", color: a ? "#000" : "#666", cursor: "pointer", fontFamily: "'Courier New', monospace", fontWeight: a ? 700 : 400, transition: "all .15s" }),
  body: { padding: "36px 36px 56px", maxWidth: "1100px" },
  h2: { fontSize: "clamp(20px, 3.5vw, 32px)", fontWeight: 900, color: "#fff", marginBottom: "8px", letterSpacing: "-0.5px" },
  sub: { color: "#555", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "36px", borderLeft: `3px solid ${accent}`, paddingLeft: "10px" },
  divider: { borderTop: "1px solid #1a1a1a", margin: "32px 0" },
  tag: { display: "inline-block", background: "#111", border: "1px solid #2a2a2a", color: accent, fontSize: "8px", letterSpacing: "2px", padding: "2px 6px", textTransform: "uppercase", marginBottom: "10px" },
  card: { border: "1px solid #1e1e1e", background: "#0d0d0d", padding: "16px 20px", marginBottom: "12px" },
  blockTitle: { fontSize: "13px", fontWeight: 700, color: "#fff", letterSpacing: "1px", marginBottom: "6px", textTransform: "uppercase" },
  p: { fontSize: "14px", lineHeight: 1.8, color: "#aaa", marginBottom: "16px" },
  highlight: { color: accent, fontWeight: 700 },
  mono: { background: "#0f1a12", border: "1px solid #1a3020", color: "#7dffb3", fontSize: "11px", padding: "12px 16px", lineHeight: 1.6, whiteSpace: "pre", overflowX: "auto", marginBottom: "12px" },
  stepNum: { fontSize: "10px", color: accent, letterSpacing: "2px", marginBottom: "4px" },
  pill: (c) => ({ display: "inline-block", fontSize: "8px", letterSpacing: "1.5px", padding: "2px 6px", border: `1px solid ${c || "#2a2a2a"}`, color: c || "#666", textTransform: "uppercase", marginLeft: "6px" }),
  archBox: { border: "1px solid #1e3d28", background: "#080f0a", padding: "24px", marginBottom: "20px" },
  archLabel: { fontSize: "9px", letterSpacing: "3px", color: accent, textTransform: "uppercase", marginBottom: "12px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "24px" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "12px", marginBottom: "24px" },
  metricVal: { fontSize: "28px", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1 },
  metricLabel: { fontSize: "9px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" },
  metricSub: { fontSize: "10px", color: "#444", marginTop: "2px" },
  progressBar: { height: "4px", background: "#1a1a1a", marginTop: "8px", position: "relative" },
  progressFill: (pct, c) => ({ height: "100%", width: `${Math.min(pct, 100)}%`, background: c || accent, transition: "width .5s ease" }),
  tableRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #141414", fontSize: "12px", alignItems: "center" },
  stat: { display: "inline-block", textAlign: "center", padding: "16px 24px", border: "1px solid #1e1e1e", background: "#0d0d0d", marginRight: "8px", marginBottom: "8px" },
  statVal: { fontSize: "24px", fontWeight: 900, color: accent, letterSpacing: "-1px" },
  statLabel: { fontSize: "9px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", marginTop: "4px" },
  warn: { borderLeft: `3px solid ${accent}`, paddingLeft: "16px", marginBottom: "24px" },
  sPill: { display: "inline-block", background: "#111", border: "1px solid #222", color: "#888", fontSize: "10px", padding: "2px 8px", margin: "2px", letterSpacing: "1px" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n, d = 2) => (n != null ? n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }) : "—");
const fmtPct = (n) => (n != null ? `${n >= 0 ? "+" : ""}${fmt(n, 1)}%` : "—");
const fmtUsd = (n) => (n != null ? `$${fmt(n)}` : "—");
const pnlColor = (n) => (n == null ? "#555" : n >= 0 ? accent : red);

function Metric({ label, value, sub, color }) {
  return (
    <div style={S.card}>
      <div style={{ ...S.metricVal, color: color || "#fff" }}>{value}</div>
      <div style={S.metricLabel}>{label}</div>
      {sub && <div style={S.metricSub}>{sub}</div>}
    </div>
  );
}

function GaugeBar({ label, current, max, unit, danger }) {
  const pct = max > 0 ? (parseFloat(current) / max) * 100 : 0;
  const color = danger ? (pct > 70 ? red : pct > 40 ? amber : accent) : accent;
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
        <span style={{ color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>{label}</span>
        <span style={{ color }}>{current}{unit || ""} / {max}{unit || ""}</span>
      </div>
      <div style={S.progressBar}><div style={S.progressFill(pct, color)} /></div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Dashboard({ d, fetchError }) {
  const totalPnl = d.account.equity - d.account.start_equity;
  const totalPnlPct = (totalPnl / d.account.start_equity) * 100;
  const dayPct = (d.day / d.target_days) * 100;
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <div>
      {/* Delayed data banner (hidden for live key holders) */}
      {!isLive && <div style={{ background: "#1a1400", border: "1px solid #3a3000", padding: "10px 16px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "11px", color: "#aa8800", letterSpacing: "1px" }}>This dashboard shows data from the previous trading cycle (24h delay).</span>
        <a href="https://buy.stripe.com/aFa14o0bdfW82CQ1Owc7u01" style={{ fontSize: "10px", color: accent, letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", fontWeight: 700 }}>Get real-time access</a>
      </div>}
      {/* Day Progress */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h2 style={S.h2}>Paper Trading — Day {d.day} / {d.target_days}</h2>
            <div style={{ fontSize: "11px", color: "#444", letterSpacing: "1px" }}>
              Graduation target: {d.graduation_date} · {d.target_days - d.day} days remaining
              {fetchError && <span style={{ color: red, marginLeft: "12px" }}>⚠ {fetchError}</span>}
              {!fetchError && <span style={{ color: accent, marginLeft: "12px" }}>● LIVE</span>}
            </div>
          </div>
          <div style={{ fontSize: "10px", color: "#333", textAlign: "right" }}>
            <div>{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            <div style={{ color: "#555", fontVariantNumeric: "tabular-nums" }}>{now.toLocaleTimeString("en-US", { hour12: false })} UTC+{-now.getTimezoneOffset() / 60}</div>
          </div>
        </div>
        <div style={S.progressBar}><div style={S.progressFill(dayPct)} /></div>
      </div>

      {/* Account */}
      <div style={S.tag}>Account</div>
      <div style={S.grid}>
        <Metric label="Equity" value={fmtUsd(d.account.equity)} sub={`Peak: ${fmtUsd(d.account.peak_equity)}`} />
        <Metric label="Total P&L" value={fmtUsd(totalPnl)} sub={fmtPct(totalPnlPct)} color={pnlColor(totalPnl)} />
        <Metric label="Cash" value={fmtUsd(d.account.cash)} />
        <Metric label="Buying Power" value={fmtUsd(d.account.buying_power)} />
      </div>

      {/* Today's Cycle */}
      <div style={S.tag}>Today's Cycle</div>
      <div style={S.grid}>
        <Metric label="Disclosures" value={d.signals_today.disclosures_fetched} sub={`${d.signals_today.tickers_scanned} unique tickers`} color={accent} />
        <Metric label="Signals" value={d.signals_today.signals_generated} color={accent} />
        <Metric label="Orders Submitted" value={d.signals_today.orders_submitted} color={accent} />
        <Metric label="Orders Blocked" value={d.signals_today.orders_blocked} color={d.signals_today.orders_blocked > 0 ? amber : "#555"} />
      </div>

      <div style={S.grid2}>
        {/* Open Positions */}
        <div style={S.card}>
          <div style={S.tag}>Open Positions</div>
          {d.positions.length === 0 ? (
            <div style={{ color: "#333", fontSize: "12px" }}>No open positions</div>
          ) : d.positions.map((p, i) => (
            <div key={i} style={{ marginBottom: i < d.positions.length - 1 ? "12px" : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{p.ticker}</span>
                  <span style={S.pill(accent)}>LONG</span>
                  <span style={{ color: "#444", fontSize: "10px", marginLeft: "8px" }}>{p.qty} shares</span>
                </div>
                <span style={{ color: pnlColor(p.pnl), fontSize: "13px", fontWeight: 700 }}>{fmtUsd(p.pnl)}</span>
              </div>
              <div style={{ fontSize: "10px", color: "#444", marginTop: "4px", display: "flex", gap: "16px" }}>
                <span>Entry: <span style={{ color: "#888" }}>${fmt(p.entry_price)}</span></span>
                <span>Now: <span style={{ color: "#888" }}>${fmt(p.current_price)}</span></span>
                <span>SL: <span style={{ color: red }}>${fmt(p.stop_loss)}</span></span>
                <span>TP: <span style={{ color: accent }}>${fmt(p.take_profit)}</span></span>
              </div>
              <div style={{ marginTop: "8px", position: "relative", height: "12px", background: "#111", border: "1px solid #1e1e1e" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${((p.entry_price - p.stop_loss) / (p.take_profit - p.stop_loss)) * 100}%`, background: "rgba(255,68,68,0.1)", borderRight: `1px solid ${red}` }} />
                <div style={{ position: "absolute", left: `${Math.max(0, Math.min(100, ((p.current_price - p.stop_loss) / (p.take_profit - p.stop_loss)) * 100))}%`, top: 0, bottom: 0, width: "2px", background: "#fff", transform: "translateX(-1px)" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "8px", color: "#333", marginTop: "2px" }}>
                <span>SL ${fmt(p.stop_loss)}</span>
                <span>TP ${fmt(p.take_profit)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Monitor */}
        <div style={S.card}>
          <div style={S.tag}>Risk Monitor</div>
          <GaugeBar label="Drawdown" current={fmt(d.risk_state.drawdown_pct, 1)} max={d.risk_state.max_drawdown} unit="%" danger />
          <GaugeBar label="Consecutive Losses" current={d.risk_state.consecutive_losses} max={d.risk_state.max_consecutive} danger />
          <GaugeBar label="Portfolio Exposure" current={fmt(d.risk_state.exposure_pct, 1)} max={d.risk_state.max_exposure} unit="%" danger />
          <GaugeBar label="Open Positions" current={d.risk_state.open_positions} max={d.risk_state.max_positions} />
        </div>
      </div>

      <div style={S.grid2}>
        {/* Performance */}
        <div style={S.card}>
          <div style={S.tag}>Performance</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><div style={{ ...S.metricVal, fontSize: "20px", color: "#fff" }}>{d.performance.total_trades}</div><div style={S.metricLabel}>Total Trades</div></div>
            <div><div style={{ ...S.metricVal, fontSize: "20px", color: d.performance.win_rate != null ? (d.performance.win_rate >= 45 ? accent : red) : "#333" }}>{d.performance.win_rate != null ? `${d.performance.win_rate}%` : "—"}</div><div style={S.metricLabel}>Win Rate</div></div>
            <div><div style={{ ...S.metricVal, fontSize: "20px", color: d.performance.avg_r_multiple != null ? accent : "#333" }}>{d.performance.avg_r_multiple != null ? `${d.performance.avg_r_multiple}R` : "—"}</div><div style={S.metricLabel}>Avg R-Multiple</div></div>
            <div><div style={{ ...S.metricVal, fontSize: "20px", color: pnlColor(d.performance.total_pnl) }}>{fmtUsd(d.performance.total_pnl)}</div><div style={S.metricLabel}>Total P&L</div></div>
          </div>
          <hr style={{ ...S.divider, margin: "16px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
            <span style={{ color: "#444" }}>W: <span style={{ color: accent }}>{d.performance.wins}</span></span>
            <span style={{ color: "#444" }}>L: <span style={{ color: red }}>{d.performance.losses}</span></span>
            <span style={{ color: "#444" }}>Open: <span style={{ color: "#888" }}>{d.performance.open}</span></span>
          </div>
        </div>

        {/* Top Disclosures */}
        <div style={S.card}>
          <div style={S.tag}>Top Congressional Buys (7d)</div>
          {d.top_disclosures.length === 0
            ? <div style={{ color: "#333", fontSize: "12px" }}>No disclosures this week</div>
            : d.top_disclosures.map((disc, i) => (
              <div key={i} style={S.tableRow}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: accent, fontSize: "16px", fontWeight: 900, minWidth: "50px" }}>{disc.ticker}</span>
                  <span style={{ color: "#555", fontSize: "10px" }}>{disc.members} member{disc.members > 1 ? "s" : ""}</span>
                </div>
                <span style={{ color: "#444", fontSize: "10px" }}>{disc.amount_est}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Trade Log */}
      <div style={S.tag}>Trade Log</div>
      <div style={S.card}>
        <div style={{ ...S.tableRow, borderBottom: "1px solid #222", color: "#444", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          <span style={{ flex: "0 0 80px" }}>Date</span>
          <span style={{ flex: "0 0 60px" }}>Ticker</span>
          <span style={{ flex: "0 0 40px" }}>Side</span>
          <span style={{ flex: "0 0 40px", textAlign: "right" }}>Qty</span>
          <span style={{ flex: "0 0 70px", textAlign: "right" }}>Price</span>
          <span style={{ flex: "0 0 60px", textAlign: "right" }}>Status</span>
          <span style={{ flex: "0 0 70px", textAlign: "right" }}>P&L</span>
        </div>
        {d.recent_trades.map((t, i) => (
          <div key={i} style={{ ...S.tableRow, color: "#888" }}>
            <span style={{ flex: "0 0 80px", fontSize: "11px" }}>{t.date}</span>
            <span style={{ flex: "0 0 60px", color: "#fff", fontWeight: 700, fontSize: "11px" }}>{t.ticker}</span>
            <span style={{ flex: "0 0 40px", color: t.side === "BUY" ? accent : red, fontSize: "10px" }}>{t.side}</span>
            <span style={{ flex: "0 0 40px", textAlign: "right", fontSize: "11px" }}>{t.qty}</span>
            <span style={{ flex: "0 0 70px", textAlign: "right", fontSize: "11px" }}>${fmt(t.price)}</span>
            <span style={{ flex: "0 0 60px", textAlign: "right" }}><span style={S.pill(t.status === "OPEN" ? accent : t.status === "WIN" ? accent : t.status === "LOSS" ? red : "#444")}>{t.status}</span></span>
            <span style={{ flex: "0 0 70px", textAlign: "right", color: pnlColor(t.pnl), fontSize: "11px" }}>{t.pnl != null ? fmtUsd(t.pnl) : "—"}</span>
          </div>
        ))}
      </div>

      {/* Graduation Checklist */}
      <hr style={S.divider} />
      <div style={S.tag}>Graduation Checklist</div>
      <div style={S.mono}>{(() => {
        const g = d.graduation || {};
        const ck = (ok) => ok ? "■" : "□";
        return `  ${ck(g.trading_days_ok)}  90 consecutive trading days     Day ${g.trading_days || d.day} / ${g.trading_days_target || 90}
  ${ck(g.win_rate_ok)}  Win rate > 45%                  ${g.win_rate != null ? g.win_rate + "%" : "Pending"}
  ${ck(g.avg_r_ok)}  Avg R-multiple > 1.5            ${g.avg_r_multiple != null ? g.avg_r_multiple + "R" : "Pending"}
  ${ck(g.max_drawdown_ok !== false)}  Max drawdown never exceeded 10% ${g.max_drawdown_seen != null ? g.max_drawdown_seen + "%" : "0%"} peak
  ${ck(g.exceptions_ok)}  Zero unhandled exceptions       ${g.unhandled_exceptions != null ? g.unhandled_exceptions + " found" : "Pending"}
  ${ck(g.risk_gates_ok)}  All risk gates triggered ≥1     ${g.risk_gates_triggered != null ? g.risk_gates_triggered + " triggered" : "Pending"}
  □  Manual trade review complete    Ongoing`;
      })()}</div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MANIFESTO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Manifesto() {
  return (
    <div>
      <div style={S.tag}>Thought Piece</div>
      <h2 style={S.h2}>The Disclosure Edge</h2>
      <p style={S.sub}>Why congressional trading data is the last legal alpha — and how to harvest it</p>

      <div style={S.warn}>
        <p style={{ ...S.p, marginBottom: 0, color: "#ccc" }}>
          <span style={S.highlight}>The insight:</span> Members of Congress trade stocks
          while writing the laws that move those stocks. The STOCK Act forced them to disclose.
          Most investors ignore this data. The ones who don't are still doing it manually.
          We built a machine that watches every disclosure, validates the signal,
          and executes — <span style={S.highlight}>before the market prices it in</span>.
        </p>
      </div>

      <hr style={S.divider} />

      <div style={S.tag}>Thesis I</div>
      <p style={S.blockTitle}>Information Asymmetry Is a Feature, Not a Bug</p>
      <p style={S.p}>
        Congressional insiders file purchase disclosures 30–45 days after the transaction.
        Most retail traders never see them. The ones who do can't act fast enough.
        The edge isn't the data — it's public. The edge is{" "}
        <span style={S.highlight}>speed of interpretation</span>,{" "}
        <span style={S.highlight}>systematic filtering</span>, and{" "}
        <span style={S.highlight}>emotionless execution</span>.
        A bot doesn't hesitate. It doesn't second-guess. It doesn't miss market open
        because it overslept.
      </p>

      <div style={S.tag}>Thesis II</div>
      <p style={S.blockTitle}>One Signal Is Noise. Clustering Is Alpha.</p>
      <p style={S.p}>
        A single congressman buying NVDA means nothing — maybe their kid likes gaming.
        But when <span style={S.highlight}>multiple members across both parties</span> buy
        the same ticker in the same window? That's a consensus signal from people with
        non-public briefing access. Our signal generator doesn't chase individuals.
        It hunts for <span style={S.highlight}>convergence patterns</span> — multi-member,
        same-direction, high-conviction clusters backed by volume and trend confirmation.
      </p>

      <div style={S.tag}>Thesis III</div>
      <p style={S.blockTitle}>Risk Management Is the Product</p>
      <p style={S.p}>
        Anyone can buy a stock. The system's real value is in what it{" "}
        <span style={S.highlight}>refuses to do</span>. Fixed-fractional sizing caps
        every position at 2% of equity at risk. ATR-calibrated stop-losses adapt to
        volatility. Drawdown gates shut the system down before it spirals. Holding
        period limits force exits before thesis decay. The bot isn't optimized to win
        big — it's optimized to <span style={S.highlight}>never blow up</span>.
      </p>

      <div style={S.tag}>Thesis IV</div>
      <p style={S.blockTitle}>Paper First. Ego Never.</p>
      <p style={S.p}>
        We run on Alpaca paper trading. $100k simulated equity. Real market data.
        Real order execution logic. Zero real money at risk. This isn't caution —
        it's engineering discipline. You don't deploy to production without staging.
        You don't trade real capital without a verified track record. The system earns
        its way to live money through <span style={S.highlight}>auditable performance</span>,
        not gut feeling.
      </p>

      <div style={S.tag}>The Mandate</div>
      <p style={{ ...S.p, color: "#e8e8e0", fontSize: "16px", lineHeight: 1.9 }}>
        Don't trade like a human. Build a{" "}
        <span style={S.highlight}>systematic disclosure harvesting machine</span>{" "}
        that watches Congress, validates conviction, manages risk, and executes —
        every single trading day, without you in the chair.
      </p>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLUEPRINT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Blueprint() {
  const phases = [
    { num: "PHASE 01", title: "Disclosure Ingestion", sub: "Capture the raw signal from Congress", steps: [
      { name: "Quiver Quantitative API", detail: "Every cycle fetches congressional trading disclosures from the /beta/live/congresstrading endpoint. Configurable lookback window (default: 7 days). Filters for PURCHASE transactions only — we follow the money in." },
      { name: "Disclosure Normalization", detail: "Raw API responses are parsed into typed Disclosure dataclasses: ticker, representative, transaction type, disclosure date, estimated amount. Deduplication by (ticker, representative, date) tuple." },
      { name: "Candidate Extraction", detail: "Unique tickers are extracted from the disclosure set. These become the candidate universe for market data analysis. No manual watchlists, no bias — pure data-driven selection." },
    ]},
    { num: "PHASE 02", title: "Market Validation", sub: "Confirm the signal with price action", steps: [
      { name: "Daily Bar Retrieval", detail: "For each candidate ticker, the system fetches ~100 days of daily OHLCV bars from Alpaca's IEX feed. This provides enough history for moving average and ATR computation." },
      { name: "Technical Indicator Computation", detail: "ATR-14 (Average True Range), MA-20, and MA-50 are computed inline. No external TA library — pure Python Decimal math for precision. These indicators gate entry and calibrate stop-losses." },
      { name: "Trend & Volume Filtering", detail: "Signals require MA-20 > MA-50 (uptrend confirmation) and minimum volume thresholds. This eliminates low-liquidity traps and counter-trend entries. Only trade with the wind at your back." },
    ]},
    { num: "PHASE 03", title: "Signal Generation & Conviction Scoring", sub: "Separate noise from alpha", steps: [
      { name: "Disclosure Grouping", detail: "Disclosures are grouped by ticker. Tickers with multiple members buying in the same window score higher conviction. A single purchase is noise; three members buying is a signal." },
      { name: "Multi-Factor Signal Scoring", detail: "Each candidate is scored on: member count, transaction volume (estimated amounts), trend alignment (MA crossover), and volatility regime (ATR relative to price). Only top-scoring signals proceed." },
      { name: "Signal Object Generation", detail: "Qualifying tickers produce a Signal dataclass: ticker, direction, entry price (latest close), conviction score, ATR value, and the disclosure cluster that triggered it. Fully auditable." },
    ]},
    { num: "PHASE 04", title: "Risk Gating & Position Sizing", sub: "The system's immune system", steps: [
      { name: "Risk Gate Checks", detail: "Before any order: check max drawdown from peak equity, consecutive loss count, total portfolio exposure, and open position count. If ANY gate fails, the trade is blocked and logged. No overrides." },
      { name: "Fixed-Fractional Position Sizing", detail: "Each position risks exactly risk_per_trade (default 2%) of account equity. Position size = (equity × risk_fraction) / (entry_price - stop_loss_price). This mathematically caps downside per trade." },
      { name: "ATR-Calibrated Bracket Orders", detail: "Stop-loss is set at entry minus (ATR × stop_atr_multiple). Take-profit at entry plus (ATR × reward_risk_ratio × stop_atr_multiple). The bracket adapts to each stock's volatility — tight stops on calm stocks, wide stops on volatile ones." },
    ]},
    { num: "PHASE 05", title: "Execution & Lifecycle Management", sub: "Orders in. Positions managed. State persisted.", steps: [
      { name: "Alpaca Bracket Order Submission", detail: "Each approved signal becomes a bracket order on Alpaca: entry (market or limit), stop-loss, and take-profit — all in one atomic API call. Alpaca monitors SL/TP 24/7 between bot cycles." },
      { name: "Holding Period Enforcement", detail: "On every cycle, the bot checks open positions against their entry dates. Positions exceeding max_holding_days are force-closed via market sell. Thesis decay is real — swing trades have expiration dates." },
      { name: "State Persistence & Recovery", detail: "Entry dates, peak equity, and consecutive losses are persisted to bot_state.json after every cycle. If the bot crashes and restarts, it resumes with full context. No amnesia." },
    ]},
  ];

  return (
    <div>
      <div style={S.tag}>Step-by-Step Blueprint</div>
      <h2 style={S.h2}>The Codex Trading Pipeline</h2>
      <p style={S.sub}>Five phases · Disclosure to execution · Fully autonomous</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "40px" }}>
        <div style={S.stat}><div style={S.statVal}>454</div><div style={S.statLabel}>Disclosures / 30d</div></div>
        <div style={S.stat}><div style={S.statVal}>106</div><div style={S.statLabel}>Tickers Scanned</div></div>
        <div style={S.stat}><div style={S.statVal}>2%</div><div style={S.statLabel}>Max Risk / Trade</div></div>
        <div style={S.stat}><div style={S.statVal}>$100K</div><div style={S.statLabel}>Paper Equity</div></div>
      </div>

      {phases.map((phase, pi) => (
        <div key={pi} style={{ marginBottom: "40px" }}>
          <div style={{ ...S.stepNum, fontSize: "11px", marginBottom: "4px" }}>{phase.num}</div>
          <p style={{ ...S.blockTitle, fontSize: "16px", color: "#fff", marginBottom: "2px" }}>{phase.title}</p>
          <p style={{ ...S.p, fontSize: "11px", color: "#444", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "2px" }}>{phase.sub}</p>
          {phase.steps.map((step, si) => (
            <div key={si} style={S.card}>
              <div style={S.stepNum}>{`0${si + 1}`}</div>
              <div style={S.blockTitle}>{step.name}</div>
              <p style={{ ...S.p, marginBottom: 0 }}>{step.detail}</p>
            </div>
          ))}
          {pi < phases.length - 1 && <hr style={S.divider} />}
        </div>
      ))}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ARCHITECTURE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Architecture() {
  return (
    <div>
      <div style={S.tag}>System Architecture</div>
      <h2 style={S.h2}>Codex Trading Bot OS</h2>
      <p style={S.sub}>Textual diagram · Module by module · Data & control flow</p>

      <div style={S.mono}>{`
╔══════════════════════════════════════════════════════════════╗
║                 WINDOWS TASK SCHEDULER                        ║
║            Daily trigger · 16:00 CEST (10:00 ET)             ║
║            30 min after US market open                        ║
╚══════════════════════════════╤═══════════════════════════════╝
                               │  python -m trading_bot
╔══════════════════════════════▼═══════════════════════════════╗
║                   ENTRY POINT (__main__.py)                   ║
║     Load .env → Config → Wire components → Run cycle         ║
║     Logging: console + rotating file (5MB × 10)              ║
╚══════════════════════════════╤═══════════════════════════════╝
                               │
╔══════════════════════════════▼═══════════════════════════════╗
║                   ORCHESTRATOR (orchestrator.py)              ║
║                                                              ║
║   ┌─────────────────────────────────────────────────┐        ║
║   │  1. Close expired positions (holding days)       │        ║
║   │  2. Fetch disclosures (Quiver API)               │        ║
║   │  3. Fetch market data per candidate (Alpaca)     │        ║
║   │  4. Generate signals (multi-member clustering)   │        ║
║   │  5. Risk-gate each signal                        │        ║
║   │  6. Size position (fixed-fractional + ATR)       │        ║
║   │  7. Submit bracket orders                        │        ║
║   │  8. Persist state → bot_state.json               │        ║
║   └─────────────────────────────────────────────────┘        ║
║                                                              ║
║   Returns: CycleResult (signals, submitted, blocked, closed) ║
╚══════════════════════════════╤═══════════════════════════════╝
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
╔═══════▼════════╗  ╔═════════▼════════╗  ╔══════════▼═════════╗
║  DATA LAYER    ║  ║  LOGIC LAYER     ║  ║  EXECUTION LAYER   ║
║                ║  ║                  ║  ║                    ║
║ disclosure_    ║  ║ signal_          ║  ║ execution.py       ║
║  client.py     ║  ║  generator.py    ║  ║ ├─ submit_bracket  ║
║ ├─ Quiver API  ║  ║ ├─ group by tick ║  ║ │   _order()       ║
║ │  /beta/live/ ║  ║ ├─ filter volume ║  ║ ├─ get_account     ║
║ │  congress    ║  ║ ├─ check trend   ║  ║ │   _equity()      ║
║ │  trading     ║  ║ └─ score & emit  ║  ║ ├─ get_open        ║
║ │              ║  ║                  ║  ║ │   _positions()    ║
║ market_data.py ║  ║ position_        ║  ║ └─ cancel / close  ║
║ ├─ Alpaca bars ║  ║  sizer.py        ║  ║                    ║
║ ├─ ATR-14      ║  ║ ├─ risk fraction ║  ║ TARGET:            ║
║ ├─ MA-20       ║  ║ ├─ ATR stop-loss ║  ║ Alpaca Paper API   ║
║ └─ MA-50       ║  ║ └─ R-multiple TP ║  ║ paper-api.alpaca   ║
║                ║  ║                  ║  ║  .markets           ║
║                ║  ║ risk_monitor.py  ║  ║                    ║
║                ║  ║ ├─ drawdown gate ║  ╚════════════════════╝
║                ║  ║ ├─ consec. loss  ║
║                ║  ║ ├─ exposure cap  ║
║                ║  ║ └─ holding days  ║
╚════════════════╝  ╚══════════════════╝`}</div>

      <div style={S.tag}>Signal Pipeline</div>
      <div style={S.archBox}>
        <div style={S.archLabel}>From Disclosure to Order</div>
        <div style={S.mono}>{`
  QUIVER API                    ALPACA DATA API
  (congress disclosures)        (OHLCV bars)
       │                              │
       ▼                              ▼
  454 disclosures              100-day bars per ticker
       │                              │
       └──────────┬───────────────────┘
                  │
                  ▼
         Signal Generator
         ├─ Group by ticker → 106 unique tickers
         ├─ Filter: volume > threshold
         ├─ Filter: MA-20 > MA-50 (uptrend)
         ├─ Score: member count × amount × trend
         └─ Emit: top signals
                  │
                  ▼
           Risk Gate
           ├─ Drawdown < 10%?          ✓
           ├─ Consecutive losses < 3?   ✓
           ├─ Exposure < 80%?           ✓
           └─ Position count < max?     ✓
                  │
                  ▼
          Position Sizer
          ├─ Risk: 2% of equity
          ├─ Stop: entry - (ATR × 1.5)
          ├─ Qty:  risk / (entry - stop)
          └─ TP:   entry + (ATR × 1.5 × 2)
                  │
                  ▼
         ALPACA PAPER API
         ├─ Bracket order submitted
         ├─ Entry: MARKET BUY
         ├─ Stop-loss auto-monitored
         └─ Take-profit auto-monitored`}</div>
      </div>

      <div style={S.tag}>Between Cycles</div>
      <div style={S.archBox}>
        <div style={S.archLabel}>What happens when the bot sleeps</div>
        <div style={S.mono}>{`
  BOT CYCLE RUNS (16:00 CEST)
       │
       ├──► Bracket order placed on Alpaca
       │
       ▼
  BOT SLEEPS — ALPACA MONITORS 24/7
       │
       ├─── Price hits stop-loss?  → Alpaca auto-sells
       ├─── Price hits take-profit? → Alpaca auto-sells
       └─── Neither?  → Position held
       │
       ▼
  NEXT DAY — BOT WAKES (16:00 CEST)
       │
       ├──► Check open positions vs entry dates
       ├──► Force-close if > max_holding_days
       ├──► Scan new disclosures
       ├──► Generate new signals
       └──► Submit new bracket orders
       │
       ▼
  STATE PERSISTED → bot_state.json
  LOGS WRITTEN   → logs/trading_bot.log
  DASHBOARD JSON  → GitHub Gist (auto-pushed)`}</div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTION PLAN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function ActionPlan({ graduation }) {
  const g = graduation;
  const ck = (ok) => ok ? "■" : "□";

  const stack = [
    { layer: "Brokerage", tools: ["Alpaca Markets (Paper Trading)", "Alpaca Data API (IEX feed)"], why: "Commission-free. First-class API. Paper trading with real market data. Bracket orders in a single call." },
    { layer: "Disclosure Data", tools: ["Quiver Quantitative API", "STOCK Act filings (source)"], why: "Structured congressional trading data. /beta/live/congresstrading endpoint. The signal source." },
    { layer: "Runtime & Language", tools: ["Python 3.12", "httpx (async-ready HTTP)", "python-dotenv"], why: "Minimal dependency surface. No bloated frameworks. Dataclasses for models. Decimal for precision." },
    { layer: "Risk Framework", tools: ["Fixed-fractional sizing", "ATR-14 stop calibration", "Drawdown gating", "Holding period limits"], why: "Four independent safety layers. Position sizing caps downside. ATR adapts to volatility. Drawdown gates halt the system." },
    { layer: "Scheduling & Ops", tools: ["Windows Task Scheduler", "Rotating file logs (5MB × 10)", "JSON state persistence"], why: "No cloud costs. No Docker. A scheduled task that runs at market open and logs everything." },
    { layer: "Dashboard & Observability", tools: ["Codex Command Center (React)", "GitHub Gist (live data host)", "CodeSandbox (zero-deploy UI)"], why: "Auto-generated after every cycle. Pushed to a public Gist. Dashboard fetches live on page load." },
    { layer: "Testing & Validation", tools: ["pytest (30 unit tests)", "validate_apis.py", "Paper trading verification"], why: "Every module tested. API connectivity validated. Real bracket orders confirmed on paper." },
  ];

  const phases = [
    { phase: "Done", title: "MVP Complete", tasks: ["Config system with env vars and risk validation", "Quiver disclosure client (live endpoint)", "Alpaca market data client (bars + ATR + MAs)", "Signal generator with multi-member clustering", "Fixed-fractional position sizer with ATR brackets", "Bracket order execution on Alpaca paper", "Risk monitor (drawdown, losses, exposure, holding)", "Orchestrator with full scan-to-trade cycle", "State persistence (JSON) + rotating file logs", "30 unit tests passing + API validation script", "Windows Task Scheduler (daily 16:00 CEST)", "Codex Command Center — live dashboard", "Dashboard auto-push: bot → GitHub Gist"] },
    { phase: "Next", title: "Hardening & Observability", tasks: ["Skip tickers with existing open positions", "Daily P&L summary logged after each cycle", "Track win/loss ratio in state store", "Email or Slack alert on order fills and anomalies", "Equity curve chart in dashboard"] },
    { phase: "Future", title: "Strategy Evolution", tasks: ["Backtest engine: replay historical disclosures", "Conviction weighting: committee membership, party, amount", "Sector rotation: weight signals by sector momentum", "Multi-timeframe confirmation (weekly + daily)", "Graduate to live trading after 90-day paper track record"] },
    { phase: "Vision", title: "Scale the Edge", tasks: ["Add Senate + House committee-level signals", "Corporate insider filings (SEC Form 4) as overlay", "Options strategy layer for high-conviction signals", "Cloud deployment (AWS Lambda) for zero-downtime", "Multi-account support for capital scaling"] },
  ];

  return (
    <div>
      <div style={S.tag}>Action Plan · Tools · Stack</div>
      <h2 style={S.h2}>The Codex Stack</h2>
      <p style={S.sub}>Current stack · Roadmap · From paper to production</p>

      <div style={S.tag}>Technology Stack</div>
      {stack.map((s, i) => (
        <div key={i} style={{ ...S.card, marginBottom: "12px" }}>
          <div><div style={S.stepNum}>{`LAYER ${String(i + 1).padStart(2, "0")}`}</div><div style={S.blockTitle}>{s.layer}</div>
            <div style={{ marginTop: "6px" }}>{s.tools.map((t, j) => <span key={j} style={S.sPill}>{t}</span>)}</div>
          </div>
          <p style={{ ...S.p, marginTop: "10px", marginBottom: 0, fontSize: "12px" }}>{s.why}</p>
        </div>
      ))}

      <hr style={S.divider} />
      <div style={S.tag}>Execution Roadmap</div>
      {phases.map((w, i) => (
        <div key={i} style={{ display: "flex", gap: "20px", marginBottom: "28px" }}>
          <div style={{ minWidth: "80px" }}>
            <div style={{ ...S.stepNum, fontSize: "9px" }}>{w.phase}</div>
            <div style={{ fontSize: "11px", color: "#fff", fontWeight: 700 }}>{w.title}</div>
          </div>
          <div style={{ borderLeft: `2px solid ${i === 0 ? accent : "#1e1e1e"}`, paddingLeft: "20px", flex: 1 }}>
            {w.tasks.map((t, j) => (
              <div key={j} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "flex-start" }}>
                <span style={{ color: i === 0 ? accent : "#333", fontSize: "10px", marginTop: "3px" }}>{i === 0 ? "✓" : "▸"}</span>
                <span style={{ fontSize: "13px", color: i === 0 ? "#666" : "#999" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <hr style={S.divider} />
      <div style={S.tag}>The Graduation Criteria</div>
      <div style={{ ...S.card, borderColor: "#1e3d28" }}>
        <p style={{ ...S.blockTitle, color: accent }}>
          Paper → Live Trading Checklist
          {g && <span style={{ fontSize: "10px", color: "#555" }}> (live from Gist)</span>}
        </p>
        <div style={S.mono}>{g ? `
  ${ck(g.trading_days_ok)}  90 consecutive trading days       Day ${g.trading_days || 0} / ${g.trading_days_target || 90}
  ${ck(g.win_rate_ok)}  Win rate > 45%                    ${g.win_rate != null ? g.win_rate + "%" : "Pending"}
  ${ck(g.avg_r_ok)}  Average R-multiple > 1.5           ${g.avg_r_multiple != null ? g.avg_r_multiple + "R" : "Pending"}
  ${ck(g.max_drawdown_ok !== false)}  Max drawdown never exceeded 10%  ${g.max_drawdown_seen != null ? g.max_drawdown_seen + "%" : "0%"} peak
  ${ck(g.exceptions_ok)}  Zero unhandled exceptions          ${g.unhandled_exceptions != null ? g.unhandled_exceptions + " found" : "Pending"}
  ${ck(g.risk_gates_ok)}  All risk gates triggered ≥1        ${g.risk_gates_triggered != null ? g.risk_gates_triggered + " triggered" : "Pending"}
  □  Manual trade review complete     Ongoing

  When all boxes are checked:
  flip ALPACA_BASE_URL from paper-api → api.alpaca.markets
  Start with 10% of target capital. Scale quarterly.` : `
  □  90 consecutive trading days on paper
  □  Win rate > 45% (swing trading baseline)
  □  Average R-multiple > 1.5 on winners
  □  Max drawdown never exceeded 10%
  □  Zero unhandled exceptions in logs
  □  All risk gates triggered correctly at least once
  □  Manual review of every blocked trade — was it right?

  When all boxes are checked:
  flip ALPACA_BASE_URL from paper-api → api.alpaca.markets
  Start with 10% of target capital. Scale quarterly.`}</div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WAITLIST — Formspree integration (plain fetch, no library needed)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("https://formspree.io/f/xeepwjpd", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, name, _subject: "Codex Trading — New Waitlist Signup" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        setName("");
      } else {
        const data = await res.json();
        setErrorMsg(data?.errors?.map((e) => e.message).join(", ") || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "#111",
    border: "1px solid #2a2a2a",
    color: "#e8e8e0",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "12px",
    transition: "border-color .2s",
  };

  const btnStyle = {
    width: "100%",
    padding: "14px",
    background: accent,
    color: "#000",
    border: "none",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "'Courier New', monospace",
    cursor: status === "sending" ? "wait" : "pointer",
    opacity: status === "sending" ? 0.6 : 1,
    transition: "opacity .2s",
  };

  return (
    <div>
      <div style={S.tag}>Early Access</div>
      <h2 style={S.h2}>Get Notified When Codex Goes Live</h2>
      <p style={S.sub}>Paper-validated · Systematic · Congressional edge</p>

      <div style={{ maxWidth: "520px" }}>
        <p style={S.p}>
          Codex Trading Bot is currently proving itself on paper — $100K simulated equity,
          real market data, real congressional disclosures, zero human intervention.
        </p>
        <p style={S.p}>
          When it graduates (90 days, verified metrics, audited risk gates),
          we're opening access to a <span style={S.highlight}>limited number of users</span>.
        </p>
        <p style={{ ...S.p, color: "#e8e8e0" }}>
          Join the waitlist to be first in line.
        </p>

        <hr style={S.divider} />

        {status === "success" ? (
          <div style={{ ...S.card, borderColor: accent, textAlign: "center", padding: "32px 24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>✓</div>
            <div style={{ ...S.blockTitle, color: accent, marginBottom: "8px" }}>You're on the list.</div>
            <p style={{ ...S.p, marginBottom: 0, fontSize: "12px" }}>
              We'll email you when Codex Trading Bot is ready for live access.
              <br />No spam. Just the signal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Name (optional)
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              style={inputStyle}
            />

            <label style={{ fontSize: "9px", color: "#555", letterSpacing: "2px", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={inputStyle}
            />

            {status === "error" && (
              <div style={{ color: red, fontSize: "11px", marginBottom: "12px" }}>
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={status === "sending"} style={btnStyle}>
              {status === "sending" ? "Sending..." : "Join the Waitlist →"}
            </button>

            <p style={{ fontSize: "9px", color: "#333", marginTop: "12px", letterSpacing: "1px" }}>
              No spam. No selling your data. One email when we go live.
            </p>
          </form>
        )}

        <hr style={S.divider} />

        <div style={S.tag}>What You'll Get</div>
        <div style={S.card}>
          <div style={S.mono}>{`  ■  Early access before public launch
  ■  Full transparency — live dashboard link
  ■  Paper trading track record (90 days audited)
  ■  Risk framework documentation
  ■  Priority onboarding support`}</div>
        </div>

        <div style={S.tag}>What This Is Not</div>
        <div style={S.card}>
          <div style={S.mono}>{`  ×  Not financial advice
  ×  Not a guaranteed return
  ×  Not a black box — fully transparent system
  ×  Not a pump-and-dump signal group`}</div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROOT APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const tabs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "manifesto", label: "Manifesto" },
  { id: "blueprint", label: "Blueprint" },
  { id: "architecture", label: "Architecture" },
  { id: "action", label: "Action Plan" },
  { id: "waitlist", label: "⚡ Early Access" },
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [d, setD] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetch(GIST_URL + "?t=" + Date.now())
      .then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then((data) => { setD(data); setLoading(false); })
      .catch((e) => { setFetchError(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div style={{ ...S.root, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: accent, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase" }}>
          Loading live data...
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (active) {
      case "dashboard": return <Dashboard d={d} fetchError={fetchError} />;
      case "manifesto": return <Manifesto />;
      case "blueprint": return <Blueprint />;
      case "architecture": return <Architecture />;
      case "action": return <ActionPlan graduation={d.graduation} />;
      case "waitlist": return <Waitlist />;
      default: return <Dashboard d={d} fetchError={fetchError} />;
    }
  };

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={S.kicker}>Codex Trading Bot</div>
          <Link to="/" style={{ fontSize: "11px", color: "#666", letterSpacing: "1.5px", textTransform: "uppercase", textDecoration: "none", fontFamily: "'Courier New', monospace" }}>Back</Link>
        </div>
        <h1 style={S.title}>Trade the Disclosure. Not the Noise.</h1>
        <nav style={S.nav}>
          {tabs.map((t) => (
            <button
              key={t.id}
              style={{
                ...S.navBtn(active === t.id),
                ...(t.id === "waitlist" && active !== "waitlist" ? { borderColor: accent, color: accent } : {}),
              }}
              onClick={() => setActive(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
      <div style={S.body}>{renderSection()}</div>
      <div style={{ padding: "0 36px 32px", fontSize: "9px", color: "#222", letterSpacing: "2px", textTransform: "uppercase" }}>
        Codex Trading Bot · Paper Trading · Not Financial Advice
      </div>
    </div>
  );
}
