import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { callAIFunctionStream, getAiErrorKey } from "@/shared/lib/aiClient";
import type { TopicId, Topic } from "../types";

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
}

interface UseTutorChatArgs {
  topic: Topic;
  /** Currently-focused lesson id. Sent to the LLM as context so it can
   *  generate lesson-appropriate questions. */
  activeLessonId?: string;
}

/**
 * Hook powering a topic-specific tutor chat.
 *
 * Wraps the shared `ai-tutor` Supabase Edge Function but sends:
 *   - the topic's bilingual system prompt
 *   - a `topicId` so server-side logging / billing can differentiate tutors
 *   - the student's active lesson context so questions match their progress
 *
 * Each hook instance owns its own message history and reset lifecycle
 * (e.g. reset when the topic changes).
 */
export function useTutorChat({ topic, activeLessonId }: UseTutorChatArgs) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<TutorMessage[]>([]);
  const streamingRef = useRef(false);
  const tRef = useRef(t);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    streamingRef.current = streaming;
  }, [streaming]);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  // Reset chat when the tutor (topic) changes.
  useEffect(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setStreaming(false);
  }, [topic.id]);

  const sendMessage = useCallback(
    async (userText: string) => {
      if (streamingRef.current || !userText.trim()) return;

      const next: TutorMessage[] = [
        ...messagesRef.current,
        { role: "user", content: userText },
      ];
      setMessages(next);
      messagesRef.current = next;
      setError(null);
      setStreaming(true);
      streamingRef.current = true;
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        const activeLesson = topic.modules
          .flatMap((m) => m.lessons.map((l) => ({ m, l })))
          .find(({ l }) => l.id === activeLessonId);

        const contextBlock = activeLesson
          ? `Active module: ${activeLesson.m.title}\nActive lesson: ${activeLesson.l.title} (${activeLesson.l.level})\nObjectives: ${activeLesson.l.objectives.join("; ")}\nKey terms: ${activeLesson.l.keyTerms.join(", ")}`
          : `No specific lesson selected. Offer the student a starting point from the ${topic.name} curriculum.`;

        const response = await callAIFunctionStream(
          `${supabaseUrl}/functions/v1/ai-tutor`,
          {
            messages: next,
            topicId: topic.id satisfies TopicId,
            topicName: topic.name,
            systemPrompt: topic.tutor.systemPrompt,
            questionContext: contextBlock,
          },
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
            apikey: supabaseKey,
          },
          controller.signal,
        );

        if (!response.body) throw new Error("Missing response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantText += delta;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                  };
                  return updated;
                });
              }
            } catch {
              // ignore malformed SSE lines
            }
          }
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setError(tRef.current(getAiErrorKey(e)));
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setStreaming(false);
        streamingRef.current = false;
      }
    },
    [topic, activeLessonId],
  );

  const retry = useCallback(() => {
    if (streamingRef.current) return;
    const current = messagesRef.current;
    let lastUserIdx = -1;
    for (let i = current.length - 1; i >= 0; i--) {
      if (current[i].role === "user") {
        lastUserIdx = i;
        break;
      }
    }
    if (lastUserIdx === -1) return;
    const lastUserText = current[lastUserIdx].content;
    const trimmed = current.slice(0, lastUserIdx);
    messagesRef.current = trimmed;
    setMessages(trimmed);
    setError(null);
    sendMessage(lastUserText);
  }, [sendMessage]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setStreaming(false);
  }, []);

  return { messages, streaming, error, sendMessage, retry, reset };
}
