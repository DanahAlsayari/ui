import { useEffect, useState } from "react";
import { shortName } from "./data";
import { Sidebar } from "./components/Layout";
import Overview from "./pages/Overview";
import ChurnPrediction from "./pages/ChurnPrediction";
import CustomerSegments from "./pages/CustomerSegments";
import GenAIRecommendations from "./pages/GenAIRecommendations";

// The API base URL can be changed without editing the page components.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// App owns global navigation and API health; each page owns its own UI state.
export default function App() {
  const [page, setPage] = useState("overview");
  const [health, setHealth] = useState(null);

  // Check backend availability once when the dashboard first loads.
  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((response) => response.json())
      .then(setHealth)
      .catch(() => setHealth({ status: "offline" }));
  }, []);

  // Render the selected page while keeping the shared sidebar and footer in place.
  function renderCurrentPage() {
    switch (page) {
      case "predictions":
        return <ChurnPrediction apiUrl={API_URL} />;
      case "segments":
        return <CustomerSegments apiUrl={API_URL} />;
      case "genai":
        return <GenAIRecommendations apiUrl={API_URL} />;
      case "overview":
      default:
        return <Overview setPage={setPage} health={health} />;
    }
  }

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <div className="main-shell">
        <main className="main-content">
          {renderCurrentPage()}

          <footer>
            <span>{shortName} · SWE485</span>
            <span>
              <i />
              {health?.status === "ok"
                ? "API connected"
                : "API connection unavailable"}
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
