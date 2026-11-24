import { drivers, kpis } from "../data";
import { PageHeading, StatCards } from "../components/Layout";

// Overview page: headline KPIs, key churn drivers, and backend connectivity.
export default function Overview({ health }) {
  return (
    <>
      <PageHeading
        eyebrow="EXECUTIVE DECISION SUPPORT"
        title="Overview"
        subtitle="A summary of customer churn, behavioral signals, and retention opportunities."
      />

      {/* KPI summaries provide a quick snapshot of the project dataset and model. */}
      <section className="overview-section">
        <div className="overview-section-heading">
          <h2>KPI summaries</h2>
          <p>Key performance indicators from the team's analysis.</p>
        </div>
        <StatCards items={kpis} />
      </section>

      {/* Key drivers are visualized by correlation strength and direction. */}
      <section className="panel drivers-panel overview-drivers">
        <div className="panel-heading">
          <div>
            <h3>Key driver charts</h3>
            <p>Correlation with churn_flag reported in the team's exploratory analysis.</p>
          </div>
          <span className="soft-tag">EDA FINDINGS</span>
        </div>

        <div className="driver-chart-list">
          {drivers.map((driver) => {
            const strength = Math.min((Math.abs(Number(driver.value.match(/[0-9.]+/)?.[0])) / 0.8) * 100, 100);
            const isNegative = driver.value.includes("−") || driver.value.includes("-");
            return (
              <div className="driver-chart-row" key={driver.name}>
                <div className="driver-chart-label">
                  <b>{driver.name}</b>
                  <small>{driver.detail}</small>
                </div>
                <div className="driver-chart-track">
                  <i
                    className={isNegative ? "negative-driver" : "positive-driver"}
                    style={{ width: `${strength}%`, background: driver.tone }}
                  />
                </div>
                <strong>{driver.value}</strong>
              </div>
            );
          })}
        </div>

        <p className="fine-print">
          Bars show the absolute correlation magnitude; the sign indicates direction.
          Correlation describes association and does not establish causation or
          individual feature importance.
        </p>
      </section>

      {/* API status is read from GET /api/health in the shared application shell. */}
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
