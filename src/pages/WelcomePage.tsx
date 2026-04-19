/**
 * Issue #306: WelcomePage — shown once after a user's first sign-up.
 *
 * Flow:
 *   1. User lands on /welcome after OAuth callback.
 *   2. If not authenticated → redirect to /login.
 *   3. If already onboarded (profiles.onboarded_at is set) → redirect to /.
 *   4. Otherwise render HeroBlock + TrackPicker.
 *   5. On track selection:
 *        a. Writes profiles.preferred_track.
 *        b. Sets profiles.onboarded_at.
 *        c. Navigates to /dashboard.
 */

import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale } from "@/features/i18n";
import { useWelcomeOnboarding } from "@/hooks/useOnboarding";
import { HeroBlock } from "@/components/welcome/HeroBlock";
import { TrackPicker } from "@/components/welcome/TrackPicker";
import type { WelcomeTrackId } from "@/components/welcome/TrackPicker";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

export default function WelcomePage() {
  const { user, loading: authLoading } = useAuth();
  const { isOnboarded, loading: onboardingLoading, completeWelcome } = useWelcomeOnboarding();
  const navigate = useNavigate();
  const { direction } = useLocale();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);

  // Fire once when onboarding is confirmed complete so the page redirects
  // automatically (e.g. if the user presses Back after completing onboarding).
  useEffect(() => {
    if (!onboardingLoading && isOnboarded) {
      navigate("/", { replace: true });
    }
  }, [isOnboarded, onboardingLoading, navigate]);

  // Still resolving auth session or profile row — show a spinner.
  if (authLoading || onboardingLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Unauthenticated — redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Already onboarded — redirect to home (handled by useEffect above, but
  // this guard prevents a flash of WelcomePage content).
  if (isOnboarded) {
    return <Navigate to="/" replace />;
  }

  async function handleTrackSelect(trackId: WelcomeTrackId) {
    if (saving) return;
    setSaving(true);
    try {
      await completeWelcome(trackId);
      navigate("/dashboard", { replace: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      dir={direction}
      className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center gap-12 px-4 py-16"
      aria-label={t("welcome.hero.title")}
    >
      <HeroBlock />

      <TrackPicker onSelect={handleTrackSelect} disabled={saving} />

      {saving && (
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {t("welcome.saving")}
        </p>
      )}
    </main>
  );
}
