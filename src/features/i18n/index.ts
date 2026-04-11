/**
 * Public API for the i18n feature.
 *
 * Import from "@/features/i18n" in all new code.
 * Do NOT import directly from sub-modules (implementation details may change).
 */

export { DEFAULT_LOCALE, LOCALES, getLocaleDirection, isRTL } from "./locales";
export type { LocaleConfig, LocaleDirection } from "./locales";
export { useLocale } from "./hooks/useLocale";

// Re-export Locale type for convenience — it lives in types/curriculum.ts
export type { Locale } from "@/types/curriculum";
