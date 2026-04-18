import { useMemo } from "react";
import { MODULES } from "@/data/modules";
import { questions } from "@/data/questions";
import { resolveTopicId } from "@/data/topicTutorials";
import { useProgress } from "@/hooks/useProgress";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  calcTopicProgress,
  calcModuleProgress,
  type AnsweredMap,
} from "../lib/progressSelectors";
import type { ModuleProgress } from "../lib/progressTypes";

/**
 * React wrapper around {@link calcModuleProgress}.
 *
 * Composes the per-topic progress for every topic in the module and returns a
 * single {@link ModuleProgress} with the question-weighted Σ formula:
 *
 * ```
 * completionPct = round( Σ correct / Σ totalQuestions × 100 )
 * ```
 *
 * This is never the average of per-topic percentages. For a module with two
 * equal-size topics at 30 % and 70 %, the module reports exactly 50 %.
 *
 * Memoised: returns a referentially-stable object while the underlying data
 * has not changed.
 *
 * **Dead code until Phase 2 Step 5** — no UI component calls this hook yet.
 *
 * @param moduleId - The `id` of a module in `src/data/modules.ts`.
 */
export function useModuleProgress(moduleId: string): ModuleProgress {
  const { progress } = useProgress();
  const { questionCounts } = useDashboardData();
  const { answeredQuestions } = progress;

  return useMemo(() => {
    const module = MODULES.find((m) => m.id === moduleId);
    if (!module) return calcModuleProgress(moduleId, []);

    const topicProgresses = module.topicIds.map((topicId) => {
      const tid = topicId as string;

      const qIds = new Set(
        questions.filter((q) => (q.topic as string) === tid).map((q) => q.id)
      );
      let correct = 0;
      let attempted = 0;
      for (const [qId, ans] of Object.entries(answeredQuestions)) {
        if (qIds.has(qId)) {
          attempted++;
          if (ans.correct) correct++;
        }
      }
      const answeredMap: AnsweredMap = { [tid]: { correct, attempted } };

      const resolved = resolveTopicId(tid);
      const remoteCount = resolved ? (questionCounts[resolved.uuid] ?? 0) : 0;
      const staticCount = questions.filter(
        (q) => (q.topic as string) === tid
      ).length;

      return calcTopicProgress(tid, answeredMap, remoteCount, staticCount);
    });

    return calcModuleProgress(moduleId, topicProgresses);
    // `MODULES` and `questions` are static module-level constants; omitted from deps.
  }, [moduleId, answeredQuestions, questionCounts]);
}
