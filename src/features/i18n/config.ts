import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import he from "./locales/he";
import en from "./locales/en";
import { DEFAULT_LOCALE } from "./locales";

i18n.use(initReactI18next).init({
  resources: {
    he: { translation: he },
    en: { translation: en },
  },
  lng: DEFAULT_LOCALE,
  fallbackLng: DEFAULT_LOCALE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
