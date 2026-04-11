import type { Locale } from "@/types/curriculum";

export type LocaleDirection = "rtl" | "ltr";

export interface LocaleConfig {
  code: Locale;
  label: string;
  direction: LocaleDirection;
}

/** All supported locales. Extend this map when adding a new language. */
export const LOCALES: Record<Locale, LocaleConfig> = {
  he: { code: "he", label: "עברית", direction: "rtl" },
  en: { code: "en", label: "English", direction: "ltr" },
};

/** The application default locale. Hebrew is the launch language. */
export const DEFAULT_LOCALE: Locale = "he";

/**
 * Returns the text-direction for a given locale.
 * Use this instead of hardcoding `dir="rtl"` in components.
 */
export function getLocaleDirection(locale: Locale): LocaleDirection {
  return LOCALES[locale].direction;
}

/**
 * Returns true when the locale reads right-to-left.
 */
export function isRTL(locale: Locale): boolean {
  return getLocaleDirection(locale) === "rtl";
}
