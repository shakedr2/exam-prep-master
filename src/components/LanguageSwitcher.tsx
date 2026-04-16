import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/**
 * Compact EN/HE toggle button for the header.
 *
 * Switches the app language between Hebrew and English.
 * The active language is highlighted; the inactive one is dimmed.
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === "he";

  const toggle = () => {
    i18n.changeLanguage(isHebrew ? "en" : "he");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isHebrew ? "Switch to English" : "החלף לעברית"}
      className={cn(
        "flex items-center gap-0.5 rounded-md px-2 py-1 text-xs font-semibold font-mono",
        "border border-border bg-background/50",
        "transition-colors duration-200",
        "hover:bg-foreground/5 hover:border-foreground/20",
      )}
    >
      <span
        className={cn(
          "px-1 py-0.5 rounded transition-colors duration-200",
          !isHebrew
            ? "text-foreground bg-foreground/10"
            : "text-muted-foreground",
        )}
      >
        EN
      </span>
      <span className="text-muted-foreground/40">/</span>
      <span
        className={cn(
          "px-1 py-0.5 rounded transition-colors duration-200",
          isHebrew
            ? "text-foreground bg-foreground/10"
            : "text-muted-foreground",
        )}
      >
        HE
      </span>
    </button>
  );
}
