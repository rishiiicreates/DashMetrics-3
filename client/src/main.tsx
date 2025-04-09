import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add page title and meta description
document.title = "DashMetrics - Social Media Analytics Dashboard";
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "DashMetrics - A modern social media analytics dashboard for tracking your social media performance.";
document.head.appendChild(metaDescription);

// Add favicon
const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📊</text></svg>";
document.head.appendChild(favicon);

createRoot(document.getElementById("root")!).render(<App />);
