import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "examprep_progress";
const MERGE_FLAG = "examprep_guest_merged";

interface GuestProgress {
  answeredQuestions?: Record<string, { correct: boolean; attempts: number }>;
  lastPosition?: Record<string, number>;
}

function loadGuestProgress(): GuestProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestProgress;
  } catch {
    return null;
  }
}

/**
 * Merges guest localStorage progress into the authenticated user's Supabase
 * user_progress rows. Uses a no-overwrite strategy: existing rows for this
 * user are left untouched; only rows that don't yet exist are inserted.
 *
 * After a successful merge the localStorage guest data is cleared and a flag
 * is set so the merge never runs a second time.
 */
export async function mergeGuestProgress(userId: string): Promise<void> {
  if (localStorage.getItem(MERGE_FLAG)) return;

  const guest = loadGuestProgress();
  const answered = guest?.answeredQuestions;
  if (!answered || Object.keys(answered).length === 0) {
    localStorage.setItem(MERGE_FLAG, "1");
    return;
  }

  const questionIds = Object.keys(answered);

  // Fetch topic_id for every question we want to migrate.
  const { data: questionRows, error: readError } = await supabase
    .from("questions")
    .select("id, topic_id")
    .in("id", questionIds);

  if (readError) {
    console.error("mergeGuestProgress: failed to fetch questions:", readError.message);
    return;
  }

  const topicByQuestion: Record<string, string> = {};
  for (const row of questionRows ?? []) {
    topicByQuestion[row.id] = row.topic_id;
  }

  // Check which question_ids already exist for this user so we can skip them
  // (no-overwrite strategy).
  const { data: existingRows, error: existingError } = await supabase
    .from("user_progress")
    .select("question_id")
    .eq("user_id", userId)
    .in("question_id", questionIds);

  if (existingError) {
    console.error("mergeGuestProgress: failed to fetch existing progress:", existingError.message);
    return;
  }

  const existingSet = new Set((existingRows ?? []).map((r) => r.question_id));

  const now = new Date().toISOString();
  const rows = questionIds
    .filter((qid) => topicByQuestion[qid] && !existingSet.has(qid))
    .map((qid) => ({
      user_id: userId,
      question_id: qid,
      topic_id: topicByQuestion[qid],
      is_correct: answered[qid].correct,
      answered_at: now,
      attempts: answered[qid].attempts ?? 1,
      last_attempted_at: now,
    }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("user_progress").insert(rows);
    if (insertError) {
      console.error("mergeGuestProgress: insert failed:", insertError.message);
      return;
    }
  }

  // Clear guest data and mark as merged.
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(MERGE_FLAG, "1");
}
