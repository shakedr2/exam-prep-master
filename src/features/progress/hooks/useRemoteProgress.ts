// Issue #95: Supabase-backed progress for AUTHENTICATED users.
//
// Mirrors the surface of `useLocalProgress` so that the facade in
// `src/hooks/useProgress.ts` can swap one for the other based on
// auth state without consumers caring which backend is in play.
//
// - Reads `user_progress` rows via React Query, derives the same
//   `UserProgress` shape the rest of the app already consumes.
// - Reads/writes the user's `user_profiles` row for username and
//   last practice position.
// - Provides `syncAnswer` (the issue's required mutation name) which
//   upserts a question result and optimistically patches the cache so
//   the dashboard counters tick instantly.
// - Provides `updateLastPosition` which the practice page calls each
//   time the learner advances, so a returning session resumes at the
//   exact question they were on.
//
// Out of scope for this issue (no DB columns yet, returned as safe
// defaults so consumers don't crash):
//   - streak / lastActiveDate
//   - examHistory
//   - badges

import { useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { questions } from "@/data/questions";
import {
  XP_PER_CORRECT,
  XP_PER_LEVEL,
  type UserProgress,
} from "@/features/progress/hooks/useLocalProgress";

interface UserProgressRow {
  question_id: string;
  topic_id: string;
  is_correct: boolean;
  attempts: number;
  answered_at: string;
}

interface UserProfileRow {
  id: string;
  username: string | null;
  last_topic_id: string | null;
  last_question_index: number | null;
}

const EMPTY_ROWS: UserProgressRow[] = [];

function progressKey(userId: string | undefined) {
  return ["user_progress", userId] as const;
}

function profileKey(userId: string | undefined) {
  return ["user_profile", userId] as const;
}

export function useRemoteProgress() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  // ---- Reads ----------------------------------------------------------

  const progressQuery = useQuery({
    queryKey: progressKey(userId),
    enabled: !!userId,
    queryFn: async (): Promise<UserProgressRow[]> => {
      if (!userId) return EMPTY_ROWS;
      const { data, error } = await supabase
        .from("user_progress")
        .select("question_id, topic_id, is_correct, attempts, answered_at")
        .eq("user_id", userId);
      if (error) {
        console.error("user_progress fetch failed:", error.message);
        return EMPTY_ROWS;
      }
      return (data ?? []) as UserProgressRow[];
    },
  });

  const profileQuery = useQuery({
    queryKey: profileKey(userId),
    enabled: !!userId,
    queryFn: async (): Promise<UserProfileRow | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, last_topic_id, last_question_index")
        .eq("id", userId)
        .maybeSingle();
      if (error) {
        console.error("user_profiles fetch failed:", error.message);
        return null;
      }
      return (data as UserProfileRow | null) ?? null;
    },
  });

  const rows = progressQuery.data ?? EMPTY_ROWS;
  const profile = profileQuery.data ?? null;

  // ---- Derived UserProgress shape ------------------------------------

  const answeredQuestions = useMemo(() => {
    const map: Record<string, { correct: boolean; attempts: number }> = {};
    for (const row of rows) {
      map[row.question_id] = {
        correct: row.is_correct,
        attempts: row.attempts ?? 1,
      };
    }
    return map;
  }, [rows]);

  const totalCorrect = useMemo(
    () => Object.values(answeredQuestions).filter((a) => a.correct).length,
    [answeredQuestions]
  );

  const totalAnswered = useMemo(
    () => Object.keys(answeredQuestions).length,
    [answeredQuestions]
  );

  const xp = totalCorrect * XP_PER_CORRECT;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;

  const lastPosition = useMemo<Record<string, number>>(() => {
    if (profile?.last_topic_id != null && profile?.last_question_index != null) {
      return { [profile.last_topic_id]: profile.last_question_index };
    }
    return {};
  }, [profile?.last_topic_id, profile?.last_question_index]);

  const progress: UserProgress = useMemo(
    () => ({
      username: profile?.username ?? "",
      xp,
      level,
      streak: 0,
      lastActiveDate: "",
      answeredQuestions,
      topicProgress: {},
      examHistory: [],
      badges: [],
      lastPosition,
    }),
    [profile?.username, xp, level, answeredQuestions, lastPosition]
  );

  // ---- Mutations ------------------------------------------------------

  const syncAnswerMutation = useMutation({
    mutationFn: async (vars: {
      questionId: string;
      topicId: string;
      isCorrect: boolean;
    }) => {
      if (!userId) throw new Error("syncAnswer called without an authenticated user");

      // Single atomic DB call: INSERT … ON CONFLICT DO UPDATE increments
      // attempts and returns the new count. Replaces the prior 2-query
      // read-then-write pattern.
      const { data, error } = await supabase.rpc("upsert_user_progress", {
        p_user_id: userId,
        p_question_id: vars.questionId,
        p_topic_id: vars.topicId,
        p_is_correct: vars.isCorrect,
      });
      if (error) throw error;

      const result = data as { attempts: number; answered_at: string };
      return { ...vars, attempts: result.attempts, at: result.answered_at };
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: progressKey(userId) });
      const previous = queryClient.getQueryData<UserProgressRow[]>(progressKey(userId)) ?? [];
      const existingIdx = previous.findIndex((r) => r.question_id === vars.questionId);
      const prevAttempts = existingIdx >= 0 ? previous[existingIdx].attempts ?? 0 : 0;
      const optimisticRow: UserProgressRow = {
        question_id: vars.questionId,
        topic_id: vars.topicId,
        is_correct: vars.isCorrect,
        attempts: prevAttempts + 1,
        answered_at: new Date().toISOString(),
      };
      const next =
        existingIdx >= 0
          ? previous.map((r, i) => (i === existingIdx ? optimisticRow : r))
          : [...previous, optimisticRow];
      queryClient.setQueryData(progressKey(userId), next);
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      console.error("syncAnswer failed:", err);
      if (ctx?.previous) {
        queryClient.setQueryData(progressKey(userId), ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: progressKey(userId) });
    },
  });

  const updateLastPositionMutation = useMutation({
    mutationFn: async (vars: { topicId: string; index: number }) => {
      if (!userId) throw new Error("updateLastPosition called without an authenticated user");
      const { error } = await supabase.from("user_profiles").upsert(
        {
          id: userId,
          last_topic_id: vars.topicId,
          last_question_index: vars.index,
        },
        { onConflict: "id" }
      );
      if (error) throw error;
      return vars;
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: profileKey(userId) });
      const previous = queryClient.getQueryData<UserProfileRow | null>(profileKey(userId)) ?? null;
      const optimistic: UserProfileRow = {
        id: userId ?? "",
        username: previous?.username ?? null,
        last_topic_id: vars.topicId,
        last_question_index: vars.index,
      };
      queryClient.setQueryData(profileKey(userId), optimistic);
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      console.error("updateLastPosition failed:", err);
      if (ctx) {
        queryClient.setQueryData(profileKey(userId), ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKey(userId) });
    },
  });

  const setUsernameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!userId) throw new Error("setUsername called without an authenticated user");
      const { error } = await supabase.from("user_profiles").upsert(
        { id: userId, username: name },
        { onConflict: "id" }
      );
      if (error) throw error;
      return name;
    },
    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: profileKey(userId) });
      const previous = queryClient.getQueryData<UserProfileRow | null>(profileKey(userId)) ?? null;
      const optimistic: UserProfileRow = {
        id: userId ?? "",
        username: name,
        last_topic_id: previous?.last_topic_id ?? null,
        last_question_index: previous?.last_question_index ?? null,
      };
      queryClient.setQueryData(profileKey(userId), optimistic);
      return { previous };
    },
    onError: (err, _vars, ctx) => {
      console.error("setUsername failed:", err);
      if (ctx) {
        queryClient.setQueryData(profileKey(userId), ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: profileKey(userId) });
    },
  });

  // ---- Public API (mirror useLocalProgress) ---------------------------

  const setUsername = useCallback(
    (name: string) => {
      setUsernameMutation.mutate(name);
    },
    [setUsernameMutation]
  );

  // Note: signature matches the local hook so the facade can pass calls
  // straight through. The local hook only takes (questionId, correct);
  // here we *also* need topicId, so consumers that want to be backend-
  // agnostic should use the facade's `answerQuestion(questionId, topicId, correct)`.
  const answerQuestion = useCallback(
    (questionId: string, topicId: string, correct: boolean) => {
      syncAnswerMutation.mutate({ questionId, topicId, isCorrect: correct });
    },
    [syncAnswerMutation]
  );

  const syncAnswer = useCallback(
    (questionId: string, topicId: string, isCorrect: boolean) => {
      syncAnswerMutation.mutate({ questionId, topicId, isCorrect });
    },
    [syncAnswerMutation]
  );

  const updateLastPosition = useCallback(
    (topicId: string, index: number) => {
      updateLastPositionMutation.mutate({ topicId, index });
    },
    [updateLastPositionMutation]
  );

  const saveTopicPosition = updateLastPosition; // alias matching local hook

  const getTopicPosition = useCallback(
    (topicId: string): number => lastPosition[topicId] ?? 0,
    [lastPosition]
  );

  const addExamResult = useCallback((_score: number, _total: number) => {
    // Out of scope for issue #95 — no exam_results table yet. The facade
    // routes exam writes to the local hook for now so existing UI keeps
    // working. This is a no-op stub kept here only for shape parity.
  }, []);

  const getTopicCompletion = useCallback(
    (topicId: string, totalQuestions: number) => {
      const correct = rows.filter((r) => r.topic_id === topicId && r.is_correct).length;
      return Math.min(100, Math.round((correct / Math.max(totalQuestions, 1)) * 100));
    },
    [rows]
  );

  const getIncorrectQuestions = useCallback(() => {
    const incorrectIds = new Set(
      rows.filter((r) => !r.is_correct).map((r) => r.question_id)
    );
    return questions.filter((q) => incorrectIds.has(q.id));
  }, [rows]);

  const getIncorrectByTopic = useCallback(
    (topicId: string) => getIncorrectQuestions().filter((q) => q.topic === topicId),
    [getIncorrectQuestions]
  );

  const getWeakTopics = useCallback(
    (limit = 3) => {
      // Group answers by topic using the local question catalog as the
      // source of truth for topic mapping. This matches useLocalProgress
      // behavior exactly so the facade returns identical results.
      const topicStats: Record<string, { correct: number; attempted: number }> = {};
      for (const [id, answer] of Object.entries(answeredQuestions)) {
        const question = questions.find((q) => q.id === id);
        if (!question) continue;
        const topic = question.topic;
        if (!topicStats[topic]) topicStats[topic] = { correct: 0, attempted: 0 };
        topicStats[topic].attempted += 1;
        if (answer.correct) topicStats[topic].correct += 1;
      }
      return Object.entries(topicStats)
        .filter(([, stats]) => stats.attempted > 0)
        .map(([topicId, stats]) => ({
          topicId,
          successRate: stats.correct / stats.attempted,
        }))
        .sort((a, b) => a.successRate - b.successRate)
        .slice(0, limit);
    },
    [answeredQuestions]
  );

  const getAttempts = useCallback(
    (questionId: string) => answeredQuestions[questionId]?.attempts ?? 0,
    [answeredQuestions]
  );

  return {
    progress,
    setUsername,
    answerQuestion,
    syncAnswer,
    updateLastPosition,
    addExamResult,
    getTopicCompletion,
    getIncorrectQuestions,
    getIncorrectByTopic,
    getWeakTopics,
    getAttempts,
    saveTopicPosition,
    getTopicPosition,
    totalCorrect,
    totalAnswered,
    isLoading: progressQuery.isLoading || profileQuery.isLoading,
  };
}
