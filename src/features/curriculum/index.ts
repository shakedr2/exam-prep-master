/**
 * Curriculum feature — public API
 *
 * This barrel file re-exports all curriculum types.
 * No runtime logic lives here yet; this is the scaffold for future
 * hooks, services, and components in this feature slice.
 */
export type {
  Track,
  Phase,
  Module,
  Lesson,
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
