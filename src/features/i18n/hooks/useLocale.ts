import { useTranslation } from "react-i18next";
import { getLocaleDirection, isRTL, DEFAULT_LOCALE, LOCALES, type LocaleDirection } from "../locales";
import type { Locale } from "@/types/curriculum";

export interface UseLocaleReturn {
  locale: Locale;
  direction: LocaleDirection;
  isRTL: boolean;
}

/**
 * Returns the active locale and its text-direction metadata.
 *
 * Use `direction` on wrapper elements instead of hardcoding `dir="rtl"`.
 *
 * @example
 * const { locale, direction } = useLocale();
 * return <div dir={direction}>...</div>;
 */
export function useLocale(): UseLocaleReturn {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const locale: Locale = lang in LOCALES ? (lang as Locale) : DEFAULT_LOCALE;
  const direction = getLocaleDirection(locale);

  return {
    locale,
    direction,
    isRTL: isRTL(locale),
  };
}
