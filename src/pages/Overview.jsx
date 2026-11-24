import { Activity, ArrowUpRight, LayoutDashboard, ShieldCheck, Users } from "lucide-react";
import { drivers, kpis } from "../data";
import { PageHeading, sections, StatCards } from "../components/Layout";

// Landing page: summarizes project results and current API connectivity.
export default function Overview({ setPage, health }) {
  return (
    <>
      <PageHeading
        eyebrow="EXECUTIVE DECISION SUPPORT"
        title="Executive overview"
        subtitle="A decision-support view of retail customer churn, behavioral segments, and retention opportunities."
      />

      <StatCards items={kpis} />

      {/* Key behavioral signals reported by the team's exploratory analysis. */}
      <section className="panel drivers-panel">
        <div className="panel-heading">
          <div>
            <h3>Customer behavior signals</h3>
            <p>Correlation with churn_flag reported in the team's exploratory analysis.</p>
          </div>
          <span className="soft-tag">EDA FINDINGS</span>
        </div>

        <div className="driver-insights">
          {drivers.map((driver) => (
            <div className="driver-insight" key={driver.name}>
              <i className="driver-dot" style={{ background: driver.tone }} />
              <div>
                <b>{driver.name}</b>
                <small>{driver.detail}</small>
              </div>
              <strong>{driver.value}</strong>
            </div>
          ))}
        </div>

        <p className="fine-print">
          Correlation describes association in the project dataset; it does not
          establish causation or individual feature importance.
        </p>
      </section>

      {/* Shortcuts make the other dashboard sections easy to discover. */}
      <section className="section-links">
        {sections
          .filter((section) => section.id !== "overview")
          .map(({ id, label, icon: Icon }) => (
            <button className="section-link" key={id} onClick={() => setPage(id)}>
              <span className="section-link-icon"><Icon size={18} /></span>
              <span>{label}</span>
              <ArrowUpRight size={15} />
            </button>
          ))}
      </section>

      {/* Health information is supplied by GET /api/health in App.jsx. */}
      <section className="panel service-panel">
        <div>
          <h3>System connectivity</h3>
          <p>
            API: {health?.status === "ok" ? "Connected" : "Not reachable"} ·
            Model: {health?.model_artifact_exists
              ? "Artifact cached"
              : "Loads from team training data on first prediction"} ·
            Gemini: {health?.genai_configured ? "Key configured" : "Key not configured"}
          </p>
        </div>
        <span className={`service-pill ${health?.status === "ok" ? "connected" : "disconnected"}`}>
          {health?.status === "ok" ? "API ONLINE" : "API OFFLINE"}
        </span>
      </section>
    </>
  );
}
