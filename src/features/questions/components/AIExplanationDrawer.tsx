import { useState, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Loader2 } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIExplanationDrawerProps {
  open: boolean;
  onClose: () => void;
  content: string;
  loading: boolean;
  title?: string;
  questionContext?: string;
}

export function AIExplanationDrawer({
  open,
  onClose,
  content,
  loading,
  title = "הסבר AI",
  questionContext,
}: AIExplanationDrawerProps) {
  const [followUpInput, setFollowUpInput] = useState("");
  const [followUpMessages, setFollowUpMessages] = useState<Message[]>([]);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendFollowUp = async () => {
    const text = followUpInput.trim();
    if (!text || followUpLoading) return;

    const userMsg: Message = { role: "user", content: text };
    setFollowUpMessages(prev => [...prev, userMsg]);
    setFollowUpInput("");
    setFollowUpLoading(true);

    try {
      const context = questionContext
        ? `${questionContext}\n\nהסבר שניתן:\n${content}`
        : `הסבר שניתן:\n${content}`;

      if (!SUPABASE_URL || !SUPABASE_KEY) {
        setFollowUpMessages(prev => [...prev, { role: "assistant", content: "שירות ה-AI אינו זמין כרגע." }]);
        setFollowUpLoading(false);
        return;
      }

      const resp = await fetch(
        `${SUPABASE_URL}/functions/v1/ai-tutor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...followUpMessages, userMsg],
            questionContext: context,
          }),
        }
      );

      if (!resp.ok || !resp.body) {
        setFollowUpMessages(prev => [...prev, { role: "assistant", content: "מצטער, קרתה שגיאה. נסה שוב." }]);
        setFollowUpLoading(false);
        return;
      }

      let assistantSoFar = "";
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      const upsertAssistant = (chunk: string) => {
        assistantSoFar += chunk;
        setFollowUpMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

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
            const chunk = parsed.choices?.[0]?.delta?.content;
            if (chunk) upsertAssistant(chunk);
          } catch {
            // JSON parse may fail for partial lines at chunk boundaries — restore and retry on next read
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      setFollowUpMessages(prev => [...prev, { role: "assistant", content: "מצטער, קרתה שגיאה. נסה שוב. 😔" }]);
    }

    setFollowUpLoading(false);
  };

  const handleClose = () => {
    setFollowUpMessages([]);
    setFollowUpInput("");
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && handleClose()}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col overflow-hidden" style={{ maxHeight: "calc(80vh - 80px)" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <p className="text-sm text-card-foreground whitespace-pre-wrap">{content}</p>
            )}

            {/* Follow-up conversation */}
            {followUpMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "gradient-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {followUpLoading && followUpMessages[followUpMessages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted px-4 py-3 rounded-bl-md">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Follow-up input */}
          {!loading && (
            <div className="border-t border-border p-3">
              <form
                onSubmit={e => { e.preventDefault(); sendFollowUp(); }}
                className="flex gap-2"
              >
                <Input
                  ref={inputRef}
                  value={followUpInput}
                  onChange={e => setFollowUpInput(e.target.value)}
                  placeholder="שאל שאלת המשך..."
                  className="flex-1 text-sm"
                  disabled={followUpLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!followUpInput.trim() || followUpLoading}
                  className="gradient-primary text-primary-foreground shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
