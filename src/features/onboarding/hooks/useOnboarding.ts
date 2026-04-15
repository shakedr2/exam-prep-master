// Issue #148: Onboarding wizard state — completion gate + user goals.
//
// Persists to public.user_onboarding when a user is signed in, and to
// localStorage ("examprep_onboarding") otherwise, so the wizard doesn't
// re-show for returning guests.

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  trackOnboardingCompleted,
  trackOnboardingStep,
} from "@/features/gamification/lib/events";

const LOCAL_KEY = "examprep_onboarding";

export interface OnboardingState {
  completed: boolean;
  goalDailyQuestions: number | null;
  goalExamDate: string | null;
  preferredTopics: string[];
}

const DEFAULT_STATE: OnboardingState = {
  completed: false,
  goalDailyQuestions: null,
  goalExamDate: null,
  preferredTopics: [],
};

function loadLocal(): OnboardingState {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return { ...DEFAULT_STATE };
}

function saveLocal(state: OnboardingState) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function useOnboarding() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<OnboardingState>(loadLocal);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (authLoading) return;

    (async () => {
      if (!userId) {
        setState(loadLocal());
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("user_onboarding")
        .select("completed, goal_daily_questions, goal_exam_date, preferred_topics")
        .eq("user_id", userId)
        .maybeSingle();
      if (cancelled) return;

      if (data) {
        setState({
          completed: data.completed,
          goalDailyQuestions: data.goal_daily_questions,
          goalExamDate: data.goal_exam_date,
          preferredTopics: data.preferred_topics ?? [],
        });
      } else {
        // fall back to local for users signing in for the first time
        setState(loadLocal());
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  const recordStep = useCallback((step: string, props?: Record<string, unknown>) => {
    trackOnboardingStep(step, props);
  }, []);

  const complete = useCallback(
    async (goals: {
      goalDailyQuestions: number | null;
      goalExamDate: string | null;
      preferredTopics: string[];
    }) => {
      const next: OnboardingState = {
        completed: true,
        goalDailyQuestions: goals.goalDailyQuestions,
        goalExamDate: goals.goalExamDate,
        preferredTopics: goals.preferredTopics,
      };
      setState(next);
      saveLocal(next);

      trackOnboardingCompleted({
        goal_daily_questions: goals.goalDailyQuestions,
        goal_exam_date: goals.goalExamDate,
        preferred_topics_count: goals.preferredTopics.length,
      });

      if (userId) {
        const { error } = await supabase.from("user_onboarding").upsert(
          {
            user_id: userId,
            completed: true,
            goal_daily_questions: goals.goalDailyQuestions,
            goal_exam_date: goals.goalExamDate,
            preferred_topics: goals.preferredTopics,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
        if (error) console.error("save onboarding failed:", error);
      }
    },
    [userId]
  );

  const skip = useCallback(async () => {
    const next: OnboardingState = { ...state, completed: true };
    setState(next);
    saveLocal(next);
    trackOnboardingCompleted({ skipped: true });

    if (userId) {
      await supabase.from("user_onboarding").upsert(
        {
          user_id: userId,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  }, [state, userId]);

  return { state, loading, complete, skip, recordStep };
}
