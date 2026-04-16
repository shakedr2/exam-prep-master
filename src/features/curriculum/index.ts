/**
 * Curriculum feature — public API.
 *
 * This barrel exports two layers:
 *   - The persistence-layer domain model from `src/types/curriculum.ts`
 *     (track → phase → module → lesson → practice → quiz). These names
 *     are re-exported with a `Persisted*` prefix where they'd otherwise
 *     collide with the in-app tutor types below.
 *   - The in-app multi-topic tutor system: `Topic`, `Module`, `Lesson`,
 *     `TutorConfig`, plus the `topicRegistry` and shared components.
 *
 * Keep the two layers aligned by using the same `topicId` key.
 */

// Persistence-layer domain types
export type {
  Track,
  Phase,
  Module as PersistedModule,
  Lesson as PersistedLesson,
  CodeExample,
  Concept,
  Practice,
  Quiz,
  QuestionAttempt,
  TrackEnrolment,
  ModuleProgress,
  ContentTranslation,
  Locale,
} from "@/types/curriculum";

// In-app tutor system types
export type {
  Topic,
  TopicId,
  TopicRegistry,
  TopicProgress,
  TopicPageProps,
  TopicPageComponent,
  Module,
  Lesson,
  LessonLevel,
  TrackId,
  TutorConfig,
} from "./types";

import type { Topic, TopicId, TopicRegistry } from "./types";
import { pythonTopic } from "./topics/python";
import { linuxTopic } from "./topics/linux";
import { gitTopic } from "./topics/git";
import { networkingTopic } from "./topics/networking";
import { dockerTopic } from "./topics/docker";
import { cicdTopic } from "./topics/cicd";
import { cloudTopic } from "./topics/cloud";
import { iacTopic } from "./topics/iac";

export {
  pythonTopic,
  linuxTopic,
  gitTopic,
  networkingTopic,
  dockerTopic,
  cicdTopic,
  cloudTopic,
  iacTopic,
};

/**
 * Canonical registry of every supported tutor topic.
 * Use this for routing, navigation, and admin tooling.
 */
export const topicRegistry: TopicRegistry = {
  python: pythonTopic,
  linux: linuxTopic,
  git: gitTopic,
  networking: networkingTopic,
  docker: dockerTopic,
  cicd: cicdTopic,
  cloud: cloudTopic,
  iac: iacTopic,
};

/** Ordered list of all topics, in curriculum order. */
export const allTopics: Topic[] = [
  pythonTopic,
  linuxTopic,
  gitTopic,
  networkingTopic,
  dockerTopic,
  cicdTopic,
  cloudTopic,
  iacTopic,
];

/** Resolve a topic by id with a narrow type. */
export function getTopic(id: TopicId): Topic {
  const topic = topicRegistry[id];
  if (!topic) {
    throw new Error(`Unknown topic id: ${id}`);
  }
  return topic;
}

// Shared components — re-exported so pages don't need deep import paths.
export { TutorChat } from "./components/TutorChat";
export { CurriculumSidebar } from "./components/CurriculumSidebar";
export { TopicTutorLayout } from "./components/TopicTutorLayout";

// Hooks
export { useTutorChat } from "./hooks/useTutorChat";
export type { TutorMessage } from "./hooks/useTutorChat";
export { useTopicProgress } from "./hooks/useTopicProgress";
