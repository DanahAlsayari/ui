import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { clusteringResults, segments as fallbackSegments } from "../data";
import { PageHeading, Notice } from "../components/Layout";

// Descriptive K-Means profiles from the team's clustering analysis.
export default function CustomerSegments({ apiUrl }) {
  const [segmentData, setSegmentData] = useState(null);
  const [error, setError] = useState("");

  // Load the verified segment summaries from the backend when this page mounts.
  useEffect(() => {
    fetch(`${apiUrl}/api/segments`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load segment data");
        return response.json();
      })
      .then(setSegmentData)
      .catch((requestError) => setError(requestError.message));
  }, [apiUrl]);

  // Keep the dashboard useful if the API is offline by using bundled project results.
  const rows = segmentData?.segments || fallbackSegments;

  return (
    <>
      <PageHeading
        eyebrow="UNSUPERVISED LEARNING"
        title="Customer segments"
        subtitle="K-Means customer profiles and churn patterns from the team's clustering analysis."
      />

      <Notice>
        <b>Exploratory result:</b> Silhouette = {segmentData?.silhouette ?? "0.099"} and
        Davies–Bouldin = {segmentData?.davies_bouldin ?? "2.448"}. The project reports
        weak cluster separation; interpret groups cautiously.
      </Notice>

      {error && (
        <div className="error-panel">
          <AlertTriangle size={16} />
          {error} Showing verified project profiles bundled with this dashboard.
        </div>
      )}

      {/* One card per K-Means group, using the team's recorded customer counts. */}
      <section className="segment-cards">
        {rows.map((segment, index) => {
          const segmentColors = ["#756BF6", "#39B7A4", "#F0B75E"];
          const color = segmentColors[index % segmentColors.length];
          const churnRate = Number(segment.churn_rate ?? segment.churn);

          return (
            <article className="stat-card segment-detail" key={segment.name}>
              <div className="segment-top">
                <b>{segment.name}</b>
                <i style={{ background: color }} />
              </div>
              <strong>{Number(segment.customers).toLocaleString("en-US")}</strong>
              <small>customers · {Number(segment.share).toFixed(1)}% of dataset</small>
              <div className="segment-bar">
                <i style={{ width: `${segment.share}%`, background: color }} />
              </div>
              <div className="segment-churn">
                <span>Observed churn rate</span>
                <b>{churnRate.toFixed(2)}%</b>
              </div>
              <p>{segment.description || segment.desc}</p>
              <span className="soft-tag">{segment.priority || "K-MEANS PROFILE"}</span>
            </article>
          );
        })}
      </section>

      {/* Validation metrics help explain why segment profiles should be interpreted carefully. */}
      <div className="content-grid segment-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Clustering algorithm comparison</h3>
              <p>Internal validation metrics from Phase 2.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Algorithm</th><th>Clusters</th><th>Silhouette</th><th>Davies–Bouldin</th>
                </tr>
              </thead>
              <tbody>
                {clusteringResults.map((row) => (
                  <tr key={row.name}>
                    <td><b>{row.name}</b></td>
                    <td>{row.clusters}</td>
                    <td>{row.silhouette}</td>
                    <td>{row.daviesBouldin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Highlight the group with the highest recorded churn rate. */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Priority segment</h3>
              <p>Highest observed churn rate.</p>
            </div>
            <span className="soft-tag">K-MEANS</span>
          </div>
          <div className="assessment">
            <div className="risk-ring" style={{ "--risk": "54.11%" }}>
              <div><b>54.11%</b><small>Churn rate</small></div>
            </div>
            <span className="status high">Low-Engagement Customers</span>
            <p>
              31,485 customers · 17,036 churned. The project interpretation
              prioritizes this group for re-engagement.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
