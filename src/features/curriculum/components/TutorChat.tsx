import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { Send, Sparkles, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Topic } from "../types";
import { useTutorChat } from "../hooks/useTutorChat";

interface TutorChatProps {
  topic: Topic;
  /** Currently-selected lesson, used to bias question generation. */
  activeLessonId?: string;
  /** Optional className for embedding inside a layout. */
  className?: string;
}

/**
 * Shared, branded tutor chat UI.
 *
 * Design:
 *   - Branded header with the topic's icon + gradient.
 *   - Greeting + starter prompt chips when the chat is empty.
 *   - Assistant messages support fenced code blocks and **bold**.
 *   - Retry button on error.
 *   - Reset button in the header to start fresh without reloading.
 *
 * The message bubble alignment is direction-agnostic — we use
 * `self-start` for the assistant and `self-end` for the user so it
 * renders correctly under both RTL (Hebrew) and LTR (English).
 */
export function TutorChat({ topic, activeLessonId, className }: TutorChatProps) {
  const { t } = useTranslation();
  const { messages, streaming, error, sendMessage, retry, reset } = useTutorChat({
    topic,
    activeLessonId,
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const TopicIcon = topic.icon;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-2xl border bg-card overflow-hidden",
        className,
      )}
    >
      {/* Branded header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r text-white",
          topic.accent.gradient,
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
            <TopicIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-semibold truncate">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{topic.tutor.name}</span>
            </div>
            <div className="text-[11px] opacity-80 truncate">
              {topic.tutor.title}
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-white/90 hover:bg-white/20 hover:text-white"
            onClick={reset}
            aria-label="Reset conversation"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Message stream */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <EmptyState topic={topic} onStarter={(s) => sendMessage(s)} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <AssistantContent text={msg.content} />
                  ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  )}
                  {msg.role === "assistant" &&
                    streaming &&
                    i === messages.length - 1 && (
                      <span
                        className="inline-block w-1.5 h-4 bg-current animate-pulse mr-0.5 align-middle"
                        aria-label="typing"
                      />
                    )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive space-y-2">
            <p>{error}</p>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
              onClick={retry}
              disabled={streaming}
            >
              {t("common.retry")}
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div className="shrink-0 border-t px-4 py-3 flex gap-2 items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${topic.tutor.name}…`}
          aria-label={`Ask ${topic.tutor.name}`}
          className="resize-none text-sm min-h-[40px] max-h-[140px]"
          rows={1}
          disabled={streaming}
        />
        <Button
          size="icon"
          className={cn(
            "shrink-0 h-10 w-10 bg-gradient-to-br",
            topic.accent.gradient,
          )}
          disabled={!input.trim() || streaming}
          onClick={handleSend}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function EmptyState({
  topic,
  onStarter,
}: {
  topic: Topic;
  onStarter: (text: string) => void;
}) {
  const TopicIcon = topic.icon;
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-2">
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow",
          topic.accent.gradient,
        )}
      >
        <TopicIcon className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{topic.tutor.name}</h3>
        <p className="text-xs text-muted-foreground">{topic.tutor.title}</p>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-line max-w-md">
        {topic.tutor.greeting}
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {topic.tutor.starterPrompts.slice(0, 6).map((prompt) => (
          <Button
            key={prompt}
            size="sm"
            variant="outline"
            className="text-xs h-7"
            onClick={() => onStarter(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
}

function formatBold(line: string) {
  const parts = line.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

function AssistantContent({ text }: { text: string }) {
  const segments = text.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {segments.map((segment, i) => {
        if (segment.startsWith("```")) {
          const match = segment.match(/```(\w*)\n?([\s\S]*?)```/);
          const code = match?.[2]?.trim() ?? segment;
          return (
            <pre
              key={i}
              dir="ltr"
              className="rounded-lg bg-secondary p-3 text-sm font-mono overflow-x-auto border border-border my-2"
            >
              <code>{code}</code>
            </pre>
          );
        }
        return (
          <div key={i} className="whitespace-pre-wrap">
            {segment.split("\n").map((line, j) => (
              <p key={j} className="mb-1 last:mb-0">
                {formatBold(line)}
              </p>
            ))}
          </div>
        );
      })}
    </>
  );
}
