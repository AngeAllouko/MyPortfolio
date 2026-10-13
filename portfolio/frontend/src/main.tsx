import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import PortfolioProvider from "./data/PortfolioProvider.tsx";
import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </StrictMode>,
);
