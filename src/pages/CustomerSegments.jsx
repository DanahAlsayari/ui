import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { clusteringResults, initialCustomer, segments as fallbackSegments } from "../data";
import { PageHeading, Notice } from "../components/Layout";

const fields = [
  { name: "age_group", label: "Age group", type: "select", options: ["18-24", "25-34", "35-44", "45-54", "55+"] },
  { name: "gender", label: "Gender", type: "select", options: ["Female", "Male", "Other"] },
  { name: "region", label: "Region", type: "select", options: ["Central", "East", "North", "South", "West"] },
  { name: "customer_segment", label: "Customer segment", type: "select", options: ["New", "Returning", "VIP", "Loyal"] },
  { name: "preferred_channel", label: "Preferred channel", type: "select", options: ["In-Store", "Mobile App", "Online"] },
  { name: "purchase_frequency", label: "Purchase frequency", min: 1, max: 60, step: 1 },
  { name: "avg_order_value", label: "Average order value", min: 20.03, max: 400, step: 0.01 },
  { name: "total_spent", label: "Total spent", min: 17.87, max: 28444.24, step: 0.01 },
  { name: "recency_days", label: "Recency (days)", min: 1, max: 364, step: 1 },
  { name: "website_visits", label: "Website visits", min: 2, max: 479, step: 1 },
  { name: "loyalty_score", label: "Loyalty score", min: 10, max: 99, step: 1 },
  { name: "engagement_score", label: "Engagement score", min: 10, max: 92, step: 0.5 },
  { name: "discount_usage_rate", label: "Discount usage rate (0–1)", min: 0.05, max: 0.8, step: 0.01 },
  { name: "email_open_rate", label: "Email open rate (0–1)", min: 0.05, max: 0.9, step: 0.01 },
  { name: "cart_abandonment_rate", label: "Cart abandonment rate (0–1)", min: 0.05, max: 0.85, step: 0.01 },
];

const clusterColors = ["#756BF6", "#39B7A4", "#F0B75E"];
const clusterDescriptions = {
  "High-Volume Buyers": "Customers who purchase frequently and spend the most. Retain their value with loyalty rewards and recognition.",
  "Low-Engagement Customers": "Customers with fewer visits, lower email interaction, and the highest observed churn. Prioritize re-engagement campaigns.",
  "Engaged Light Buyers": "Customers who respond well to engagement but purchase less often. Encourage more frequent purchases with relevant recommendations.",
};

