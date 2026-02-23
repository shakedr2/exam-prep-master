import { useMemo, useRef } from "react";
import type { Question, TopicId, Difficulty } from "@/data/questions";
import type { UserProgress } from "@/hooks/useProgress";

export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

interface AdaptiveResult {
  sortedQuestions: Question[];
  proficiency: ProficiencyLevel;
  accuracy: number;
}

const DIFFICULTY_ORDER: Record<ProficiencyLevel, Difficulty[]> = {
  beginner: ["easy", "medium", "hard"],
  intermediate: ["medium", "easy", "hard"],
  advanced: ["hard", "medium", "easy"],
};

function getProficiency(accuracy: number): ProficiencyLevel {
  if (accuracy < 50) return "beginner";
  if (accuracy < 80) return "intermediate";
  return "advanced";
}

export function getTopicAccuracy(
  topicId: TopicId,
  questions: Question[],
  answeredQuestions: UserProgress["answeredQuestions"]
): number {
  const topicQIds = questions.filter(q => q.topic === topicId).map(q => q.id);
  const answered = topicQIds.filter(id => answeredQuestions[id]);
  if (answered.length === 0) return 0;
  const correct = answered.filter(id => answeredQuestions[id]?.correct).length;
  return Math.round((correct / answered.length) * 100);
}

export function useAdaptive(
  topicId: TopicId,
  allQuestions: Question[],
  answeredQuestions: UserProgress["answeredQuestions"]
): AdaptiveResult {
  // Capture initial answered state to lock question order for the session
  const initialAnsweredRef = useRef(answeredQuestions);
  const initialTopicRef = useRef(topicId);

  // Reset if topic changes
  if (initialTopicRef.current !== topicId) {
    initialAnsweredRef.current = answeredQuestions;
    initialTopicRef.current = topicId;
  }

  const sortedQuestions = useMemo(() => {
    const topicQuestions = allQuestions.filter(q => q.topic === topicId);
    const initialAnswered = initialAnsweredRef.current;
    const accuracy = getTopicAccuracy(topicId, allQuestions, initialAnswered);
    const proficiency = getProficiency(accuracy);
    const order = DIFFICULTY_ORDER[proficiency];

    const incorrect: Question[] = [];
    const unanswered: Question[] = [];
    const correct: Question[] = [];

    for (const q of topicQuestions) {
      const a = initialAnswered[q.id];
      if (a && !a.correct) incorrect.push(q);
      else if (!a) unanswered.push(q);
      else correct.push(q);
    }

    const sortByDifficulty = (arr: Question[]) =>
      [...arr].sort((a, b) => order.indexOf(a.difficulty) - order.indexOf(b.difficulty));

    return [
      ...sortByDifficulty(incorrect),
      ...sortByDifficulty(unanswered),
      ...sortByDifficulty(correct),
    ];
  }, [topicId, allQuestions]);

  // Live proficiency (updates as user answers)
  const { proficiency, accuracy } = useMemo(() => {
    const acc = getTopicAccuracy(topicId, allQuestions, answeredQuestions);
    return { proficiency: getProficiency(acc), accuracy: acc };
  }, [topicId, allQuestions, answeredQuestions]);

  return { sortedQuestions, proficiency, accuracy };
}

export const PROFICIENCY_CONFIG = {
  beginner: { label: "מתחיל", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: "🌱" },
  intermediate: { label: "בינוני", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", icon: "⚡" },
  advanced: { label: "מתקדם", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", icon: "🏆" },
} as const;
