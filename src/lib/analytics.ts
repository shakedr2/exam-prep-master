/**
 * Centralized analytics helper for key product events.
 *
 * Why a dedicated module?
 *   • A single source of truth for event names avoids typo-driven event drift
 *     (e.g. "exam_start" vs "start_exam") which fractures PostHog funnels.
 *   • Typed payloads document what data each event is expected to carry.
 *   • Each `track*` helper is safe to call before PostHog has initialised
 *     (posthog-js no-ops internally when `init` hasn't run).
 *
 * Conventions:
 *   • Event names are snake_case, verb-first where possible.
 *   • Existing events (`quiz_start`, `quiz_completion`, `exam_start`,
 *     `exam_completion`) are preserved for dashboard continuity.
 *   • New events added here are additive — they do not replace existing
 *     per-page captures, they complement them.
 */
import { posthog } from "@/lib/posthog";

export const AnalyticsEvents = {
  DASHBOARD_VIEWED: "dashboard_viewed",
  EXAM_STARTED: "exam_start",
  EXAM_COMPLETED: "exam_completion",
  QUESTION_COMPLETED: "question_completed",
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export interface DashboardViewedProps {
  total_answered: number;
  total_correct: number;
}

export interface ExamStartedProps {
  question_count: number;
}

export interface QuestionCompletedProps {
  question_id: string;
  topic_id: string;
  question_type?: string;
  difficulty?: string;
  correct: boolean;
  // Which flow produced the answer ("practice" | "exam" | "review_mistakes")
  source: "practice" | "exam" | "review_mistakes";
}

function capture(event: AnalyticsEvent, props: object) {
  try {
    posthog.capture(event, { ...props });
  } catch {
    // Swallow analytics errors — monitoring must never break the UX.
  }
}

export function trackDashboardViewed(props: DashboardViewedProps) {
  capture(AnalyticsEvents.DASHBOARD_VIEWED, props);
}

export function trackExamStarted(props: ExamStartedProps) {
  capture(AnalyticsEvents.EXAM_STARTED, props);
}

export function trackQuestionCompleted(props: QuestionCompletedProps) {
  capture(AnalyticsEvents.QUESTION_COMPLETED, props);
}
