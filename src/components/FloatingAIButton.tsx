import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Sparkles, Send, Lightbulb, ChevronDown, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Question } from "@/data/questions";
import { useAIChat } from "./useAIChat";

interface FloatingAIButtonProps {
  question: Question;
  userAnswer?: string;
}

const QUICK_HINTS = [
  { label: "💡 רמז כללי", message: "תן לי רמז כללי לשאלה" },
  { label: "➕ רמז ספציפי", message: "תן לי רמז יותר ספציפי" },
  { label: "📖 הסבר מפורט", message: "הסבר לי את הפתרון בפירוט" },
] as const;

export function FloatingAIButton({ question }: FloatingAIButtonProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, streaming, error, sendMessage, retry } = useAIChat(question);

  // Scroll to bottom when new messages arrive
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

  const handleQuickHint = (message: string) => {
    if (streaming) return;
    sendMessage(message);
  };

  return (
    <>
      <AnimatePresence>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-32 end-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-xl hover:shadow-purple-500/30"
          aria-label="עזרת AI"
        >
          <Sparkles className="h-6 w-6" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-foreground border border-border">
              {messages.filter((m) => m.role === "user").length}
            </span>
          )}
        </motion.button>
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="flex flex-col rounded-t-2xl p-0"
          style={{ height: "85dvh" }}
          dir="rtl"
        >
          <SheetHeader className="shrink-0 border-b px-4 py-3 text-right">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              מדריך AI — פרופ׳ פייתון
            </SheetTitle>
          </SheetHeader>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center text-muted-foreground">
                <Sparkles className="h-8 w-8 text-purple-400 opacity-50" />
                <p className="text-sm">שלום! אני כאן לעזור לך עם השאלה.</p>
                <p className="text-xs opacity-70">השתמש בכפתורי הרמזים למטה, או שאל אותי בחופשיות.</p>
              </div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                    dir="rtl"
                  >
                    {msg.role === "assistant" ? (
                      <ExplanationRenderer text={msg.content} />
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.content}</span>
                    )}
                    {msg.role === "assistant" && streaming && i === messages.length - 1 && (
                      <span
                        className="inline-block w-1.5 h-4 bg-current animate-pulse mr-0.5 align-middle"
                        aria-label="מקליד תגובה"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive text-right space-y-2">
                <p>{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                  onClick={retry}
                  disabled={streaming}
                >
                  נסה שוב
                </Button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick hint buttons */}
          <div className="shrink-0 border-t px-4 py-2 flex gap-2 overflow-x-auto">
            {QUICK_HINTS.map(({ label, message }) => (
              <Button
                key={label}
                size="sm"
                variant="outline"
                className="shrink-0 text-xs h-7 px-2.5"
                disabled={streaming}
                onClick={() => handleQuickHint(message)}
              >
                {label === "💡 רמז כללי" && <Lightbulb className="h-3 w-3 ml-1 text-yellow-500" />}
                {label === "➕ רמז ספציפי" && <ChevronDown className="h-3 w-3 ml-1 text-orange-500" />}
                {label === "📖 הסבר מפורט" && <BookOpen className="h-3 w-3 ml-1 text-blue-500" />}
                {label}
              </Button>
            ))}
          </div>

          {/* Input area */}
          <div className="shrink-0 border-t px-4 py-3 flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="שאל/י שאלה..."
              aria-label="הקלד שאלה למדריך AI"
              className="resize-none text-sm min-h-[40px] max-h-[120px] text-right"
              rows={1}
              dir="rtl"
              disabled={streaming}
            />
            <Button
              size="icon"
              className="shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              disabled={!input.trim() || streaming}
              onClick={handleSend}
              aria-label="שלח"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function ExplanationRenderer({ text }: { text: string }) {
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
              className="rounded-lg bg-secondary p-3 text-sm font-mono overflow-x-auto border border-border my-1"
            >
              <code>{code}</code>
            </pre>
          );
        }
        return (
          <div key={i} className="whitespace-pre-wrap">
            {segment.split("\n").map((line, j) => {
              const formatted = line.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
              );
              return (
                <p
                  key={j}
                  className="mb-1"
                  dangerouslySetInnerHTML={{ __html: formatted }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
