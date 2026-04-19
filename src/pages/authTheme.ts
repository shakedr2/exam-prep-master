const LF_THEME_STORAGE_KEY = "lf-theme";

export function getLogicFlowThemeClass(): string {
  if (typeof window === "undefined") return "";

  try {
    return window.localStorage.getItem(LF_THEME_STORAGE_KEY) === "light" ? " lf-light" : "";
  } catch {
    return "";
  }
}
