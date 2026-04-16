import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { TopicId } from "../types";

const LOCAL_STORAGE_KEY = (topicId: TopicId, userId: string) =>
  `topic-progress:${userId}:${topicId}`;

interface TopicProgressRow {
  topic_id: string;
  module_id: string;
  lesson_id: string;
  completed_at: string;
}

/**
 * Per-topic lesson progress.
 *
 * Reads from Supabase's `topic_progress` table when the user is
 * authenticated, and falls back to `localStorage` for guest users.
 * Writes always go to both (best-effort) so that the UI remains
 * responsive even when offline.
 *
 * This is intentionally small: completion is the only state here. More
 * granular mastery lives in the existing `user_learning_progress` table.
 */
export function useTopicProgress(topicId: TopicId) {
  const { user } = useAuth();
  const userId = user?.id ?? "guest";
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    new Set(),
  );

  // Hydrate on mount / whenever user or topic changes.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      // Always seed from localStorage first for instant UI.
      try {
        const raw = window.localStorage.getItem(
          LOCAL_STORAGE_KEY(topicId, userId),
        );
        if (raw) {
          const arr = JSON.parse(raw) as string[];
          if (!cancelled) setCompletedLessonIds(new Set(arr));
        } else if (!cancelled) {
          setCompletedLessonIds(new Set());
        }
      } catch {
        // Ignore parse errors, fall through to remote.
      }

      if (!user) return;

      const { data, error } = await supabase
        .from("topic_progress")
        .select("topic_id, module_id, lesson_id, completed_at")
        .eq("user_id", user.id)
        .eq("topic_id", topicId);

      if (cancelled) return;
      if (error) {
        console.warn("[useTopicProgress] remote fetch failed:", error.message);
        return;
      }

      const ids = new Set((data ?? []).map((r: TopicProgressRow) => r.lesson_id));
      setCompletedLessonIds(ids);
      try {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY(topicId, userId),
          JSON.stringify([...ids]),
        );
      } catch {
        // quota / privacy-mode — best-effort only
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [topicId, user, userId]);

  const markLessonComplete = useCallback(
    async (moduleId: string, lessonId: string) => {
      // Optimistic local update.
      setCompletedLessonIds((prev) => {
        if (prev.has(lessonId)) return prev;
        const next = new Set(prev);
        next.add(lessonId);
        try {
          window.localStorage.setItem(
            LOCAL_STORAGE_KEY(topicId, userId),
            JSON.stringify([...next]),
          );
        } catch {
          // best-effort
        }
        return next;
      });

      if (!user) return;

      const { error } = await supabase.from("topic_progress").upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          module_id: moduleId,
          lesson_id: lessonId,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id,topic_id,lesson_id" },
      );

      if (error) {
        console.warn("[useTopicProgress] upsert failed:", error.message);
      }
    },
    [topicId, user, userId],
  );

  return { completedLessonIds, markLessonComplete };
}
