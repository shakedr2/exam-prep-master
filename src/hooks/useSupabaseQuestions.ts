import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Question } from "@/data/questions";

export type DbQuestion = Tables<"questions">;

const LETTER_INDEX: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };

function letterToIndex(value: string | null | undefined): number | null {
  if (!value) return null;
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length === 1 && trimmed in LETTER_INDEX) {
    return LETTER_INDEX[trimmed];
  }
  return null;
}

function letterToOption(
  letter: string | null | undefined,
  row: Pick<DbQuestion, "option_a" | "option_b" | "option_c" | "option_d">
): string | null {
  const idx = letterToIndex(letter);
  if (idx === null) return null;
  const values = [row.option_a, row.option_b, row.option_c, row.option_d];
  const value = values[idx];
  return typeof value === "string" ? value : null;
}

function mapDbQuestion(row: DbQuestion): Question {
  const base = {
    id: row.id,
    topic: row.topic_id as Question["topic"],
    difficulty: (row.difficulty ?? "medium") as Question["difficulty"],
    explanation: row.explanation ?? "",
    patternFamily: row.pattern_family ?? undefined,
    commonMistake: row.common_mistake ?? undefined,
  };

  if (row.question_type === "multiple_choice") {
    const options = [row.option_a, row.option_b, row.option_c, row.option_d].filter(
      (o): o is string => typeof o === "string" && o.length > 0
    );
    // correct_answer is stored as a single letter ('a'..'d'). Legacy rows
    // may store the literal option text — fall back to indexOf for those.
    const letterIdx = letterToIndex(row.correct_answer);
    const correctIndex =
      letterIdx !== null && letterIdx < options.length
        ? letterIdx
        : Math.max(0, options.indexOf(row.correct_answer ?? ""));
    return {
      ...base,
      type: "quiz" as const,
      question: row.text,
      code: row.code_snippet ?? undefined,
      options,
      correctIndex,
    };
  }

  if (row.question_type === "tracing") {
    // Prefer expected_output; otherwise resolve the letter stored in
    // correct_answer ('a' → option_a's text); otherwise use correct_answer as-is.
    const resolvedAnswer =
      row.expected_output ||
      letterToOption(row.correct_answer, row) ||
      row.correct_answer ||
      "";
    return {
      ...base,
      type: "tracing" as const,
      question: row.text,
      code: row.code_snippet ?? "",
      correctAnswer: resolvedAnswer,
    };
  }

  if (row.question_type === "fill_blank") {
    // Fill-blank rows in the new batches fold the code into `text` and keep
    // the real answer in option_a with correct_answer='a'. Split the text
    // into a description line + code block so FillBlankView can render the
    // ___ placeholders.
    let title = row.text;
    let code = row.code_snippet ?? "";
    if (!code && row.text.includes("___")) {
      const nl = row.text.indexOf("\n");
      if (nl > 0) {
        title = row.text.slice(0, nl).trim();
        code = row.text.slice(nl + 1);
      } else {
        code = row.text;
      }
    }

    // Resolve the actual blank answers. Prefer the letter mapping (batch2
    // style); fall back to a comma-separated correct_answer (legacy style).
    const blanks: { answer: string; hint: string }[] = [];
    const letterAnswer = letterToOption(row.correct_answer, row);
    if (letterAnswer !== null) {
      blanks.push({ answer: letterAnswer, hint: "" });
    } else if (row.correct_answer) {
      row.correct_answer.split(",").forEach((ans) => {
        blanks.push({ answer: ans.trim(), hint: "" });
      });
    }

    return {
      ...base,
      type: "fill-blank" as const,
      title,
      description: "",
      code,
      blanks,
      solutionExplanation: row.explanation ?? "",
    };
  }

  // Fallback: treat as quiz
  const options = [row.option_a, row.option_b, row.option_c, row.option_d].filter(
    (o): o is string => typeof o === "string" && o.length > 0
  );
  const letterIdx = letterToIndex(row.correct_answer);
  return {
    ...base,
    type: "quiz" as const,
    question: row.text,
    code: row.code_snippet ?? undefined,
    options,
    correctIndex:
      letterIdx !== null && letterIdx < options.length ? letterIdx : 0,
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
