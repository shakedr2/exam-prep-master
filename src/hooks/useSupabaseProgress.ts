import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { getAnonUserId } from "@/lib/anonUserId";

export interface TopicStats {
  topicId: string;
  topicName: string;
  topicIcon: string;
  totalQuestions: number;
  answered: number;
  correct: number;
  accuracy: number;
}

export interface SupabaseProgress {
  totalAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  topicStats: TopicStats[];
  loading: boolean;
  refetch: () => void;
}

export function useSupabaseProgress(): SupabaseProgress {
  const { user } = useAuth();
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [topicStats, setTopicStats] = useState<TopicStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    const effectiveUserId = user?.id ?? getAnonUserId();

    const [progressResult, topicsResult, questionCountResult] = await Promise.all([
      supabase
        .from("user_progress")
        .select("question_id, topic_id, is_correct")
        .eq("user_id", effectiveUserId),
      supabase.from("topics").select("id, name, icon"),
      supabase.from("questions").select("topic_id"),
    ]);

    if (progressResult.error || topicsResult.error || questionCountResult.error) {
      console.error("Failed to fetch progress");
      setLoading(false);
      return;
    }

    const progressData = progressResult.data ?? [];
    const topicsData = topicsResult.data ?? [];
    const questionsData = questionCountResult.data ?? [];

    setTotalAnswered(progressData.length);
    const correctCount = progressData.filter((p) => p.is_correct).length;
    setTotalCorrect(correctCount);

    const questionCountByTopic: Record<string, number> = {};
    questionsData.forEach((q) => {
      questionCountByTopic[q.topic_id] = (questionCountByTopic[q.topic_id] || 0) + 1;
    });

    const progressByTopic: Record<string, { answered: number; correct: number }> = {};
    progressData.forEach((p) => {
      if (!progressByTopic[p.topic_id]) {
        progressByTopic[p.topic_id] = { answered: 0, correct: 0 };
      }
      progressByTopic[p.topic_id].answered += 1;
      if (p.is_correct) progressByTopic[p.topic_id].correct += 1;
    });

    const stats: TopicStats[] = topicsData.map((topic) => {
      const topicProgress = progressByTopic[topic.id] ?? { answered: 0, correct: 0 };
      const total = questionCountByTopic[topic.id] ?? 0;
      return {
        topicId: topic.id,
        topicName: topic.name,
        topicIcon: topic.icon ?? "📖",
        totalQuestions: total,
        answered: topicProgress.answered,
        correct: topicProgress.correct,
        accuracy: topicProgress.answered > 0
          ? Math.round((topicProgress.correct / topicProgress.answered) * 100)
          : 0,
      };
    });

    setTopicStats(stats);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return {
    totalAnswered,
    totalCorrect,
    overallAccuracy,
    topicStats,
    loading,
    refetch: fetchProgress,
  };
}
