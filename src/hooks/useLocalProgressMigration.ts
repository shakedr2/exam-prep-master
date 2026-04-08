import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

// One-time migration: copy the legacy localStorage progress blob into
// Supabase so existing users don't lose their history when they open
// the app for the first time after this change is deployed.

const LEGACY_KEY = "examprep_progress";
const MIGRATED_FLAG = "examprep_progress_migrated_to_supabase";

interface LegacyProgress {
  answeredQuestions?: Record<string, { correct: boolean; attempts: number }>;
}

function loadLegacy(): LegacyProgress | null {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LegacyProgress;
  } catch {
    return null;
  }
}

/**
 * Idempotent: guarded by a flag in localStorage, so subsequent reloads
 * do nothing. Runs once per browser. Silent on failure — the app keeps
 * working from Supabase going forward even if the migration didn't run.
 */
export function useLocalProgressMigration() {
  const { user } = useAuth();
  useEffect(() => {
    async function run() {
      try {
        if (localStorage.getItem(MIGRATED_FLAG)) return;
        const legacy = loadLegacy();
        const answered = legacy?.answeredQuestions;
        if (!answered || Object.keys(answered).length === 0) {
          localStorage.setItem(MIGRATED_FLAG, "1");
          return;
        }

        const effectiveUserId = user?.id ?? getAnonUserId();

        // We need the topic_id for each question — look them up in bulk.
        const questionIds = Object.keys(answered);
        const { data: questionRows, error: readError } = await supabase
          .from("questions")
          .select("id, topic_id")
          .in("id", questionIds);
        if (readError) {
          console.error("progress migration read failed:", readError.message);
          return;
        }

        const topicByQuestion: Record<string, string> = {};
        for (const row of questionRows ?? []) {
          topicByQuestion[row.id] = row.topic_id;
        }

        const now = new Date().toISOString();
        const rows = questionIds
          .filter((qid) => topicByQuestion[qid])
          .map((qid) => ({
            user_id: effectiveUserId,
            question_id: qid,
            topic_id: topicByQuestion[qid],
            is_correct: answered[qid].correct,
            answered_at: now,
            attempts: answered[qid].attempts ?? 1,
            last_attempted_at: now,
          }));

        if (rows.length > 0) {
          const { error: upsertError } = await supabase
            .from("user_progress")
            .upsert(rows, { onConflict: "user_id,question_id" });
          if (upsertError) {
            console.error("progress migration upsert failed:", upsertError.message);
            return;
          }
        }

        localStorage.setItem(MIGRATED_FLAG, "1");
      } catch (err) {
        console.error("progress migration crashed:", err);
      }
    }
    run();
  }, [user]);
}
