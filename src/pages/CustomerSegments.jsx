import React from "react";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { clusteringResults, customerFields as fields, segments as fallbackSegments } from "../data";
import { PageHeading, Notice } from "../components/Layout";

const clusterColors = ["#756BF6", "#39B7A4", "#F0B75E"];
const formatReason = (reason) => {
  if (typeof reason === "string" || typeof reason === "number") return String(reason);
  if (reason == null) return "";
  if (Array.isArray(reason)) return reason.map(formatReason).filter(Boolean).join(" · ");
  if (typeof reason === "object") {
    const preferred = reason.message || reason.reason || reason.description || reason.text;
    if (preferred) return formatReason(preferred);
    return Object.entries(reason)
      .map(([key, value]) => `${key.replaceAll("_", " ")}: ${typeof value === "object" ? JSON.stringify(value) : value}`)
      .join(" · ");
  }
  return String(reason);
};

const clusterDescriptions = {
  "High-Volume Buyers": "Customers who purchase frequently and spend the most. Retain their value with loyalty rewards and recognition.",
  "Low-Engagement Customers": "Customers with fewer visits, lower email interaction, and the highest observed churn. Prioritize re-engagement campaigns.",
  "Engaged Light Buyers": "Customers who respond well to engagement but purchase less often. Encourage more frequent purchases with relevant recommendations.",
};

export default function CustomerSegments({ apiUrl }) {
  const [segmentData, setSegmentData] = useState(null);
  const [error, setError] = useState("");
  const emptyCustomer = Object.fromEntries(fields.map((field) => [field.name, ["discount_usage_rate", "email_open_rate", "cart_abandonment_rate"].includes(field.name) ? field.min : ""]));
  const [formData, setFormData] = useState(emptyCustomer);
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
    setFormData({ ...emptyCustomer });
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
      if (!response.ok) {
        const detail = payload.detail;
        const message = Array.isArray(detail)
          ? detail.map((item) => {
              const field = Array.isArray(item.loc) ? item.loc.filter((part) => part !== "body").join(".") : "Input";
              return String(field) + ": " + (item.msg || "Invalid value");
            }).join(" · ")
          : typeof detail === "string" ? detail : "Could not identify this customer's cluster.";
        throw new Error(message);
      }
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
                      required
                      value={formData[field.name]}
                      onChange={(event) => updateField(field.name, event.target.value, "select")}
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : ["discount_usage_rate", "email_open_rate", "cart_abandonment_rate"].includes(field.name) ? (
                    <div className="customer-slider">
                      <div className="customer-slider-heading">
                        <span>Value</span>
                        <strong>{formData[field.name] === "" ? "—" : Number(formData[field.name]).toFixed(2)}</strong>
                      </div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={formData[field.name] === "" ? field.min : formData[field.name]}
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
                      placeholder={`Range: ${Number(field.min).toLocaleString("en-US")} – ${Number(field.max).toLocaleString("en-US")}`}
                      className="range-placeholder"
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
                {(Array.isArray(result.reason) ? result.reason : result.reason ? [result.reason] : []).map((reason, index) => <p key={index}><i />{formatReason(reason)}</p>)}
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
