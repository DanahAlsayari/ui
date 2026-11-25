import React from "react";
import { BrainCircuit, Sparkles } from "lucide-react";
import { drivers, kpis } from "../data";
import { PageHeading, StatCards } from "../components/Layout";

// Overview page: platform introduction, headline KPIs, churn drivers, and connectivity.
export default function Overview({ health }) {
  return (
    <>
      <PageHeading
        eyebrow="EXECUTIVE DECISION SUPPORT"
        title="Overview"
        subtitle="A summary of customer churn, behavioral signals, and retention opportunities."
      />

      {/* Platform introduction banner, matching the GenAI hero design. */}
      <section className="hero-banner">
        <div className="hero-copy">
          <span><Sparkles size={12} /> CCO RETAIL INTELLIGENCE PLATFORM</span>
          <h2>From customer insights<br />to smarter decisions.</h2>
          <p>
            Explore customer behavior, identify churn patterns, and discover
            actionable insights to support smarter retention strategies.
          </p>
        </div>
        <div className="hero-orb"><BrainCircuit size={55} /></div>
      </section>

      {/* KPI summaries provide a quick snapshot of customer churn and retention. */}
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
        </p>
      </section>

    
    </>
  );
}
