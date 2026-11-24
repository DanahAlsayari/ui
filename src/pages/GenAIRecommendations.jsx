import { useState } from "react";
import { AlertTriangle, BrainCircuit, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { genaiMethods, initialCustomer } from "../data";
import { PageHeading, Notice } from "../components/Layout";

// Combines a churn prediction with Gemini to generate a customer retention briefing.
export default function GenAIRecommendations({ apiUrl }) {
  const [method, setMethod] = useState("Few-shot");
  const [customer, setCustomer] = useState(initialCustomer);
  const [prediction, setPrediction] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Changes to the report inputs invalidate the previous prediction and briefing.
  function updateCustomer(fieldName, value) {
    setCustomer((current) => ({ ...current, [fieldName]: value }));
    setPrediction(null);
    setReport(null);
  }

  // Generate a fresh prediction if needed, then request a Gemini report.
  async function handleGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReport(null);

    try {
      let currentPrediction = prediction;

      if (!currentPrediction) {
        const predictionResponse = await fetch(`${apiUrl}/api/predict/churn`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customer),
        });
        const predictionData = await predictionResponse.json();

        if (!predictionResponse.ok) {
          throw new Error(predictionData.detail || "Prediction failed");
        }

        currentPrediction = predictionData;
        setPrediction(predictionData);
      }

      const reportResponse = await fetch(`${apiUrl}/api/insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          method,
          churn_prediction: currentPrediction.churn_prediction,
          churn_probability: currentPrediction.churn_probability,
        }),
      });
      const reportData = await reportResponse.json();

      if (!reportResponse.ok) {
        throw new Error(reportData.detail || "GenAI request failed");
      }

      setReport(reportData);
    } catch (requestError) {
      setError(requestError.message || "GenAI service unavailable");
    } finally {
      setLoading(false);
    }
  }

  const selectedMethod = genaiMethods.find((item) => item.name === method);

  return (
    <>
      <PageHeading
        eyebrow="GENERATIVE AI"
        title="Retention recommendations"
        subtitle="Generate an executive briefing from a real churn prediction using the project's Zero-shot or Few-shot approach."
      />

      {/* Explains the sequence: model prediction first, Gemini report second. */}
      <section className="hero-banner">
        <div className="hero-copy">
          <span><Sparkles size={12} /> GEMINI-POWERED WORKFLOW</span>
          <h2>From churn signals<br />to retention actions.</h2>
          <p>
            Run the selected churn model, then pass its prediction and customer
            indicators to the secured Gemini API.
          </p>
        </div>
        <div className="hero-orb"><BrainCircuit size={55} /></div>
      </section>

      <div className="content-grid insight-grid">
        <form className="panel" onSubmit={handleGenerate}>
          <div className="panel-heading">
            <div>
              <h3>Generate customer briefing</h3>
              <p>Adjust the customer indicators used by the model and report.</p>
            </div>
          </div>

          {/* These indicators are the customer values highlighted in the prompt. */}
          <div className="customer-fields compact-fields">
            <label className="customer-field">
              <span>Recency (days)</span>
              <input
                type="number"
                min="0"
                value={customer.recency_days}
                onChange={(event) => updateCustomer("recency_days", Number(event.target.value))}
              />
            </label>
            <label className="customer-field">
              <span>Loyalty score</span>
              <input
                type="number"
                min="0"
                max="100"
                value={customer.loyalty_score}
                onChange={(event) => updateCustomer("loyalty_score", Number(event.target.value))}
              />
            </label>
            <label className="customer-field">
              <span>Cart abandonment (0–1)</span>
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                value={customer.cart_abandonment_rate}
                onChange={(event) =>
                  updateCustomer("cart_abandonment_rate", Number(event.target.value))
                }
              />
            </label>
          </div>

          {/* Let the user choose between the two prompting methods in the project. */}
          <span className="field-label method-label">PROMPTING METHOD</span>
          <div className="choice-grid">
            {genaiMethods.map((item) => (
              <button
                type="button"
                key={item.name}
                className={method === item.name ? "chosen" : ""}
                onClick={() => setMethod(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="briefing method-brief">
            <span className="soft-tag">{selectedMethod.name.toUpperCase()}</span>
            <h3>{selectedMethod.title}</h3>
            <p>{selectedMethod.description}</p>
            <b>Prompt inputs</b>
            <ul>
              {selectedMethod.inputs.map((input) => <li key={input}>{input}</li>)}
            </ul>
          </div>

          <button className="primary-button full-button" type="submit" disabled={loading}>
            {loading ? <RefreshCw className="spin" size={15} /> : <Sparkles size={15} />}
            {loading ? "Generating briefing…" : "Predict and generate briefing"}
          </button>

          {error && (
            <div className="error-panel">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Gemini output is rendered as text; no generated content is hard-coded here. */}
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Generated executive report</h3>
              <p>Live Gemini output based on the returned model estimate.</p>
            </div>
            <span className="soft-tag">LIVE OUTPUT</span>
          </div>

          {report ? (
            <div className="generated-report">
              <div className="report-meta">
                <CheckCircle2 size={15} />
                {report.provider} · {report.model} · {report.method}
              </div>
              <pre>{report.report}</pre>
            </div>
          ) : (
            <div className="empty-brief">
              <div><Sparkles size={20} /></div>
              <b>No report generated yet</b>
              <p>
                Submit the form to run churn prediction and generate a
                customer-specific retention briefing.
              </p>
            </div>
          )}
        </section>
      </div>

      <Notice>
        <b>API key security:</b> Gemini credentials stay in backend/.env and are
        never sent to the browser. A missing or invalid key returns a clear service error.
      </Notice>
    </>
  );
}
