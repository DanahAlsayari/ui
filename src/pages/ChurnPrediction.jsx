import React from "react";
import { useState } from "react";
import { Activity, AlertTriangle, RefreshCw, RotateCcw } from "lucide-react";
import { customerFields, modelResults } from "../data";
import { PageHeading, Notice } from "../components/Layout";

// Form page for submitting the 15 customer features to the churn prediction API.
export default function ChurnPrediction({ apiUrl }) {
  // Start with an empty form so every prediction is based on user-entered values.
  const emptyCustomer = Object.fromEntries(customerFields.map((field) => [field.name, ""]));
  const [customer, setCustomer] = useState(emptyCustomer);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update one customer field and clear any result based on the previous values.
  function updateCustomer(fieldName, value) {
    setCustomer((current) => ({ ...current, [fieldName]: value }));
    setResult(null);
    setError("");
  }

  // Temporary demo profiles for quickly testing both prediction outcomes.
  const demoProfiles = {
    churn: {
      age_group:"35-44", gender:"Male", region:"Central", customer_segment:"New", preferred_channel:"Online",
      purchase_frequency:1, avg_order_value:120, total_spent:120, recency_days:900, website_visits:3,
      discount_usage_rate:0.95, email_open_rate:0.05, cart_abandonment_rate:0.95, loyalty_score:5, engagement_score:5,
    },
    retained: {
      age_group:"35-44", gender:"Female", region:"Central", customer_segment:"Loyal", preferred_channel:"Mobile App",
      purchase_frequency:30, avg_order_value:250, total_spent:7500, recency_days:3, website_visits:150,
      discount_usage_rate:0.10, email_open_rate:0.90, cart_abandonment_rate:0.05, loyalty_score:95, engagement_score:95,
    },
  };

  function fillDemoProfile(profile) {
    setCustomer(Object.fromEntries(Object.entries(demoProfiles[profile]).map(([key, value]) => [key, String(value)])));
    setResult(null);
    setError("");
  }

  // Submit the customer profile to the FastAPI prediction endpoint.
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (Object.values(customer).some((value) => value === "")) {
      setError("Please complete all customer fields before predicting.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/predict/churn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(customer).map(([key, value]) => [
              key,
              value === "" ? value : customerFields.find((field) => field.name === key)?.options
                ? value
                : Number(value),
            ])
          )
        ),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setResult(data);
    } catch (requestError) {
      setError(requestError.message || "API unavailable");
    } finally {
      setLoading(false);
    }
  }

  // Restore the example profile so the user can start a fresh prediction.
  function resetForm() {
    setCustomer(emptyCustomer);
    setResult(null);
    setError("");
  }

  return (
    <>
      <PageHeading
        title="Customer churn prediction"
      />

      <form className="panel customer-form" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <div>
            <h3>Customer profile</h3>
            <p>Enter the customer’s feature values to predict their churn risk.</p>
          </div>
        </div>

        <div className="demo-fill-actions" style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
          <button type="button" className="secondary-button" onClick={() => fillDemoProfile("churn")}>Test: Churn Customer</button>
          <button type="button" className="secondary-button" onClick={() => fillDemoProfile("retained")}>Test: Retained Customer</button>
        </div>

        {/* The field definitions live in data.js to keep this page easy to scan. */}
        <div className="customer-fields">
          {customerFields.map((field) => (
            <label className="customer-field" key={field.name}>
              <span>{field.label}</span>
              {field.options ? (
                <select
                  value={customer[field.name]}
                  onChange={(event) => updateCustomer(field.name, event.target.value)}
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.min === 0 && field.max === 1 ? (
                <div className="customer-slider">
                  <div className="customer-slider-heading">
                    <span>Value</span>
                    <strong>{customer[field.name] === "" ? "Not set" : Number(customer[field.name]).toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={customer[field.name] === "" ? field.min : customer[field.name]}
                    aria-label={field.label}
                    onChange={(event) => updateCustomer(field.name, event.target.value)}
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
                  value={customer[field.name]}
                  placeholder={`Range: ${Number(field.min).toLocaleString("en-US")} – ${Number(field.max).toLocaleString("en-US")}`}
                  className="range-placeholder"
                  onChange={(event) => updateCustomer(field.name, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>

        <button className="primary-button full-button" type="submit" disabled={loading}>
          {loading ? <RefreshCw className="spin" size={15} /> : <Activity size={15} />}
          {loading ? "Predicting…" : "Predict churn risk"}
        </button>

        {error && (
          <div className="error-panel">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Display the API response only after a successful prediction. */}
        {result && (() => {
          const churnProbability = Number(result.churn_probability) || 0;
          const isChurned = Number(result.churn_prediction) === 1;
          const churnTone = isChurned ? "high" : "low";
          return (
            <div className={`prediction-result prediction-result-${churnTone}`}>
              <div className="result-top">
                <div>
                  <span className="field-label">PREDICTED CUSTOMER STATUS</span>
                  <h3>{result.churn_label}</h3>
                </div>
                <div className="probability">
                  <strong>{(churnProbability * 100).toFixed(1)}%</strong>
                  <small>Model-estimated churn probability</small>
                </div>
              </div>
              <div className="probability-track">
                <i style={{ width: `${churnProbability * 100}%` }} />
              </div>
              <p className="probability-note">This percentage is the model’s estimated probability that the customer belongs to the churn class. It is not a separate confidence score or a guarantee of the customer’s future behavior.</p>
              <p className="result-explanation">
                {isChurned
                  ? "This customer is predicted to leave. Consider taking retention actions."
                  : "This customer is predicted to stay. Keep maintaining their engagement."}
              </p>
            </div>
          );
        })()}
      </form>

      {/* Selected model and its recorded offline evaluation metrics. */}
      <section className="panel mt-panel">
        <div className="panel-heading">
          <div>
            <h3>Model Evaluation Metrics</h3>
            <p>Offline test-set performance of the selected Logistic Regression baseline. These metrics describe overall model performance, not confidence in this individual prediction.</p>
          </div>
          <span className="soft-tag">SELECTED MODEL</span>
        </div>
        <div className="model-summary">
          <div className="model-summary-icon"><Activity size={19} /></div>
          <div>
            <b>Logistic Regression · Baseline</b>
            <p>Selected to estimate customer churn using the 15 customer features, with One-Hot Encoding for categorical data and StandardScaler for numerical data.</p>
          </div>
        </div>
        <div className="model-metrics-grid">
          {[
            { label: "Accuracy", value: modelResults[0].accuracy, detail: "Overall correct predictions" },
            { label: "Precision", value: modelResults[0].precision, detail: "Correct positive predictions" },
            { label: "Recall", value: modelResults[0].recall, detail: "Churn cases correctly identified" },
            { label: "F1-score", value: modelResults[0].f1, detail: "Balance of precision and recall" },
            { label: "ROC-AUC", value: modelResults[0].auc, detail: "Ability to distinguish the classes" },
          ].map((metric) => (
            <div className="model-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.detail}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
