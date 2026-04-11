/**
 * Hebrew (he) — default locale translations.
 *
 * Only add keys here for NEW features built after the i18n foundation.
 * Do NOT add keys for existing Hebrew-hardcoded components.
 *
 * Key convention: <feature>.<component>.<element>
 * Example: "common.loading", "auth.login.title", "practice.result.correct"
 */
const he = {
  common: {
    loading: "טוען...",
    error: "שגיאה",
    retry: "נסה שוב",
    close: "סגור",
    confirm: "אישור",
    cancel: "ביטול",
    submit: "שלח",
    back: "חזרה",
    next: "הבא",
    finish: "סיום",
    save: "שמור",
  },
} as const;

export default he;
export type Translations = typeof he;
