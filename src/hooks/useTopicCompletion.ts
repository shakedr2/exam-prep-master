/**
 * Tracks which topics a user has passed the mini-quiz for.
 * Persists in localStorage (primary) with an optional Supabase
 * upsert for authenticated users (fire-and-forget).
 *
 * Also exposes `isTopicUnlocked` which implements the sequential
 * topic-gating rule: a topic is unlocked when the previous topic in
 * SYLLABUS_ORDER has been completed (or it is the first topic).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/shared/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

const STORAGE_KEY = "topic_quiz_passed_v1";

/** Ordered topic IDs for the Python Fundamentals track. */
export const SYLLABUS_ORDER: string[] = [
  "variables_io",
  "arithmetic",
  "conditions",
  "loops",
  "functions",
  "strings",
  "lists",
  "tuples_sets_dicts",
];

function loadLocal(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, boolean>;
    return {};
  } catch {
    return {};
  }
}

function saveLocal(data: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage unavailable
  }
}

export function useTopicCompletion() {
  const { user } = useAuth();
  const userIdRef = useRef(user?.id ?? getAnonUserId());
  useEffect(() => {
    userIdRef.current = user?.id ?? getAnonUserId();
  }, [user]);

  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>(loadLocal);

  // Fetch remote completions for authenticated users on mount / auth change.
  // The `user_topic_completions` table is created by the migration below.
  // If the table doesn't exist yet, the query simply returns an error and we
  // fall back to the localStorage snapshot already loaded in state.
  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;
    let cancelled = false;

    async function fetchRemote() {
      const { data, error } = await supabase
        .from("user_topic_completions")
        .select("topic_id")
        .eq("user_id", userId);

      if (cancelled || error || !data) return;

      const remote: Record<string, boolean> = {};
      for (const row of data) {
        remote[(row as { topic_id: string }).topic_id] = true;
      }
      const merged = { ...loadLocal(), ...remote };
      saveLocal(merged);
      setCompletedTopics(merged);
    }

    fetchRemote();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const markTopicComplete = useCallback(
    async (topicId: string) => {
      setCompletedTopics((prev) => {
        const next = { ...prev, [topicId]: true };
        saveLocal(next);
        return next;
      });

      // Persist to Supabase (fire-and-forget; localStorage is the safety net)
      if (user?.id) {
        await supabase
          .from("user_topic_completions")
          .upsert(
            { user_id: user.id, topic_id: topicId },
            { onConflict: "user_id,topic_id" }
          );
      }
    },
    [user?.id]
  );

  const isTopicComplete = useCallback(
    (topicId: string): boolean => completedTopics[topicId] === true,
    [completedTopics]
  );

  /**
   * A topic is unlocked when:
   * - It is the first topic in SYLLABUS_ORDER, OR
   * - Its predecessor has been completed (mini-quiz passed), OR
   * - It is not in SYLLABUS_ORDER at all (ungrouped topics are always unlocked)
   */
  const isTopicUnlocked = useCallback(
    (topicId: string): boolean => {
      const idx = SYLLABUS_ORDER.indexOf(topicId);
      if (idx <= 0) return true;
      const prevTopicId = SYLLABUS_ORDER[idx - 1];
      return completedTopics[prevTopicId] === true;
    },
    [completedTopics]
  );

  return { completedTopics, markTopicComplete, isTopicComplete, isTopicUnlocked };
}
