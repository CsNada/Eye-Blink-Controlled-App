import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

import { EyeProvider } from "./app/components/EyeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EyeProvider>
      <App />
    </EyeProvider>
  </React.StrictMode>
);