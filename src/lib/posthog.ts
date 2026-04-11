import posthog from "posthog-js";

export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const apiHost = import.meta.env.VITE_POSTHOG_HOST;
  if (!key) return;

  posthog.init(key, {
    api_host: apiHost || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
  });
}

export { posthog };
