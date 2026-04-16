/**
 * Cookie Consent utility
 *
 * Stores user consent decisions in localStorage so that analytics scripts
 * (PostHog) are only initialised after the user has explicitly opted-in.
 *
 * Consent schema is versioned: if the stored version is older than
 * CONSENT_VERSION the banner is shown again so users can re-confirm under
 * any updated cookie policy.
 */

export const CONSENT_KEY = "cookie_consent";
export const CONSENT_VERSION = "1.0";

export interface ConsentPreferences {
  /** Always true — required for auth / session to work. */
  necessary: true;
  /** PostHog analytics (opt-in). */
  analytics: boolean;
  /** Version of the consent schema. */
  version: string;
  /** ISO timestamp when the user made their choice. */
  timestamp: string;
}

/** Returns stored consent if present and up-to-date, otherwise null. */
export function getStoredConsent(): ConsentPreferences | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentPreferences;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persists the user's consent choice. */
export function saveConsent(analytics: boolean): ConsentPreferences {
  const prefs: ConsentPreferences = {
    necessary: true,
    analytics,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
  return prefs;
}

/** True when the user has already given (or denied) consent. */
export function hasConsented(): boolean {
  return getStoredConsent() !== null;
}

/** True when the user has accepted analytics tracking. */
export function hasAnalyticsConsent(): boolean {
  return getStoredConsent()?.analytics === true;
}
