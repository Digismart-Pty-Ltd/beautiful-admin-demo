import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const params = new URLSearchParams(window.location.search);
const pwaType = params.get("pwa");

if (pwaType === "admin" && !window.location.pathname.startsWith("/admin")) {
  window.location.replace("/admin/");
} else if (pwaType === "customer" && window.location.pathname.startsWith("/admin")) {
  window.location.replace("/");
} else {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
