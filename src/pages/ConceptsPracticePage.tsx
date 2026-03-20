import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, RotateCcw, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AIExplanationDrawer } from "@/components/AIExplanationDrawer";
import { getQuestionExplanation, generateSimilarQuestion } from "@/lib/aiClient";

interface Concept {
  term: string;
  definition: string;
}

// TODO: load from Supabase
const MOCK_CONCEPTS: Concept[] = [
  {
    term: "משתנה",
    definition: "שם סמלי שמצביע על ערך ששמור בזיכרון. לדוגמה: x = 5",
  },
  {
    term: "לולאת for",
    definition: "מבנה שחוזר על קטע קוד מספר מוגדר של פעמים על פני רצף.",
  },
  {
    term: "תנאי if",
    definition: "מבנה המריץ קוד רק אם ביטוי בוליאני מסוים הוא True.",
  },
  {
    term: "פונקציה",
    definition: "בלוק קוד עם שם שניתן לקרוא לו שוב ושוב כדי לבצע פעולה מסוימת.",
  },
  {
    term: "רשימה (list)",
    definition: "מבנה נתונים מסודר ב-Python שמכיל אוסף של איברים הניתנים לשינוי.",
  },
];

const ConceptsPracticePage = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const [unknown, setUnknown] = useState<number[]>([]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerContent, setDrawerContent] = useState("");
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarContent, setSimilarContent] = useState("");

  const total = MOCK_CONCEPTS.length;
  const answered = known.length + unknown.length;
  const isComplete = answered >= total || currentIndex >= total;
  const concept = MOCK_CONCEPTS[currentIndex];

  const advance = () => {
    setFlipped(false);
    setSimilarContent("");
    setDrawerContent("");
    setCurrentIndex((i) => i + 1);
  };

  async function handleExplain() {
    if (!concept) return;
    setDrawerContent("");
    setDrawerLoading(true);
    setDrawerOpen(true);
    try {
      const result = await getQuestionExplanation(
        concept.term,
        [concept.definition],
        0,
      );
      setDrawerContent(result.tip ? `${result.explanation}\n\n${result.tip}` : result.explanation);
    } catch {
      setDrawerOpen(false);
      toast.error("שגיאה בטעינת ההסבר, נסה שוב");
    } finally {
      setDrawerLoading(false);
    }
  }

  async function handleSimilar() {
    if (!concept) return;
    setSimilarLoading(true);
    setSimilarContent("");
    try {
      const result = await generateSimilarQuestion(concept.term, "מושגים");
      setSimilarContent(result);
    } catch {
      toast.error("שגיאה בטעינת שאלה דומה, נסה שוב");
    } finally {
      setSimilarLoading(false);
    }
  }

  const handleKnown = () => {
    setKnown((prev) => [...prev, currentIndex]);
    advance();
  };

  const handleUnknown = () => {
    setUnknown((prev) => [...prev, currentIndex]);
    advance();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
  };

  if (isComplete) {
    const successRate = Math.round((known.length / total) * 100);
    return (
      <div className="min-h-screen flex items-center justify-center pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="text-6xl">🎓</div>
          <h1 className="text-2xl font-bold text-foreground">כל הכבוד!</h1>
          <p className="text-muted-foreground">סיימת את כל {total} הכרטיסיות</p>
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <div className="flex justify-around text-center">
              <div>
                <p className="text-2xl font-bold text-success">{known.length}</p>
                <p className="text-xs text-muted-foreground">ידעתי</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{unknown.length}</p>
                <p className="text-xs text-muted-foreground">לא ידעתי</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{successRate}%</p>
                <p className="text-xs text-muted-foreground">הצלחה</p>
              </div>
            </div>
            <Progress value={successRate} className="h-2" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
              שוב
            </Button>
            <Button
              className="flex-1 gradient-primary text-primary-foreground"
              onClick={() => navigate("/")}
            >
              חזור לדף הבית
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-8">
      <div className="mx-auto max-w-lg px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">🧠 תרגול מושגים</h1>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Progress */}
        <Progress value={((currentIndex) / total) * 100} className="h-2" />

        {/* Flashcard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${flipped}`}
            initial={{ opacity: 0, rotateY: flipped ? -90 : 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-card p-8 shadow-sm min-h-[180px] flex flex-col items-center justify-center text-center cursor-pointer select-none"
            onClick={() => setFlipped((f) => !f)}
          >
            {!flipped ? (
              <>
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">מושג</p>
                <p className="text-2xl font-bold text-foreground">{concept.term}</p>
                <p className="text-xs text-muted-foreground mt-4">לחץ לגלות הגדרה</p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide">הגדרה</p>
                <p className="text-base text-foreground leading-relaxed">{concept.definition}</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action buttons – shown after flipping */}
        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <Button
                onClick={handleUnknown}
                variant="outline"
                className="flex-1 h-12 gap-2 border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <XCircle className="h-5 w-5" />
                לא ידעתי
              </Button>
              <Button
                onClick={handleKnown}
                className="flex-1 h-12 gap-2 bg-success text-success-foreground hover:bg-success/90"
              >
                <CheckCircle2 className="h-5 w-5" />
                ידעתי
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!flipped && (
          <p className="text-center text-xs text-muted-foreground">לחץ על הכרטיסייה כדי לגלות את ההגדרה</p>
        )}

        {/* AI buttons – shown after flipping */}
        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <Button variant="outline" className="flex-1" onClick={handleExplain}>
                הסבר עם AI
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                disabled={similarLoading}
                onClick={handleSimilar}
              >
                {similarLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "שאלה דומה"
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {similarContent && flipped && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-muted/50 p-4 text-sm text-card-foreground whitespace-pre-wrap"
          >
            {similarContent}
          </motion.div>
        )}

        <AIExplanationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          content={drawerContent}
          loading={drawerLoading}
          title="הסבר עם AI"
        />
      </div>
    </div>
  );
};

export default ConceptsPracticePage;