export default function CustomerSegments({ apiUrl }) {
  const [segmentData, setSegmentData] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ ...initialCustomer });
  const [result, setResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/api/segments`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load segment data");
        return response.json();
      })
      .then(setSegmentData)
      .catch((requestError) => setError(requestError.message));
  }, [apiUrl]);

  const rows = segmentData?.segments || fallbackSegments;

  const updateField = (name, value, type) => {
    setFormData((current) => ({ ...current, [name]: type === "select" ? value : value === "" ? "" : Number(value) }));
    setResult(null);
    setPredictError("");
  };

  const resetForm = () => {
    setFormData({ ...initialCustomer });
    setResult(null);
    setPredictError("");
  };

  const identifyCluster = async (event) => {
    event.preventDefault();
    setPredicting(true);
    setPredictError("");
    setResult(null);
    try {
      const response = await fetch(`${apiUrl}/api/predict/cluster`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.detail || "Could not identify this customer's cluster.");
      setResult(payload);
    } catch (requestError) {
      setPredictError(requestError.message);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="UNSUPERVISED LEARNING"
        title="Customer segments"
      />

      <section className="cluster-section">
        <div className="cluster-section-heading">
          <div>
          
            <h2>Understand the Clusters</h2>
       
          </div>
          <span className="soft-tag">K-MEANS · K = 3</span>
          <span className="soft-tag"> Silhouette = 0.099 </span>
          <span className="soft-tag"> Davies–Bouldin = 2.448 </span>

        </div>

       

        {error && (
          <div className="error-panel">
            <AlertTriangle size={16} />
            {error} Showing the project's recorded cluster profiles.
          </div>
        )}

        <div className="segment-cards cluster-profile-cards">
          {rows.map((segment, index) => {
            const color = clusterColors[index % clusterColors.length];
            const churnRate = Number(segment.churn_rate ?? segment.churn);
            const description = clusterDescriptions[segment.name] || segment.description || segment.desc;
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
                <p>{description}</p>
                <span className="soft-tag">{segment.priority || "K-MEANS PROFILE"}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="cluster-section cluster-identify-section">
        <div className="cluster-section-heading">
          <div>
            <span className="section-kicker">02 · APPLY THE MODEL</span>
            <h2>Find a Customer's Cluster</h2>
          </div>
          <span className="model-live-label"><i /> MODEL-POWERED</span>
        </div>

        <div className="panel cluster-form-panel">
          <div className="cluster-form-intro">
            <div className="cluster-form-icon"><BrainCircuit size={19} /></div>
            <div>
              <h3>Customer information</h3>
                 <p>Enter the customer’s feature values to identify customer cluster.</p>
            </div>
            <button type="button" className="reset-button" onClick={resetForm}>
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <form onSubmit={identifyCluster}>
            <div className="customer-fields cluster-customer-fields">
              {fields.map((field) => (
                <label className="customer-field" key={field.name}>
                  <span>{field.label}</span>
                  {field.type === "select" ? (
                    <select
                      value={formData[field.name]}
                      onChange={(event) => updateField(field.name, event.target.value, "select")}
                    >
                      {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : ["discount_usage_rate", "email_open_rate", "cart_abandonment_rate"].includes(field.name) ? (
                    <div className="customer-slider">
                      <div className="customer-slider-heading">
                        <span>Value</span>
                        <strong>{Number(formData[field.name]).toFixed(2)}</strong>
                      </div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={formData[field.name]}
                        aria-label={field.label}
                        onChange={(event) => updateField(field.name, event.target.value, "number")}
                      />
                      <div className="customer-slider-limits">
                        <span>{field.min}</span>
                        <span>{field.max}</span>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      required
                      value={formData[field.name]}
                      placeholder={`${Number(field.min).toLocaleString("en-US")} – ${Number(field.max).toLocaleString("en-US")}`}
                      onChange={(event) => updateField(field.name, event.target.value, "number")}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="cluster-form-actions">
              <button className="primary-button" type="submit" disabled={predicting}>
                {predicting ? <><LoaderCircle size={14} className="spin" /> Identifying...</> : <>Identify Customer Cluster <ArrowRight size={14} /></>}
              </button>
            </div>
          </form>

          {predictError && (
            <div className="error-panel"><AlertTriangle size={16} />{predictError}</div>
          )}

          {result && (
            <div className="cluster-result-panel">
              <div className="cluster-result-top">
                <div className="cluster-result-check"><CheckCircle2 size={18} /></div>
                <div>
                  <span className="section-kicker">MODEL ASSIGNMENT COMPLETE</span>
                  <h3>{result.cluster_name}</h3>
                  <p>Assigned by the trained K-Means model · Cluster {result.cluster + 1}</p>
                </div>
                <span className="cluster-result-dot" style={{ background: clusterColors[result.cluster] }} />
              </div>
              <div className="cluster-result-reasons">
                <b>Why this customer belongs to this cluster</b>
                {result.reason.map((reason) => <p key={reason}><i />{reason}</p>)}
              </div>
              <small className="cluster-result-note">{result.note}</small>
            </div>
          )}
        </div>
      </section>

      <div className="content-grid segment-grid cluster-validation-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Clustering algorithm comparison</h3>
              <p>Internal validation metrics from Phase 2.</p>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Algorithm</th><th>Clusters</th><th>Silhouette</th><th>Davies–Bouldin</th></tr></thead>
              <tbody>
                {clusteringResults.map((row) => (
                  <tr key={row.name}>
                    <td><b>{row.name}</b></td><td>{row.clusters}</td><td>{row.silhouette}</td><td>{row.daviesBouldin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div><h3>Priority segment</h3><p>Highest observed churn rate.</p></div>
            <span className="soft-tag">K-MEANS</span>
          </div>
          <div className="assessment">
            <div className="risk-ring" style={{ "--risk": "54.11%" }}>
              <div><b>54.11%</b><small>Churn rate</small></div>
            </div>
            <span className="status high">Low-Engagement Customers</span>
            <p>31,485 customers · 17,036 churned. The project interpretation prioritizes this group for re-engagement.</p>
          </div>
        </section>
      </div>
    </>
  );
}
