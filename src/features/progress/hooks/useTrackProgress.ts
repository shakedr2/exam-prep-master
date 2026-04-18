import { useMemo } from "react";
import { getModulesByTrack, type TrackId as ModuleTrackId } from "@/data/modules";
import { questions } from "@/data/questions";
import { resolveTopicId } from "@/data/topicTutorials";
import { useProgress } from "@/hooks/useProgress";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  calcTopicProgress,
  calcModuleProgress,
  calcTrackProgress,
  calcResumeTarget,
  type AnsweredMap,
} from "../lib/progressSelectors";
import type {
  TrackProgress,
  ResumeTarget,
  TrackId as ProgressTrackId,
} from "../lib/progressTypes";

// ── TrackId bridge ────────────────────────────────────────────────────────
// `src/data/modules.ts` uses the full display-form track IDs
// ("python-fundamentals", "python-oop", "devops") while the selector layer
// in `progressTypes.ts` uses the short form ("python", "oop", "devops").
// This mapping is the single place where those two naming conventions meet.
const MODULE_TO_PROGRESS_TRACK_ID: Record<ModuleTrackId, ProgressTrackId> = {
  "python-fundamentals": "python",
  "python-oop": "oop",
  devops: "devops",
};

/**
 * React wrapper around {@link calcTrackProgress}.
 *
 * Composes module-level progress for every (non-`comingSoon`) module in the
 * track and returns a single {@link TrackProgress} with the question-weighted
 * Σ formula so that every surface that calls this hook reports a consistent
 * completion percentage.
 *
 * Memoised: returns a referentially-stable object while the underlying data
 * has not changed.
 *
 * **Dead code until Phase 2 Step 3** — no UI component calls this hook yet.
 *
 * @param trackId - One of the track identifiers from `src/data/modules.ts`,
 *   e.g. `"python-fundamentals"`, `"python-oop"`, or `"devops"`.
 */
export function useTrackProgress(trackId: ModuleTrackId): TrackProgress {
  const { progress } = useProgress();
  const { questionCounts } = useDashboardData();
  const { answeredQuestions } = progress;

  return useMemo(() => {
    const modules = getModulesByTrack(trackId);

    const moduleProgresses = modules.map((module) => {
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
        const remoteCount = resolved
          ? (questionCounts[resolved.uuid] ?? 0)
          : 0;
        const staticCount = questions.filter(
          (q) => (q.topic as string) === tid
        ).length;

        return calcTopicProgress(tid, answeredMap, remoteCount, staticCount);
      });

      return calcModuleProgress(module.id, topicProgresses);
    });

    const progressTrackId = MODULE_TO_PROGRESS_TRACK_ID[trackId];
    return calcTrackProgress(progressTrackId, moduleProgresses);
    // `getModulesByTrack` and `questions` are stable; omitted from deps.
  }, [trackId, answeredQuestions, questionCounts]);
}

/**
 * Returns the first incomplete topic in the track — the recommended place to
 * resume learning.
 *
 * Delegates entirely to {@link calcResumeTarget} applied to the result of
 * {@link useTrackProgress}. Returns `null` when the track is 100 % complete.
 *
 * **Dead code until Phase 2 Step 6.**
 *
 * @param trackId - Same identifier accepted by {@link useTrackProgress}.
 */
export function useResumeTarget(trackId: ModuleTrackId): ResumeTarget | null {
  const trackProgress = useTrackProgress(trackId);
  return useMemo(
    () => calcResumeTarget(trackProgress),
    [trackProgress]
  );
}
