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
 * Pure helper (not a hook) that computes a {@link TopicProgress} for one topic
 * given the current answered-questions map and remote question counts.
 *
 * Extracted here so that {@link useModuleProgress} and {@link useTrackProgress}
 * can reuse the computation without calling a hook inside a loop.
 *
 * @internal
 */
export function computeTopicProgress(
  topicId: string,
  answeredQuestions: Record<string, { correct: boolean; attempts: number }>,
  questionCounts: Record<string, number>
): TopicProgress {
  // Filter once and reuse for both the answered-map and staticCount.
  const topicQuestions = questions.filter(
    (q) => (q.topic as string) === topicId
  );
  const qIds = new Set(topicQuestions.map((q) => q.id));

  let correct = 0;
  let attempted = 0;
  for (const [qId, ans] of Object.entries(answeredQuestions)) {
    if (qIds.has(qId)) {
      attempted++;
      if (ans.correct) correct++;
    }
  }

  const answeredMap: AnsweredMap = { [topicId]: { correct, attempted } };
  const resolved = resolveTopicId(topicId);
  const remoteCount = resolved ? (questionCounts[resolved.uuid] ?? 0) : 0;
  const staticCount = topicQuestions.length;

  return calcTopicProgress(topicId, answeredMap, remoteCount, staticCount);
}

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
 * @param topicId - Canonical topic slug, e.g. `"loops"` or `"conditions"`.
 */
export function useTopicProgress(topicId: string): TopicProgress {
  const { progress } = useProgress();
  const { questionCounts } = useDashboardData();
  const { answeredQuestions } = progress;

  return useMemo(
    () => computeTopicProgress(topicId, answeredQuestions, questionCounts),
    [topicId, answeredQuestions, questionCounts]
  );
}
