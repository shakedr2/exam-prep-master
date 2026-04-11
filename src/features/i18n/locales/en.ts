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
};

export default en;
