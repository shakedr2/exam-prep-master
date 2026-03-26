import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AiTutorProps {
  questionContext?: string;
}

export function AiTutor({ questionContext }: AiTutorProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Reset chat when question context changes
  useEffect(() => {
    setMessages([]);
  }, [questionContext]);

  const sendMessageWithText = useCallback(async (text: string, currentMessages: Message[]) => {
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...currentMessages, userMsg],
            questionContext,
          }),
        }
      );

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "שגיאה" }));
        upsertAssistant(err.error || "מצטער, קרתה שגיאה. נסה שוב.");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      upsertAssistant("מצטער, קרתה שגיאה. נסה שוב. 😔");
    }

    setLoading(false);
  }, [loading, questionContext]);

  const sendMessage = () => {
    const text = input.trim();
    sendMessageWithText(text, messages);
  };

  // Send a message directly (used by quick-question chips)
  const sendDirectMessage = (text: string) => {
    sendMessageWithText(text, messages);
  };

  const quickQuestions = [
    "תעזור לי להבין את הקוד",
    "תן לי רמז",
    "תסביר לי את העיקרון",
  ];

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-24 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary shadow-xl"
          >
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop – closes panel when tapping outside */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            style={{ maxHeight: "50vh" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gradient-primary p-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div>
                  <p className="text-sm font-bold">פרופ' פייתון 🎓</p>
                  <p className="text-xs opacity-80">עוזר לימודי - מלמד בלי לתת תשובות!</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-primary-foreground hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-[30vh] overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-4 space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                    🤔
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">צריך עזרה?</p>
                    <p className="text-xs text-muted-foreground mt-1">אני כאן כדי ללמד אותך, לא לתת תשובות!</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickQuestions.map(q => (
                      <button
                        key={q}
                        onClick={() => sendDirectMessage(q)}
                        className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-primary/10 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "gradient-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-muted px-4 py-3 rounded-bl-md">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <form
                onSubmit={e => { e.preventDefault(); sendMessage(); }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="שאל שאלה..."
                  className="flex-1 text-sm"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="gradient-primary text-primary-foreground shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
