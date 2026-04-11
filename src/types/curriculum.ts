/**
 * Curriculum Domain Model
 *
 * Hierarchy: Track > Phase > Module > Lesson > Practice > Quiz
 *
 * Each content entity carries a `contentId` (stable, locale-agnostic) plus
 * human-readable fields that are sourced from a translations layer.
 * This enables multilingual content without changing the structural model.
 */

// ---------------------------------------------------------------------------
// Locale / i18n support
// ---------------------------------------------------------------------------

export type Locale = "he" | "en";

export interface ContentTranslation {
  contentId: string;
  locale: Locale;
  fields: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Track
// ---------------------------------------------------------------------------

/**
 * A Track is the top-level learning path, e.g. "DevOps Engineer".
 * A learner enrols in a Track and progresses through its Phases.
 */
export interface Track {
  id: string;
  /** Stable machine-readable key, e.g. "devops-engineer" */
  slug: string;
  /** Stable content identifier for translation look-ups */
  contentId: string;
  name: string;
  description: string;
  /** Default locale for this track's content */
  defaultLocale: Locale;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Phase
// ---------------------------------------------------------------------------

/**
 * A Phase groups related Modules inside a Track, e.g. "Python Fundamentals".
 * Phases are ordered; learners are expected to complete them sequentially.
 */
export interface Phase {
  id: string;
  trackId: string;
  /** Display order within the parent Track (1-based) */
  order: number;
  slug: string;
  contentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Module
// ---------------------------------------------------------------------------

/**
 * A Module is a self-contained learning unit inside a Phase,
 * e.g. "Variables & IO", "File Permissions".
 * It maps 1-to-many to the existing `topics` table during the transition period.
 */
export interface Module {
  id: string;
  phaseId: string;
  /** Display order within the parent Phase (1-based) */
  order: number;
  slug: string;
  contentId: string;
  name: string;
  description: string;
  icon?: string;
  /** Legacy topic IDs from the existing `topics` table (transition mapping) */
  topicIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Lesson
// ---------------------------------------------------------------------------

/**
 * A Lesson is the teaching-content unit inside a Module.
 * It contains structured explanation, examples, and code snippets.
 */
export interface Lesson {
  id: string;
  moduleId: string;
  /** Display order within the parent Module (1-based) */
  order: number;
  contentId: string;
  title: string;
  /** Rich text body. Use Markdown format (GitHub-flavoured). */
  body: string;
  codeExamples?: CodeExample[];
  createdAt: string;
  updatedAt: string;
}

export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
  language?: string;
}

// ---------------------------------------------------------------------------
// Concept
// ---------------------------------------------------------------------------

/**
 * A Concept is a discrete knowledge item within a Module,
 * e.g. "for loop syntax", "list indexing".
 * Concepts are the granular building blocks that Questions test.
 */
export interface Concept {
  id: string;
  moduleId: string;
  contentId: string;
  name: string;
  description: string;
  /** Optional reference to the lesson where this concept is taught */
  lessonId?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Practice
// ---------------------------------------------------------------------------

/**
 * A Practice is an ungraded exercise session for a Module.
 * It references a set of question IDs from the existing `questions` table.
 */
export interface Practice {
  id: string;
  moduleId: string;
  contentId: string;
  title: string;
  description: string;
  /** Ordered list of question IDs (references existing `questions` table) */
  questionIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

/**
 * A Quiz is a graded assessment for a Module.
 * It has a passing score threshold and a fixed set of question IDs.
 */
export interface Quiz {
  id: string;
  moduleId: string;
  contentId: string;
  title: string;
  description: string;
  /** Ordered list of question IDs (references existing `questions` table) */
  questionIds: string[];
  /** Minimum percentage (0-100) required to pass, e.g. 70 */
  passingScore: number;
  /** Time limit in minutes; null means no limit */
  timeLimitMinutes: number | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// QuestionAttempt
// ---------------------------------------------------------------------------

/**
 * Records a single learner's answer to a question inside a Practice or Quiz.
 * Extends the existing `user_progress` concept with curriculum context.
 */
export interface QuestionAttempt {
  id: string;
  userId: string;
  questionId: string;
  /** Curriculum context — which module the attempt belongs to */
  moduleId: string;
  /** 'practice' or 'quiz' */
  sessionType: "practice" | "quiz";
  /** ID of the Practice or Quiz session */
  sessionId: string;
  isCorrect: boolean;
  /** The exact answer submitted by the learner */
  submittedAnswer: string;
  answeredAt: string;
}

// ---------------------------------------------------------------------------
// Enrolment & Progress
// ---------------------------------------------------------------------------

export interface TrackEnrolment {
  id: string;
  userId: string;
  trackId: string;
  enrolledAt: string;
  /** ISO 8601 timestamp of last activity */
  lastActiveAt: string;
}

export interface ModuleProgress {
  id: string;
  userId: string;
  moduleId: string;
  /** Whether the learner has completed the module's Lesson */
  lessonCompleted: boolean;
  /** Whether the learner has passed the module's Quiz */
  quizPassed: boolean;
  /** Best quiz score (0-100), null if not attempted */
  bestQuizScore: number | null;
  updatedAt: string;
}
