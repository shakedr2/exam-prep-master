/**
 * Issue #306: WelcomePage onboarding hook.
 *
 * Reads `user_profiles.onboarded_at` to determine whether the current
 * authenticated user has already completed the welcome flow.
 *
 * - `isOnboarded` — true when `onboarded_at` is non-null (redirect away).
 * - `loading`     — true while the auth session or profile query is in flight.
 * - `completeWelcome(preferredTrack)` — writes `preferred_track` and
 *   `onboarded_at` to `user_profiles`, returns a promise that resolves when
 *   the upsert settles.
 *
 * Only works for authenticated users. Unauthenticated callers get
 * `{ isOnboarded: false, loading: false }` so the page can redirect to /login.
 */

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface WelcomeOnboardingState {
  isOnboarded: boolean;
  loading: boolean;
  completeWelcome: (preferredTrack: string) => Promise<void>;
}

export function useWelcomeOnboarding(): WelcomeOnboardingState {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;

    if (!userId) {
      setIsOnboarded(false);
      setLoading(false);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from("user_profiles")
        .select("onboarded_at")
        .eq("id", userId)
        .maybeSingle();

      if (!cancelled) {
        setIsOnboarded(!!data?.onboarded_at);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  const completeWelcome = useCallback(
    async (preferredTrack: string) => {
      if (!userId) return;

      const { error } = await supabase.from("user_profiles").upsert(
        {
          id: userId,
          preferred_track: preferredTrack,
          onboarded_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );

      if (error) {
        console.error("[useWelcomeOnboarding] completeWelcome failed:", error);
        return;
      }

      setIsOnboarded(true);
    },
    [userId],
  );

  return { isOnboarded, loading, completeWelcome };
}
