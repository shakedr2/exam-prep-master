import { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, BarChart3, RotateCcw, AlertCircle, TrendingUp, Trophy, GraduationCap, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/hooks/useProgress";
import { useSupabaseProgress } from "@/hooks/useSupabaseProgress";
import { useWeakPatterns, type PatternStat } from "@/hooks/useWeakPatterns";
import { useAllLearningProgress } from "@/hooks/useAllLearningProgress";
import { getTutorialByTopicId } from "@/data/topicTutorials";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { patternFamilyLabel } from "@/lib/patternFamilyLabels";

type MasteryTier = "weak" | "inProgress" | "mastered";

const TIER_STYLES: Record<MasteryTier, {
  cardClass: string;
  accuracyClass: string;
  progressClass: string;
}> = {
  weak: {
    cardClass: "border-destructive/20 bg-destructive/5",
    accuracyClass: "text-destructive",
    progressClass: "bg-destructive/20 [&>div]:bg-destructive",
  },
  inProgress: {
    cardClass: "border-warning/30 bg-warning/5",
    accuracyClass: "text-warning",
    progressClass: "bg-warning/20 [&>div]:bg-warning",
  },
  mastered: {
    cardClass: "border-success/30 bg-success/5",
    accuracyClass: "text-success",
    progressClass: "bg-success/20 [&>div]:bg-success",
  },
};

function PatternMasteryCard({ stat, tier }: { stat: PatternStat; tier: MasteryTier }) {
  const styles = TIER_STYLES[tier];
  return (
    <div className={`rounded-lg border p-3 ${styles.cardClass}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-foreground">
          {patternFamilyLabel(stat.patternFamily)}
        </span>
        <span className={`text-xs font-bold ${styles.accuracyClass}`}>{stat.accuracy}%</span>
      </div>
      <Progress value={stat.accuracy} className={`h-1.5 ${styles.progressClass}`} />
      <p className="text-xs text-muted-foreground mt-1">
        {stat.correct} נכונות מתוך {stat.total} ניסיונות
      </p>
    </div>
  );
}

const ProgressPage = () => {
  const { progress, getIncorrectQuestions } = useProgress();
  const { user } = useAuth();
  const supabaseProgress = useSupabaseProgress();
  const weakPatterns = useWeakPatterns();
  const { learnMap } = useAllLearningProgress();
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Annotate each topic stat with learn/practice percentages and partition
  // into "learned+practiced" vs "practiced only" in a single pass.
  const { learnedAndPracticed, practicedOnly } = useMemo(() => {
    type AnnotatedStat = typeof supabaseProgress.topicStats[number] & {
      progressPct: number;
      learnPct: number;
    };
    const learned: AnnotatedStat[] = [];
    const practiceOnly: AnnotatedStat[] = [];

    for (const stat of supabaseProgress.topicStats) {
      const conceptsLearned = learnMap[stat.topicId]?.length ?? 0;
      const totalConcepts = getTutorialByTopicId(stat.topicId)?.concepts.length ?? 0;
      const progressPct = stat.totalQuestions > 0
        ? Math.round((stat.answered / stat.totalQuestions) * 100)
        : 0;
      const learnPct = totalConcepts > 0
        ? Math.round((conceptsLearned / totalConcepts) * 100)
        : 0;
      const annotated: AnnotatedStat = { ...stat, progressPct, learnPct };
      if (conceptsLearned > 0) {
        learned.push(annotated);
      } else {
        practiceOnly.push(annotated);
      }
    }

    return { learnedAndPracticed: learned, practicedOnly: practiceOnly };
  }, [supabaseProgress.topicStats, learnMap]);

  // After Sprint 3.1 `useSupabaseProgress` works for anonymous learners
  // too, so we always read from Supabase. Total question count is the
  // sum of per-topic counts reported by the same hook — the dashboard
  // reads from the same source, so the two screens stay consistent.
  const totalQuestions = supabaseProgress.topicStats.reduce(
    (sum, stat) => sum + stat.totalQuestions,
    0
  );
  const displayTotalAnswered = supabaseProgress.totalAnswered;
  const displayTotalCorrect = supabaseProgress.totalCorrect;
  const displayAccuracy = supabaseProgress.overallAccuracy;
  const coveragePct = totalQuestions > 0
    ? Math.round((displayTotalCorrect / totalQuestions) * 100)
    : 0;

  const incorrectQuestions = getIncorrectQuestions();

  if (supabaseProgress.loading) {
    return (
      <div className="min-h-screen pb-24 pt-6">
        <div className="mx-auto max-w-lg px-4 space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-20" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="mx-auto max-w-lg px-4 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">התקדמות</h1>

        {!isAuthenticated && (
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
            <p>
              התחבר כדי לסנכרן את ההתקדמות שלך בין מכשירים.{" "}
              <button onClick={() => navigate("/login")} className="underline font-medium">
                התחברות
              </button>
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CheckCircle2, label: "נענו", value: displayTotalAnswered, color: "text-primary" },
            { icon: Target, label: "נכונות", value: displayTotalCorrect, color: "text-success" },
            { icon: BarChart3, label: "דיוק", value: `${displayAccuracy}%`, color: "text-foreground" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-foreground/10 bg-card p-4 text-center"
            >
              <Icon className={`mx-auto h-5 w-5 mb-1.5 ${color}`} />
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="rounded-lg border border-foreground/10 bg-card p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-foreground">התקדמות כללית</span>
            <span className="text-primary font-bold">{coveragePct}%</span>
          </div>
          <Progress value={coveragePct} className="h-2.5" />
          <p className="text-xs text-muted-foreground">
            {displayTotalCorrect} נכונות מתוך {totalQuestions} שאלות
          </p>
        </div>

        {/* Mastery ladder by pattern family (red / yellow / green) */}
        {!weakPatterns.loading && (weakPatterns.weak.length > 0 || weakPatterns.inProgress.length > 0 || weakPatterns.mastered.length > 0) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="font-bold text-foreground mb-3">שליטה לפי תבנית</h2>

            {weakPatterns.weak.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-destructive mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  דורש תשומת לב
                </h3>
                <div className="space-y-2">
                  {weakPatterns.weak.slice(0, 5).map((stat) => (
                    <PatternMasteryCard key={stat.patternFamily} stat={stat} tier="weak" />
                  ))}
                </div>
              </div>
            )}

            {weakPatterns.inProgress.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-warning mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  בתהליך שיפור
                </h3>
                <div className="space-y-2">
                  {weakPatterns.inProgress.slice(0, 3).map((stat) => (
                    <PatternMasteryCard key={stat.patternFamily} stat={stat} tier="inProgress" />
                  ))}
                </div>
              </div>
            )}

            {weakPatterns.mastered.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-success mb-2 flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  שלטת במלואו
                </h3>
                <div className="space-y-2">
                  {weakPatterns.mastered.slice(0, 3).map((stat) => (
                    <PatternMasteryCard key={stat.patternFamily} stat={stat} tier="mastered" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Per topic — Supabase data */}
        <div>
          <h2 className="font-bold text-foreground mb-3">לפי נושא</h2>
          {(() => {
            const renderTopicCard = (stat: typeof learnedAndPracticed[number]) => (
              <div key={stat.topicId} className="rounded-lg border border-foreground/10 bg-card p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{stat.topicIcon}</span>
                  <span className="text-sm font-semibold flex-1 text-foreground">{stat.topicName}</span>
                  <span className="text-xs text-muted-foreground font-mono">{stat.answered}/{stat.totalQuestions}</span>
                  <span className="text-xs text-primary font-bold w-10 text-left">{stat.accuracy}%</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 text-blue-500 shrink-0" />
                    <Progress value={stat.learnPct} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground font-mono w-7 text-left">{stat.learnPct}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-500 shrink-0" />
                    <Progress value={stat.progressPct} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground font-mono w-7 text-left">{stat.progressPct}%</span>
                  </div>
                </div>
              </div>
            );

            return (
              <>
                {learnedAndPracticed.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      נלמדו ותורגלו
                    </h3>
                    <div className="space-y-2">
                      {learnedAndPracticed.map(renderTopicCard)}
                    </div>
                  </div>
                )}
                {practicedOnly.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-warning" />
                      תורגלו בלבד
                    </h3>
                    <div className="space-y-2">
                      {practicedOnly.map(renderTopicCard)}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {/* Review Mistakes */}
        {incorrectQuestions.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Button
              onClick={() => navigate("/review-mistakes")}
              variant="outline"
              className="w-full h-12 text-sm gap-2 border-destructive/30 text-destructive hover:bg-destructive/5"
            >
              <RotateCcw className="h-4 w-4" />
              חזרה על {incorrectQuestions.length} טעויות
            </Button>
          </motion.div>
        )}

        {/* Exam History */}
        {progress.examHistory.length > 0 && (
          <div>
            <h2 className="font-bold text-foreground mb-3">היסטוריית מבחנים</h2>
            <div className="space-y-2">
              {progress.examHistory.slice(-5).reverse().map((exam, i) => {
                const pct = Math.round((exam.score / exam.total) * 100);
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-foreground/10 bg-card p-3">
                    <span className="text-sm text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString("he-IL")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">
                        {exam.score}/{exam.total}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        pct >= 80 ? "bg-success/10 text-success" :
                        pct >= 60 ? "bg-warning/10 text-warning" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
