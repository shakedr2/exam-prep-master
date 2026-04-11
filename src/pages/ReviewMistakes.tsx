import { useState, useCallback, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle, Filter, RotateCcw, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { QuizView } from "@/components/QuizView";
import { TracingView } from "@/components/TracingView";
import { CodingView } from "@/components/CodingView";
import { FillBlankView } from "@/components/FillBlankView";
import { useProgress } from "@/hooks/useProgress";
import { topics, type Question } from "@/data/questions";

type Mode = "review" | "practice" | "summary";

const typeLabels: Record<string, string> = {
  quiz: "בחירה",
  tracing: "מעקב",
  coding: "קוד",
  "fill-blank": "השלמה",
};

const ReviewMistakes = () => {
  const navigate = useNavigate();
  const { getIncorrectQuestions, getAttempts, answerQuestion } = useProgress();

  const allMistakes = useMemo(() => getIncorrectQuestions(), [getIncorrectQuestions]);

  const [mode, setMode] = useState<Mode>("review");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [topicFilter, setTopicFilter] = useState<string>("all");

  // Practice state
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctedIds, setCorrectedIds] = useState<Set<string>>(new Set());

  const filteredMistakes = useMemo(() => {
    if (topicFilter === "all") return allMistakes;
    return allMistakes.filter(q => q.topic === topicFilter);
  }, [allMistakes, topicFilter]);

  const mistakeTopics = useMemo(() => {
    const ids = new Set(allMistakes.map(q => q.topic));
    return topics.filter(t => ids.has(t.id));
  }, [allMistakes]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredMistakes.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMistakes.map(q => q.id)));
    }
  };

  const startPractice = (questionsToUse: Question[]) => {
    setPracticeQuestions(questionsToUse);
    setCurrentIndex(0);
    setAnswered(false);
    setCorrectedIds(new Set());
    setMode("practice");
  };

  const handleAnswer = useCallback((correct: boolean) => {
    const q = practiceQuestions[currentIndex];
    if (!q) return;
    answerQuestion(q.id, q.topic, correct);
    if (correct) {
      setCorrectedIds(prev => new Set(prev).add(q.id));
    }
    setAnswered(true);
  }, [practiceQuestions, currentIndex, answerQuestion]);

  const handleNext = () => {
    if (currentIndex >= practiceQuestions.length - 1) {
      setMode("summary");
      return;
    }
    setCurrentIndex(i => i + 1);
    setAnswered(false);
  };

  // Confetti effect (must be before early returns)
  const summaryTotal = practiceQuestions.length;
  const summaryFixed = correctedIds.size;
  const allFixed = summaryFixed === summaryTotal && summaryTotal > 0;

  useEffect(() => {
    if (mode === "summary" && allFixed) {
      const end = Date.now() + 2000;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [mode, allFixed]);

  // === Empty state ===
  if (allMistakes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-4">
        <CheckCircle className="h-16 w-16 text-success" />
        <h1 className="text-2xl font-bold">אין טעויות! 🎉</h1>
        <p className="text-muted-foreground">ענית נכון על כל השאלות</p>
        <Button onClick={() => navigate("/progress")} variant="outline" className="gap-2">
          <ArrowRight className="h-4 w-4" /> חזרה להתקדמות
        </Button>
      </div>
    );
  }

  // === Summary screen ===
  if (mode === "summary") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center gap-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Trophy className="h-20 w-20 text-primary mx-auto mb-2" />
        </motion.div>
        <h1 className="text-2xl font-bold">{allFixed ? "תיקנת הכל! 🎊" : "סיום חזרה על טעויות"}</h1>
        <p className="text-lg text-muted-foreground">
          תיקנת <span className="text-primary font-bold">{summaryFixed}</span> מתוך <span className="font-bold">{summaryTotal}</span> שאלות
        </p>
        <Progress value={Math.round((summaryFixed / Math.max(summaryTotal, 1)) * 100)} className="h-3 max-w-xs mx-auto" />
        <div className="flex gap-3">
          {summaryFixed < summaryTotal && (
            <Button variant="outline" onClick={() => { setMode("review"); setSelectedIds(new Set()); }} className="gap-2">
              <RotateCcw className="h-4 w-4" /> נסה שוב
            </Button>
          )}
          <Button onClick={() => navigate("/progress")} className="gap-2 gradient-primary text-primary-foreground">
            <ArrowRight className="h-4 w-4" /> חזרה להתקדמות
          </Button>
        </div>
      </div>
    );
  }

  // === Practice mode ===
  if (mode === "practice") {
    const q = practiceQuestions[currentIndex];
    if (!q) return null;
    const isLast = currentIndex >= practiceQuestions.length - 1;
    const progressPct = Math.round(((currentIndex + (answered ? 1 : 0)) / practiceQuestions.length) * 100);

    const renderQuestion = () => {
      switch (q.type) {
        case "quiz": return <QuizView q={q} onAnswer={handleAnswer} />;
        case "tracing": return <TracingView q={q} onAnswer={handleAnswer} />;
        case "coding": return <CodingView q={q} onAnswer={handleAnswer} />;
        case "fill-blank": return <FillBlankView q={q} onAnswer={handleAnswer} />;
      }
    };

    return (
      <div className="min-h-screen pb-24 pt-6">
        <div className="mx-auto max-w-lg px-4 space-y-4">
          <div className="flex items-center justify-between">
            <Button onClick={() => setMode("review")} variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <ArrowRight className="h-4 w-4" /> חזרה לרשימה
            </Button>
            <span className="text-sm text-muted-foreground font-medium">
              {currentIndex + 1} / {practiceQuestions.length}
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
          <h2 className="text-lg font-bold">🔄 חזרה על טעויות</h2>
          <motion.div key={q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-border bg-card p-5">
            {renderQuestion()}
          </motion.div>
          {answered && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Button onClick={handleNext} className="w-full gradient-primary text-primary-foreground">
                {isLast ? "סיום — לסיכום" : "שאלה הבאה ←"}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // === Review (selection) screen ===
  const hasSelection = selectedIds.size > 0;

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate("/progress")} variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <ArrowRight className="h-4 w-4" /> חזרה
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {allMistakes.length} טעויות
          </span>
        </div>

        <h2 className="text-xl font-bold">📋 סקירת טעויות</h2>
        <p className="text-sm text-muted-foreground">בחר שאלות לתרגול מחדש, או תרגל הכל</p>

        {/* Topic filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={topicFilter === "all" ? "default" : "outline"}
            onClick={() => setTopicFilter("all")}
            className="text-xs"
          >
            <Filter className="h-3 w-3 ms-1" /> הכל ({allMistakes.length})
          </Button>
          {mistakeTopics.map(t => {
            const count = allMistakes.filter(q => q.topic === t.id).length;
            return (
              <Button
                key={t.id}
                size="sm"
                variant={topicFilter === t.id ? "default" : "outline"}
                onClick={() => setTopicFilter(t.id)}
                className="text-xs"
              >
                {t.icon} {t.name} ({count})
              </Button>
            );
          })}
        </div>

        {/* Select all + action buttons */}
        <div className="flex items-center justify-between">
          <button onClick={selectAll} className="text-xs text-primary hover:underline">
            {selectedIds.size === filteredMistakes.length ? "בטל הכל" : "בחר הכל"}
          </button>
          <div className="flex gap-2">
            {hasSelection && (
              <Button size="sm" onClick={() => startPractice(filteredMistakes.filter(q => selectedIds.has(q.id)))}>
                תרגל נבחרות ({selectedIds.size})
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => startPractice(filteredMistakes)}>
              תרגל הכל
            </Button>
          </div>
        </div>

        {/* Question cards */}
        <div className="space-y-2">
          <AnimatePresence>
            {filteredMistakes.map(q => {
              const topic = topics.find(t => t.id === q.topic);
              const attempts = getAttempts(q.id);
              const title = q.type === "coding" ? q.title : q.type === "fill-blank" ? q.title : q.question;
              return (
                <motion.div key={q.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card
                    className={`cursor-pointer transition-colors ${selectedIds.has(q.id) ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => toggleSelect(q.id)}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <Checkbox
                        checked={selectedIds.has(q.id)}
                        onCheckedChange={() => toggleSelect(q.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{topic?.icon} {topic?.name}</span>
                          <span>•</span>
                          <span>{typeLabels[q.type]}</span>
                          <span>•</span>
                          <span>{attempts} ניסיונות</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReviewMistakes;
