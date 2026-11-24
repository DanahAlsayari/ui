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

  // Submit the customer profile to the FastAPI prediction endpoint.
  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

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
        eyebrow="SUPERVISED LEARNING"
        title="Customer churn prediction"
      />



      <form className="panel customer-form" onSubmit={handleSubmit}>
        <div className="panel-heading">
          <div>
            <h3>Customer profile</h3>
            <p>Enter the customer’s feature values to predict their churn risk.</p>
          </div>
        
        </div>

        {/* The field definitions live in data.js to keep this page easy to scan. */}
        <div className="customer-fields">
          {customerFields.map((field) => (
            <label className="customer-field" key={field.name}>
              <span>{field.label}</span>
              <small className="field-range">
                {field.options
                  ? `Available values: ${field.options.join(", ")}`
                  : `Allowed range: ${field.min} – ${field.max}`}
              </small>
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
              ) : (
                <input
                  type="number"
                  required
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={customer[field.name]}
                  placeholder="Enter value"
                  onChange={(event) =>
                    updateCustomer(
                      field.name,
                      event.target.value === "" ? "" : Number(event.target.value)
                    )
                  }
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
        {result && (
          <div className="prediction-result">
            <div className="result-top">
              <div>
                <span className="field-label">PREDICTED CUSTOMER STATUS</span>
                <h3>{result.churn_label}</h3>
                <p>{result.risk_level} estimated risk · Logistic Regression baseline</p>
              </div>
              <div className="probability">
                <strong>{(result.churn_probability * 100).toFixed(1)}%</strong>
                <small>Churn probability</small>
              </div>
            </div>
            <div className="probability-track">
              <i style={{ width: `${result.churn_probability * 100}%` }} />
            </div>
            <p className="fine-print">{result.note}</p>
          </div>
        )}
      </form>

      {/* Recorded offline evaluation results from the team's project. */}
      <section className="panel mt-panel">
        <div className="panel-heading">
          <div>
            <h3>Model performance comparison</h3>
            <p>Offline evaluation reported by the team (20,000-row test set).</p>
          </div>
          <span className="soft-tag">PHASE 1 RESULTS</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Model</th><th>Accuracy</th><th>Precision</th>
                <th>Recall</th><th>F1-score</th><th>ROC-AUC</th>
              </tr>
            </thead>
            <tbody>
              {modelResults.map((model) => (
                <tr key={model.name}>
                  <td><b>{model.name}</b></td>
                  <td>{model.accuracy}</td>
                  <td>{model.precision}</td>
                  <td>{model.recall}</td>
                  <td>{model.f1}</td>
                  <td>{model.auc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
