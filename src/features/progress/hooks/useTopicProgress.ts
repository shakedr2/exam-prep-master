import { useMemo } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useDashboardData } from "@/hooks/useDashboardData";
import { questions } from "@/data/questions";
import { resolveTopicId } from "@/data/topicTutorials";
import {
  calcTopicProgress,
  type AnsweredMap,
} from "../lib/progressSelectors";
import type { TopicProgress } from "../lib/progressTypes";

/**
 * React wrapper around {@link calcTopicProgress}.
 *
 * Resolves the remote question count (UUID-keyed in `useDashboardData`) and
 * the static count from the in-repo question catalog, then applies the
 * `max(remote, static)` denominator policy defined in the selectors.
 *
 * Memoised: returns a referentially-stable `TopicProgress` object as long as
 * the underlying data ({@link useProgress}, {@link useDashboardData}) has not
 * changed.
 *
 * **Dead code until Phase 2 Step 3** — nothing in the UI tree calls this hook
 * yet. It will replace inline `getTopicCompletion` calls once Step 3 lands.
 *
 * @param topicId - Canonical topic slug, e.g. `"loops"` or `"conditions"`.
 */
export function useTopicProgress(topicId: string): TopicProgress {
  const { progress } = useProgress();
  const { questionCounts } = useDashboardData();
  const { answeredQuestions } = progress;

  const answeredMap = useMemo((): AnsweredMap => {
    // Build a set of question IDs that belong to this topic so we only scan
    // answeredQuestions once regardless of the total catalog size.
    const qIds = new Set(
      questions.filter((q) => (q.topic as string) === topicId).map((q) => q.id)
    );
    let correct = 0;
    let attempted = 0;
    for (const [qId, ans] of Object.entries(answeredQuestions)) {
      if (qIds.has(qId)) {
        attempted++;
        if (ans.correct) correct++;
      }
    }
    return { [topicId]: { correct, attempted } };
    // `questions` is a static module-level constant; not included in deps.
  }, [topicId, answeredQuestions]);

  const remoteCount = useMemo(() => {
    const resolved = resolveTopicId(topicId);
    return resolved ? (questionCounts[resolved.uuid] ?? 0) : 0;
  }, [topicId, questionCounts]);

  const staticCount = useMemo(
    () => questions.filter((q) => (q.topic as string) === topicId).length,
    // `questions` is static; only re-run when the topic changes.
    [topicId]
  );

  return useMemo(
    () => calcTopicProgress(topicId, answeredMap, remoteCount, staticCount),
    [topicId, answeredMap, remoteCount, staticCount]
  );
}
