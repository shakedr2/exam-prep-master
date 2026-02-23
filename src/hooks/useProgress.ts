import { useState, useEffect, useCallback } from "react";
import { questions } from "@/data/questions";

export interface UserProgress {
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  answeredQuestions: Record<string, { correct: boolean; attempts: number }>;
  topicProgress: Record<string, { completed: number; total: number }>;
  examHistory: Array<{ date: string; score: number; total: number }>;
  badges: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  username: "",
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: "",
  answeredQuestions: {},
  topicProgress: {},
  examHistory: [],
  badges: [],
};

const STORAGE_KEY = "examprep_progress";
const XP_PER_CORRECT = 10;
const XP_PER_LEVEL = 100;

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
  } catch {}
  return { ...DEFAULT_PROGRESS };
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const setUsername = useCallback((name: string) => {
    setProgress(p => ({ ...p, username: name }));
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    setProgress(p => {
      if (p.lastActiveDate === today) return p;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = p.lastActiveDate === yesterday.toDateString();
      return {
        ...p,
        streak: isConsecutive ? p.streak + 1 : 1,
        lastActiveDate: today,
      };
    });
  }, []);

  const answerQuestion = useCallback((questionId: string, correct: boolean) => {
    setProgress(p => {
      const prev = p.answeredQuestions[questionId];
      const xpGain = correct && !prev?.correct ? XP_PER_CORRECT : 0;
      const newXp = p.xp + xpGain;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

      const newBadges = [...p.badges];
      const correctCount = Object.values(p.answeredQuestions).filter(a => a.correct).length + (correct ? 1 : 0);
      if (correctCount >= 10 && !newBadges.includes("first_10")) newBadges.push("first_10");
      if (correctCount >= 25 && !newBadges.includes("quarter_century")) newBadges.push("quarter_century");

      return {
        ...p,
        xp: newXp,
        level: newLevel,
        answeredQuestions: {
          ...p.answeredQuestions,
          [questionId]: {
            correct: prev?.correct || correct,
            attempts: (prev?.attempts || 0) + 1,
          },
        },
        badges: newBadges,
      };
    });
    updateStreak();
  }, [updateStreak]);

  const addExamResult = useCallback((score: number, total: number) => {
    setProgress(p => {
      const newBadges = [...p.badges];
      if (score === total && !newBadges.includes("perfect_exam")) newBadges.push("perfect_exam");
      return {
        ...p,
        examHistory: [...p.examHistory, { date: new Date().toISOString(), score, total }],
        badges: newBadges,
      };
    });
  }, []);

  const getTopicCompletion = useCallback((topicId: string, totalQuestions: number) => {
    const topicQuestionIds = new Set(
      questions.filter(q => q.topic === topicId).map(q => q.id)
    );
    const answered = Object.entries(progress.answeredQuestions)
      .filter(([id]) => topicQuestionIds.has(id))
      .filter(([_, v]) => v.correct).length;
    return Math.round((answered / Math.max(totalQuestions, 1)) * 100);
  }, [progress.answeredQuestions]);

  const totalCorrect = Object.values(progress.answeredQuestions).filter(a => a.correct).length;
  const totalAnswered = Object.keys(progress.answeredQuestions).length;

  return {
    progress,
    setUsername,
    answerQuestion,
    addExamResult,
    getTopicCompletion,
    totalCorrect,
    totalAnswered,
  };
}
