import posthog from "posthog-js";

export function initPostHog() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  const apiHost = import.meta.env.VITE_POSTHOG_HOST;
  if (!key) return;

  // posthog-js is safe to call init() on more than once, but guard
  // anyway so we don't re-initialise after the user toggles consent.
  if (posthog.__loaded) return;

  posthog.init(key, {
    api_host: apiHost || "https://us.i.posthog.com",
    person_profiles: "identified_only",
    capture_pageview: false,
  });
}

export { posthog };
