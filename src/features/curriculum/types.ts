/**
 * Multi-topic tutor system — shared types.
 *
 * A Topic represents a full expert-tutor domain (Python, Linux, Git, etc.).
 * Each topic has:
 *   - A branded persona (the "Prof. X" tutor) with a system prompt.
 *   - A progressive curriculum of Modules → Lessons.
 *   - Its own route page in the app.
 *
 * These types describe the *in-app* curriculum used by the tutor UI and sidebar.
 * They are intentionally lighter-weight than the full `src/types/curriculum.ts`
 * domain model (which is persisted in Supabase and covers tracks, phases,
 * practice sessions, quizzes, and attempts). Both layers are kept in sync via
 * the `topicId` key.
 */
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

/** Learning track that a topic belongs to. */
export type TrackId = "python" | "devops";

/** Difficulty tier of a lesson. */
export type LessonLevel = "beginner" | "intermediate" | "advanced";

/** Canonical topic identifiers. Keep in sync with `TopicRegistry`. */
export type TopicId =
  | "python"
  | "linux"
  | "git"
  | "networking"
  | "docker"
  | "cicd"
  | "cloud"
  | "iac";

/** A single teaching unit inside a module. */
export interface Lesson {
  id: string;
  title: string;
  /** Short Hebrew+English description rendered in the sidebar. */
  description: string;
  level: LessonLevel;
  /** Learning objectives the student should master after this lesson. */
  objectives: string[];
  /** Key vocabulary / commands / symbols introduced by this lesson. */
  keyTerms: string[];
  /** Suggested number of practice questions the tutor should generate. */
  practiceQuestions: number;
}

/** A coherent group of lessons (e.g. "Functions", "Containers"). */
export interface Module {
  id: string;
  title: string;
  description: string;
  /** Emoji or short string used as a compact visual marker. */
  emoji?: string;
  lessons: Lesson[];
}

/** Static tutor persona + pedagogical configuration. */
export interface TutorConfig {
  /** Displayed name, e.g. "פרופ׳ פייתון / Prof. Python". */
  name: string;
  /** Short headline e.g. "Python Fundamentals Expert". */
  title: string;
  /** System prompt fed to the LLM. Bilingual, pedagogical. */
  systemPrompt: string;
  /** Suggested opening message the tutor says when the chat is empty. */
  greeting: string;
  /** Quick-start prompt chips to bootstrap a student conversation. */
  starterPrompts: string[];
}

/**
 * Top-level descriptor for a single topic/tutor.
 * Everything the UI needs to render a branded tutor page is here.
 */
export interface Topic {
  id: TopicId;
  /** Short route segment, e.g. "python". */
  slug: string;
  /** Display name in Hebrew + English, e.g. "Python / פייתון". */
  name: string;
  /** One-sentence elevator pitch for the curriculum. */
  description: string;
  /** Track this topic belongs to. */
  track: TrackId;
  /** Lucide icon used across the app for this topic. */
  icon: LucideIcon;
  /** Tailwind gradient classes for the topic's hero/accent. */
  accent: {
    gradient: string;
    text: string;
    ring: string;
  };
  /** Full curriculum tree. */
  modules: Module[];
  /** Tutor persona configuration. */
  tutor: TutorConfig;
}

/** Progress record persisted in Supabase `topic_progress`. */
export interface TopicProgress {
  userId: string;
  topicId: TopicId;
  moduleId: string;
  lessonId: string;
  completedAt: string;
}

/** Lookup table — see `curriculum/index.ts`. */
export type TopicRegistry = Record<TopicId, Topic>;

/** Props accepted by every topic page. */
export interface TopicPageProps {
  topic: Topic;
}

/** Component shape for topic pages (kept for exhaustive registry typing). */
export type TopicPageComponent = ComponentType<TopicPageProps>;
