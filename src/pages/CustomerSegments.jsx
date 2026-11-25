import React from "react";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";
import { customerFields as fields, segments as fallbackSegments } from "../data";
import { PageHeading, Notice } from "../components/Layout";

const clusterColors = ["#756BF6", "#39B7A4", "#F0B75E"];
const clusterTints = ["#F3F1FF", "#EAF8F5", "#FFF7E8"];
const clusterBorders = ["#DDD9FF", "#CDEDE5", "#F5E4BF"];
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
  const emptyCustomer = Object.fromEntries(fields.map((field) => [field.name, ""]));
  const [formData, setFormData] = useState(emptyCustomer);
  const [touchedSliders, setTouchedSliders] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [result, setResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("All clusters");
  const [maxChurnRate, setMaxChurnRate] = useState(60);

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
  const filteredRows = rows.filter((segment) => {
    const rate = Number(segment.churn_rate ?? segment.churn);
    return (selectedCluster === "All clusters" || segment.name === selectedCluster) && rate <= maxChurnRate;
  });

  const demoCustomers = {
    highVolume: { age_group:"35-44", gender:"Male", region:"Central", customer_segment:"VIP", preferred_channel:"Online", purchase_frequency:25, avg_order_value:235, total_spent:5500, recency_days:10, website_visits:125, discount_usage_rate:0.20, email_open_rate:0.47, cart_abandonment_rate:0.20, loyalty_score:85, engagement_score:80 },
    lowEngagement: { age_group:"25-34", gender:"Female", region:"West", customer_segment:"New", preferred_channel:"Mobile App", purchase_frequency:4, avg_order_value:190, total_spent:680, recency_days:180, website_visits:18, discount_usage_rate:0.70, email_open_rate:0.10, cart_abandonment_rate:0.80, loyalty_score:15, engagement_score:20 },
    engagedLight: { age_group:"18-24", gender:"Female", region:"East", customer_segment:"Returning", preferred_channel:"Online", purchase_frequency:4, avg_order_value:196, total_spent:775, recency_days:15, website_visits:20, discount_usage_rate:0.30, email_open_rate:0.85, cart_abandonment_rate:0.15, loyalty_score:65, engagement_score:85 },
  };

  const fillDemoCustomer = (profile) => {
    const customer = demoCustomers[profile];
    setFormData({ ...customer });
    setTouchedSliders({ discount_usage_rate:true, email_open_rate:true, cart_abandonment_rate:true });
    setValidationErrors({});
    setResult(null);
    setPredictError("");
  };

  const updateField = (name, value, type) => {
    setFormData((current) => ({ ...current, [name]: type === "select" ? value : value === "" ? "" : Number(value) }));
    if (type === "slider") setTouchedSliders((current) => ({ ...current, [name]: true }));
    setValidationErrors((current) => ({ ...current, [name]: "" }));
    setResult(null);
    setPredictError("");
  };

  const resetForm = () => {
    setFormData({ ...emptyCustomer });
    setTouchedSliders({});
    setValidationErrors({});
    setResult(null);
    setPredictError("");
  };

  const identifyCluster = async (event) => {
    event.preventDefault();
    const missing = {};
    fields.forEach((field) => {
      const isSlider = ["discount_usage_rate", "email_open_rate", "cart_abandonment_rate"].includes(field.name);
      if (isSlider ? !touchedSliders[field.name] : formData[field.name] === "" || formData[field.name] == null) {
        missing[field.name] = "Please fill out this field.";
      }
    });
    setValidationErrors(missing);
    setPredictError("");
    setResult(null);
    if (Object.keys(missing).length) return;
    setPredicting(true);
    try {
      const response = await fetch(`${apiUrl}/api/predict/cluster`, {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(
          fields.map((field) => [
            field.name,
            field.type === "select" ? formData[field.name] : Number(formData[field.name]),
          ])
        )),
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

        <div className="segment-filter-panel">
          <label className="segment-filter-control">
            <span>Customer cluster</span>
            <select value={selectedCluster} onChange={(event) => setSelectedCluster(event.target.value)}>
              <option>All clusters</option>
              {rows.map((segment) => <option key={segment.name} value={segment.name}>{segment.name}</option>)}
            </select>
          </label>
          <label className="segment-filter-control segment-churn-filter">
            <span>Maximum observed churn rate <strong>{maxChurnRate}%</strong></span>
            <input type="range" min="0" max="60" step="1" value={maxChurnRate} onChange={(event) => setMaxChurnRate(Number(event.target.value))} />
            <small>Show segments at or below this churn rate</small>
          </label>
          <div className="segment-filter-summary">
            <strong>{filteredRows.length}</strong>
            <span>of {rows.length} segments shown</span>
            <button type="button" className="text-button" onClick={() => { setSelectedCluster("All clusters"); setMaxChurnRate(60); }}>Reset filters</button>
          </div>
        </div>
        <div className="segment-cards cluster-profile-cards">
          {filteredRows.length ? filteredRows.map((segment, index) => {
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
                <div className="segment-action">
                  <b>Recommended action</b>
                  <span>{{
                    "High-Volume Buyers": "Protect loyalty with exclusive rewards.",
                    "Low-Engagement Customers": "Prioritize re-engagement and recover abandoned carts.",
                    "Engaged Light Buyers": "Use relevant recommendations to increase purchase frequency."
                  }[segment.name] || "Use targeted engagement to improve retention."}</span>
                </div>
              </article>
            );
          }) : (
            <div className="empty-filter-state">No customer segments match these filters. Adjust the cluster or churn-rate selection.</div>
          )}
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
            
          </div>

          <form onSubmit={identifyCluster}>
            <div className="demo-fill-actions" style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              <button type="button" className="secondary-button" onClick={() => fillDemoCustomer("highVolume")}>Test: High-Volume Buyer</button>
              <button type="button" className="secondary-button" onClick={() => fillDemoCustomer("lowEngagement")}>Test: Low-Engagement</button>
              <button type="button" className="secondary-button" onClick={() => fillDemoCustomer("engagedLight")}>Test: Engaged Light Buyer</button>
            </div>
            <div className="customer-fields cluster-customer-fields">
              {fields.map((field) => (
                <label className={`customer-field${validationErrors[field.name] ? " has-error" : ""}`} key={field.name}>
                  <span>{field.label}</span>
                  {field.type === "select" ? (
                    <select
                      value={formData[field.name]}
                      aria-invalid={Boolean(validationErrors[field.name])}
                      onChange={(event) => updateField(field.name, event.target.value, "select")}
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : ["discount_usage_rate", "email_open_rate", "cart_abandonment_rate"].includes(field.name) ? (
                    <div className="customer-slider">
                      <div className="customer-slider-heading">
                        <span>Value</span>
                        <strong>{!touchedSliders[field.name] ? "—" : Number(formData[field.name]).toFixed(2)}</strong>
                      </div>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={formData[field.name] === "" ? field.min : formData[field.name]}
                        aria-invalid={Boolean(validationErrors[field.name])}
                        aria-label={field.label}
                        onChange={(event) => updateField(field.name, event.target.value, "slider")}
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
                      value={formData[field.name]}
                      aria-invalid={Boolean(validationErrors[field.name])}
                      placeholder={`Range: ${Number(field.min).toLocaleString("en-US")} – ${Number(field.max).toLocaleString("en-US")}`}
                      className="range-placeholder"
                      onChange={(event) => updateField(field.name, event.target.value, "number")}
                    />
                  )}
                  {validationErrors[field.name] && <small className="field-validation-error">{validationErrors[field.name]}</small>}
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
            <div className="cluster-result-panel" style={{ "--cluster-accent": clusterColors[result.cluster] || clusterColors[0], "--cluster-tint": clusterTints[result.cluster] || clusterTints[0], "--cluster-border": clusterBorders[result.cluster] || clusterBorders[0] }}>
              <div className="cluster-result-top">
                <div className="cluster-result-check"><CheckCircle2 size={24} strokeWidth={2.5} /></div>
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


    </>
  );
}
