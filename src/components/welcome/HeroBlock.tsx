/**
 * HeroBlock — decorative hero section for the WelcomePage.
 *
 * Shows a title and subtitle sourced from i18n keys so the block is
 * locale-aware without hardcoding any Hebrew text.
 */

import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";

export function HeroBlock() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <GraduationCap className="h-8 w-8" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t("welcome.hero.title")}
      </h1>

      <p className="max-w-md text-base text-muted-foreground">
        {t("welcome.hero.subtitle")}
      </p>
    </div>
  );
}
