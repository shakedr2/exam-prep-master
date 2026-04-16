/**
 * English (en) — translations for new features.
 *
 * Mirror every key that exists in `he.ts`.
 * Leave values empty ("") when translation is not yet available —
 * i18next will fall back to the Hebrew default automatically.
 */
import type { Translations } from "./he";

const en: Translations = {
  common: {
    loading: "Loading...",
    error: "Error",
    retry: "Try again",
    close: "Close",
    confirm: "Confirm",
    cancel: "Cancel",
    submit: "Submit",
    back: "Back",
    next: "Next",
    finish: "Finish",
    save: "Save",
  },
  ai: {
    error: {
      timeout: "The AI request took too long. Please try again.",
      rateLimit: "The AI service is busy right now. Please wait a moment and try again.",
      serverError: "An AI server error occurred. Please try again.",
      network: "A network error occurred. Please check your connection and try again.",
      generic: "AI service error. Please try again.",
    },
  },
  privacy: {
    pageTitle: "Privacy Policy",
    lastUpdated: "Last updated",
    footerLink: "Privacy Policy",
  },
};

export default en;
