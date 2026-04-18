import { useMemo } from "react";
import { MODULES } from "@/data/modules";
import { useProgress } from "@/hooks/useProgress";
import { useDashboardData } from "@/hooks/useDashboardData";
import { calcModuleProgress } from "../lib/progressSelectors";
import { computeTopicProgress } from "./useTopicProgress";
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

    const topicProgresses = module.topicIds.map((topicId) =>
      computeTopicProgress(topicId as string, answeredQuestions, questionCounts)
    );

    return calcModuleProgress(moduleId, topicProgresses);
    // `MODULES` is a static module-level constant; omitted from deps.
  }, [moduleId, answeredQuestions, questionCounts]);
}
