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
  lastPosition: Record<string, number>;
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
  lastPosition: {},
};

const STORAGE_KEY = "examprep_progress";
export const XP_PER_CORRECT = 10;
export const XP_PER_LEVEL = 100;

function loadProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
  } catch {
    // ignore storage errors
  }
  return { ...DEFAULT_PROGRESS };
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function useLocalProgress() {
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

  const saveTopicPosition = useCallback((topicId: string, index: number) => {
    setProgress(p => ({
      ...p,
      lastPosition: { ...p.lastPosition, [topicId]: index },
    }));
  }, []);

  const getTopicPosition = useCallback(
    (topicId: string): number => {
      return progress.lastPosition?.[topicId] ?? 0;
    },
    [progress.lastPosition]
  );

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

  const getIncorrectQuestions = useCallback(() => {
    const incorrectIds = Object.entries(progress.answeredQuestions)
      .filter(([, v]) => !v.correct)
      .map(([id]) => id);
    return questions.filter(q => incorrectIds.includes(q.id));
  }, [progress.answeredQuestions]);

  const getIncorrectByTopic = useCallback((topicId: string) => {
    return getIncorrectQuestions().filter(q => q.topic === topicId);
  }, [getIncorrectQuestions]);

  const getWeakTopics = useCallback((limit = 3) => {
    const topicStats: Record<string, { correct: number; attempted: number }> = {};
    Object.entries(progress.answeredQuestions).forEach(([id, answer]) => {
      const question = questions.find(q => q.id === id);
      if (!question) return;
      const { topic } = question;
      if (!topicStats[topic]) topicStats[topic] = { correct: 0, attempted: 0 };
      topicStats[topic].attempted += 1;
      if (answer.correct) topicStats[topic].correct += 1;
    });
    return Object.entries(topicStats)
      .filter(([, stats]) => stats.attempted > 0)
      .map(([topicId, stats]) => ({
        topicId,
        successRate: stats.correct / stats.attempted,
      }))
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, limit);
  }, [progress.answeredQuestions]);

  const getAttempts = useCallback((questionId: string) => {
    return progress.answeredQuestions[questionId]?.attempts ?? 0;
  }, [progress.answeredQuestions]);

  const totalCorrect = Object.values(progress.answeredQuestions).filter(a => a.correct).length;
  const totalAnswered = Object.keys(progress.answeredQuestions).length;

  return {
    progress,
    setUsername,
    answerQuestion,
    addExamResult,
    getIncorrectQuestions,
    getIncorrectByTopic,
    getWeakTopics,
    getAttempts,
    saveTopicPosition,
    getTopicPosition,
    totalCorrect,
    totalAnswered,
  };
}
