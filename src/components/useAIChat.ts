import { useState, useEffect, useCallback, useRef } from "react";
import type { Question } from "@/data/questions";
import { callAIFunctionStream, getHumanReadableError } from "@/shared/lib/aiClient";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildQuestionContext(q: Question): string {
  if (q.type === "quiz") {
    return `שאלה (בחירה מרובה): ${q.question}\n\nאפשרויות:\n${q.options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}`;
  }
  if (q.type === "tracing") {
    return `שאלה (מעקב ביצוע): ${q.question}\n\nקוד:\n${q.code}`;
  }
  if (q.type === "coding") {
    return `שאלה (כתיבת קוד): ${q.title}\n\n${q.description}`;
  }
  return `שאלה (השלמה): ${q.title}\n\n${q.description}\n\nקוד:\n${q.code}`;
}

export function useAIChat(question: Question) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Keep a ref in sync so callbacks always see the latest messages without
  // causing unnecessary re-renders or stale-closure bugs.
  const messagesRef = useRef<ChatMessage[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setStreaming(false);
  }, [question.id]);

  const sendMessage = useCallback(async (userText: string) => {
    if (streaming || !userText.trim()) return;

    const newMessages: ChatMessage[] = [
      ...messagesRef.current,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    messagesRef.current = newMessages;
    setError(null);
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await callAIFunctionStream(
        `${supabaseUrl}/functions/v1/ai-tutor`,
        {
          messages: newMessages,
          questionContext: buildQuestionContext(question),
        },
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`,
          apikey: supabaseKey,
        },
        controller.signal,
      );

      if (!response.body) throw new Error("אין גוף תגובה מהשרת");

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
            // skip malformed SSE lines
          }
        }
      }
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(getHumanReadableError(e));
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setStreaming(false);
    }
  }, [question, streaming]);

  /** Re-sends the last user message. Useful for the retry button on error. */
  const retry = useCallback(() => {
    if (streaming) return;
    const current = messagesRef.current;
    const lastUserIdx = current.findLastIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const lastUserText = current[lastUserIdx].content;
    const trimmed = current.slice(0, lastUserIdx);
    messagesRef.current = trimmed;
    setMessages(trimmed);
    setError(null);
    sendMessage(lastUserText);
  }, [streaming, sendMessage]);

  return { messages, streaming, error, sendMessage, retry };
}
