// Issue #95: Smart facade that picks the right progress backend based on
// auth state. Authenticated users get Supabase-backed persistence via
// `useRemoteProgress`; guests keep using the localStorage-backed
// `useLocalProgress` (per CLAUDE.md no-break rule: "localStorage remains
// valid for guest state only").
//
// Both hooks are always called every render (Rules of Hooks), and we
// return a wrapper that exposes a single stable API regardless of which
// backend is active. The 3-arg `answerQuestion(questionId, topicId, correct)`
// signature is a small breaking change vs the historic 2-arg local-only
// form, justified by the fact that user_progress.topic_id is NOT NULL on
// the Supabase side and the topic is always known at the call site.

import { useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  useLocalProgress,
  type UserProgress,
} from "@/features/progress/hooks/useLocalProgress";
import { useRemoteProgress } from "@/features/progress/hooks/useRemoteProgress";

export type { UserProgress } from "@/features/progress/hooks/useLocalProgress";

export function useProgress() {
  const { user } = useAuth();
  const local = useLocalProgress();
  const remote = useRemoteProgress();

  const isAuthenticated = !!user;

  // Compose the visible `progress` object. For authenticated users we
  // start from the remote shape and merge in the few fields that are
  // still local-only (examHistory, badges). Streak and lastActiveDate
  // are deliberately sourced from Supabase (useDashboardStats /
  // useGamification) for authed users — merging local values here leaks
  // stale guest-session state across logins.
  const progress: UserProgress = useMemo(() => {
    if (isAuthenticated) {
      return {
        ...remote.progress,
        streak: 0,
        lastActiveDate: null,
        examHistory: local.progress.examHistory,
        badges: local.progress.badges,
      };
    }
    return local.progress;
  }, [isAuthenticated, local.progress, remote.progress]);

  const setUsername = useCallback(
    (name: string) => {
      // Always also write to local so a logout-then-relogin still has a
      // username locally for guest fallback. Cheap and avoids surprises.
      local.setUsername(name);
      if (isAuthenticated) remote.setUsername(name);
    },
    [isAuthenticated, local, remote]
  );

  const answerQuestion = useCallback(
    (questionId: string, topicId: string, correct: boolean) => {
      if (isAuthenticated) {
        remote.answerQuestion(questionId, topicId, correct);
      } else {
        local.answerQuestion(questionId, correct);
      }
    },
    [isAuthenticated, local, remote]
  );

  const addExamResult = useCallback(
    (score: number, total: number) => {
      // Exam history isn't in scope for #95 (no exam_results table), so
      // we always write to local for now. Authed users can still see
      // their history because the facade merges local.examHistory into
      // the visible `progress` object above.
      local.addExamResult(score, total);
    },
    [local]
  );

  const updateLastPosition = useCallback(
    (topicId: string, index: number) => {
      local.saveTopicPosition(topicId, index);
      if (isAuthenticated) remote.updateLastPosition(topicId, index);
    },
    [isAuthenticated, local, remote]
  );

  const saveTopicPosition = updateLastPosition;

  // Read paths: when authed, prefer the remote-derived helpers (so the
  // dashboard reflects Supabase rows); otherwise fall back to local.
  const active = isAuthenticated ? remote : local;

  return {
    progress,
    setUsername,
    answerQuestion,
    addExamResult,
    updateLastPosition,
    saveTopicPosition,
    getIncorrectQuestions: active.getIncorrectQuestions,
    getIncorrectByTopic: active.getIncorrectByTopic,
    getWeakTopics: active.getWeakTopics,
    getAttempts: active.getAttempts,
    getTopicPosition: active.getTopicPosition,
    totalCorrect: isAuthenticated ? remote.totalCorrect : local.totalCorrect,
    totalAnswered: isAuthenticated ? remote.totalAnswered : local.totalAnswered,
    isLoading: isAuthenticated ? remote.isLoading : false,
  };
}
