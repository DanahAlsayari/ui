import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Mount the React dashboard into the root element from index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
