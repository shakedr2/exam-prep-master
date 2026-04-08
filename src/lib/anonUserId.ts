// Anonymous, stable learner identity.
//
// Until real auth lands, we persist progress against a UUID generated on
// first visit and stored in localStorage. The id is passed to Supabase as
// `user_progress.user_id` so the same browser keeps its history across
// reloads and across tabs.
//
// If `useAuth` ever returns a real user, callers should prefer that id
// and fall back to this one only when no real user is present.

const STORAGE_KEY = "anon_user_id";

function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Minimal RFC4122 v4 fallback for older browsers. Only used in tests
  // and very old environments.
  const hex = "0123456789abcdef";
  let out = "";
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      out += "-";
      continue;
    }
    if (i === 14) {
      out += "4";
      continue;
    }
    const r = Math.floor(Math.random() * 16);
    if (i === 19) {
      out += hex[(r & 0x3) | 0x8];
      continue;
    }
    out += hex[r];
  }
  return out;
}

export function getAnonUserId(): string {
  if (typeof window === "undefined") {
    // SSR / test: return a stable placeholder; the client will regenerate.
    return "00000000-0000-4000-8000-000000000000";
  }
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length > 0) return existing;
    const fresh = generateUuid();
    window.localStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // localStorage unavailable (private mode, SSR). Fall back to a
    // per-call UUID so the app keeps working; persistence is disabled.
    return generateUuid();
  }
}
