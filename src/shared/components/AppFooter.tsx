import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer
      className="border-t border-border bg-background/80 py-3 text-center text-xs text-muted-foreground"
      /* dir inherited from <html> — set dynamically by i18n config */
    >
      <Link
        to="/privacy"
        className="hover:text-foreground transition-colors underline underline-offset-2"
      >
        {t("privacy.footerLink")}
      </Link>
    </footer>
  );
}
