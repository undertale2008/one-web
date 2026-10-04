import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSettings } from "./lib/settings";
import "./styles/theme.css";

initSettings();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
