import { useTranslation } from "react-i18next";

interface LoadingSpinnerProps {
  /** Additional CSS classes for the outer container. */
  className?: string;
}

/**
 * Reusable loading spinner used as a Suspense fallback for lazy-loaded routes.
 * Renders a centered animated spinner with a translated "Loading…" label.
 */
export function LoadingSpinner({ className = "" }: LoadingSpinnerProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[50vh] gap-3 ${className}`}
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"
        role="status"
        aria-label={t("common.loading")}
      />
      <span className="text-sm text-muted-foreground">{t("common.loading")}</span>
    </div>
  );
}
