import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import he from "./locales/he";
import en from "./locales/en";
import { DEFAULT_LOCALE, getLocaleDirection } from "./locales";

const LANGUAGE_STORAGE_KEY = "i18nextLng";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      he: { translation: he },
      en: { translation: en },
    },
    fallbackLng: "en",
    supportedLngs: ["he", "en"],
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    // Set initial document direction and lang based on detected language
    const lang = i18n.language;
    const resolved = lang === "he" || lang === "en" ? lang : DEFAULT_LOCALE;
    const dir = getLocaleDirection(resolved as "he" | "en");
    document.documentElement.dir = dir;
    document.documentElement.lang = resolved;
  })
  .catch((err: unknown) => {
    console.error("[i18n] Initialization failed:", err);
  });

// Update document direction whenever language changes
i18n.on("languageChanged", (lng) => {
  const resolved = lng === "he" || lng === "en" ? lng : DEFAULT_LOCALE;
  const dir = getLocaleDirection(resolved as "he" | "en");
  document.documentElement.dir = dir;
  document.documentElement.lang = resolved;
});

export default i18n;
