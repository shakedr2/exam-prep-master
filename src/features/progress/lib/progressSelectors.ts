// NOTE: TrackProgress is expected for all 3 tracks: python, oop, devops.
// OOP card was confirmed present in data but missing from render in some surfaces —
// Step 3 (HomePage migration) must ensure all 3 TrackProgress objects are rendered.

import type {
  ModuleProgress,
  ResumeTarget,
  TopicProgress,
  TrackId,
  TrackProgress,
} from "./progressTypes";

export type AnsweredTopicCounts = { correct: number; attempted: number };
export type AnsweredMap = Record<string, AnsweredTopicCounts>;

function pct(num: number, den: number): number {
  if (!den || den <= 0) return 0;
  const raw = Math.round((num / den) * 100);
  return Math.min(100, Math.max(0, raw));
}

export function normalizeTopicId(
  id: string,
  slugMap: Record<string, string>
): string {
  if (id in slugMap) return slugMap[id];
  return id;
}

export function calcTopicProgress(
  topicId: string,
  answeredMap: AnsweredMap,
  remoteCount: number,
  staticCount: number
): TopicProgress {
  const entry = answeredMap[topicId] ?? { correct: 0, attempted: 0 };
  const correct = Math.max(0, entry.correct ?? 0);
  const attempted = Math.max(0, entry.attempted ?? 0);
  const remote = Math.max(0, remoteCount ?? 0);
  const stat = Math.max(0, staticCount ?? 0);
  const totalQuestions = Math.max(remote, stat);
  const completionPct = pct(correct, totalQuestions);
  return { topicId, correct, attempted, totalQuestions, completionPct };
}

export function calcModuleProgress(
  moduleId: string,
  topics: TopicProgress[]
): ModuleProgress {
  const totalQuestions = topics.reduce((s, t) => s + t.totalQuestions, 0);
  const correct = topics.reduce((s, t) => s + t.correct, 0);
  const completionPct = pct(correct, totalQuestions);
  return { moduleId, topics, totalQuestions, correct, completionPct };
}

export function calcTrackProgress(
  trackId: TrackId,
  modules: ModuleProgress[]
): TrackProgress {
  const totalQuestions = modules.reduce((s, m) => s + m.totalQuestions, 0);
  const correct = modules.reduce((s, m) => s + m.correct, 0);
  const completionPct = pct(correct, totalQuestions);
  return { trackId, modules, totalQuestions, correct, completionPct };
}

export function calcResumeTarget(track: TrackProgress): ResumeTarget | null {
  for (const mod of track.modules) {
    for (const topic of mod.topics) {
      if (topic.completionPct < 100) {
        return {
          trackId: track.trackId,
          moduleId: mod.moduleId,
          topicId: topic.topicId,
        };
      }
    }
  }
  return null;
}
