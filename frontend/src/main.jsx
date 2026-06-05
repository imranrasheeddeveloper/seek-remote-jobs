import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("Root element not found");
} else {
  console.log("Mounting React app...");
  try {
    createRoot(rootEl).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log("React app mounted successfully");
  } catch (error) {
    console.error("Failed to mount React app:", error);
    rootEl.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
  }
}
