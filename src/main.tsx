import { initSentry } from "./lib/sentry";
import { initPostHog } from "./lib/posthog";
import { hasAnalyticsConsent } from "./lib/cookieConsent";
import "@/features/i18n/config";

initSentry();
// Only initialise PostHog on page load if the user has already given
// analytics consent. First-time visitors will have PostHog initialised
// by the CookieConsent component after they accept.
if (hasAnalyticsConsent()) {
  initPostHog();
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
