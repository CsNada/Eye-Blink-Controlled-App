import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { BlinkProvider } from "./app/contexts/BlinkContext";
import { EyeProvider } from "./app/components/EyeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BlinkProvider>
      <EyeProvider>
        <App />
      </EyeProvider>
    </BlinkProvider>
  </React.StrictMode>
);