import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Question } from "@/data/questions";

export type DbQuestion = Tables<"questions">;

function mapDbQuestion(row: DbQuestion): Question {
  const base = {
    id: row.id,
    topic: row.topic_id as Question["topic"],
    difficulty: (row.difficulty ?? "medium") as Question["difficulty"],
    explanation: row.explanation ?? "",
  };

  if (row.question_type === "multiple_choice") {
    const options = [row.option_a, row.option_b, row.option_c, row.option_d].filter(
      (o): o is string => o != null
    );
    const correctIndex = options.indexOf(row.correct_answer ?? "");
    return {
      ...base,
      type: "quiz" as const,
      question: row.text,
      code: row.code_snippet ?? undefined,
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
    };
  }

  if (row.question_type === "tracing") {
    return {
      ...base,
      type: "tracing" as const,
      question: row.text,
      code: row.code_snippet ?? "",
      correctAnswer: row.expected_output ?? row.correct_answer ?? "",
    };
  }

  if (row.question_type === "fill_blank") {
    const blanks: { answer: string; hint: string }[] = [];
    if (row.correct_answer) {
      row.correct_answer.split(",").forEach((ans) => {
        blanks.push({ answer: ans.trim(), hint: "" });
      });
    }
    return {
      ...base,
      type: "fill-blank" as const,
      title: row.text,
      description: "",
      code: row.code_snippet ?? "",
      blanks,
      solutionExplanation: row.explanation ?? "",
    };
  }

  // Fallback: treat as quiz
  const options = [row.option_a, row.option_b, row.option_c, row.option_d].filter(
    (o): o is string => o != null
  );
  return {
    ...base,
    type: "quiz" as const,
    question: row.text,
    code: row.code_snippet ?? undefined,
    options,
    correctIndex: 0,
  };
}

export function useSupabaseQuestionsByTopic(topicId: string | undefined) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicId) {
      setQuestions([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("questions")
        .select("*")
        .eq("topic_id", topicId);
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setQuestions((data ?? []).map(mapDbQuestion));
      setLoading(false);
    }
    fetch();
    return () => { cancelled = true; };
  }, [topicId]);

  return { questions, loading, error };
}

export function useSupabaseExamQuestions(count: number, startExam: boolean) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!startExam) return;
    let cancelled = false;
    async function fetch() {
      setLoading(true);
      // Fetch all questions, then pick randomly on the client
      const { data, error: err } = await supabase
        .from("questions")
        .select("*");
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      const all = (data ?? []).map(mapDbQuestion);
      // Balanced selection: one per topic, then fill randomly
      const byTopic: Record<string, Question[]> = {};
      for (const q of all) {
        if (!byTopic[q.topic]) byTopic[q.topic] = [];
        byTopic[q.topic].push(q);
      }
      // Shuffle each topic's questions
      for (const key in byTopic) {
        byTopic[key].sort(() => Math.random() - 0.5);
      }
      const selected: Question[] = [];
      const usedIds = new Set<string>();
      // Phase 1: one per topic
      for (const key in byTopic) {
        if (selected.length >= count) break;
        const q = byTopic[key][0];
        if (q) {
          selected.push(q);
          usedIds.add(q.id);
        }
      }
      // Phase 2: fill remaining
      const remaining = all.filter((q) => !usedIds.has(q.id)).sort(() => Math.random() - 0.5);
      for (const q of remaining) {
        if (selected.length >= count) break;
        selected.push(q);
      }
      setQuestions(selected.sort(() => Math.random() - 0.5));
      setLoading(false);
    }
    fetch();
    return () => { cancelled = true; };
  }, [startExam, count]);

  return { questions, loading, error };
}

export function useSupabaseQuestionCount(topicId: string | undefined) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!topicId) return;
    let cancelled = false;
    async function fetch() {
      const { count: c, error } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("topic_id", topicId);
      if (cancelled) return;
      if (!error && c != null) setCount(c);
    }
    fetch();
    return () => { cancelled = true; };
  }, [topicId]);

  return count;
}
