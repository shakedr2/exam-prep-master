import { useMemo } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, BarChart3, RotateCcw, AlertCircle, TrendingUp, Trophy, GraduationCap, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgress } from "@/hooks/useProgress";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useWeakPatterns, type PatternStat } from "@/hooks/useWeakPatterns";
import { useAllLearningProgress } from "@/hooks/useAllLearningProgress";
import { getTutorialByTopicId, resolveTopicId } from "@/data/topicTutorials";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { patternFamilyLabel } from "@/lib/patternFamilyLabels";
import { useTrackProgress } from "@/features/progress/hooks/useTrackProgress";
import type { TopicProgress } from "@/features/progress/lib/progressTypes";

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

interface TopicRow {
  topicId: string;
  topicName: string;
  topicIcon: string;
  correct: number;
  attempted: number;
  totalQuestions: number;
  completionPct: number;
  accuracy: number;
  learnPct: number;
  hasConcepts: boolean;
}

const ProgressPage = () => {
  const { user } = useAuth();
  const { progress, getIncorrectQuestions, totalCorrect, totalAnswered, isLoading } = useProgress();
  const pythonTrack = useTrackProgress("python-fundamentals");
  const oopTrack = useTrackProgress("python-oop");
  const devopsTrack = useTrackProgress("devops");
  const { topics, loading: topicsLoading } = useSupabaseTopics();
  const { learnMap } = useAllLearningProgress();
  const weakPatterns = useWeakPatterns();
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  // Overall progress is composed from the per-track hooks so that the
  // Progress page shows the exact same Σ-weighted totals as Home /
  // Dashboard / Track pages. No local math here — everything flows from
  // the single source of truth in `features/progress`.
  const overallTotalQuestions =
    pythonTrack.totalQuestions + oopTrack.totalQuestions + devopsTrack.totalQuestions;
  const overallCorrect =
    pythonTrack.correct + oopTrack.correct + devopsTrack.correct;
  const coveragePct = overallTotalQuestions > 0
    ? Math.min(100, Math.max(0, Math.round((overallCorrect / overallTotalQuestions) * 100)))
    : 0;

  const displayAccuracy = totalAnswered > 0
    ? Math.round((totalCorrect / totalAnswered) * 100)
    : 0;

  // Build per-topic rows by flattening the 3 track hooks. Topic
  // completion, correct, attempted and totalQuestions all come from the
  // TopicProgress objects produced by `useTrackProgress`.
  const { learnedAndPracticed, practicedOnly } = useMemo(() => {
    const topicMeta = new Map<string, { name: string; icon: string }>();
    for (const t of topics) {
      topicMeta.set(t.id, { name: t.name, icon: t.icon ?? "📖" });
    }

    const rows: TopicRow[] = [];
    const tracks = [pythonTrack, oopTrack, devopsTrack];
    for (const track of tracks) {
      for (const mod of track.modules) {
        for (const topic of mod.topics) {
          rows.push(buildTopicRow(topic, topicMeta, learnMap));
        }
      }
    }

    const learned: TopicRow[] = [];
    const practiceOnly: TopicRow[] = [];
    for (const row of rows) {
      (row.hasConcepts ? learned : practiceOnly).push(row);
    }
    return { learnedAndPracticed: learned, practicedOnly: practiceOnly };
  }, [pythonTrack, oopTrack, devopsTrack, topics, learnMap]);

  const incorrectQuestions = getIncorrectQuestions();

  // Show the skeleton while either the authed-user progress rows or the
  // topic-metadata query are still in flight. Guests resolve instantly
  // because `useProgress` returns `isLoading: false` for them.
  if (isLoading || topicsLoading) {
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
            { icon: CheckCircle2, label: "נענו", value: totalAnswered, color: "text-primary" },
            { icon: Target, label: "נכונות", value: totalCorrect, color: "text-success" },
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
            {overallCorrect} נכונות מתוך {overallTotalQuestions} שאלות
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

        {/* Per topic — composed from useTrackProgress hooks */}
        <div>
          <h2 className="font-bold text-foreground mb-3">לפי נושא</h2>
          {(() => {
            const renderTopicCard = (row: TopicRow) => (
              <div key={row.topicId} className="rounded-lg border border-foreground/10 bg-card p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{row.topicIcon}</span>
                  <span className="text-sm font-semibold flex-1 text-foreground">{row.topicName}</span>
                  <span className="text-xs text-muted-foreground font-mono">{row.attempted}/{row.totalQuestions}</span>
                  <span className="text-xs text-primary font-bold w-10 text-left">{row.accuracy}%</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 text-blue-500 shrink-0" />
                    <Progress value={row.learnPct} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground font-mono w-7 text-left">{row.learnPct}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3 text-green-500 shrink-0" />
                    <Progress value={row.completionPct} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground font-mono w-7 text-left">{row.completionPct}%</span>
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

function buildTopicRow(
  topic: TopicProgress,
  topicMeta: Map<string, { name: string; icon: string }>,
  learnMap: Record<string, number[]>,
): TopicRow {
  // Hook-layer topic IDs are slugs; Supabase `topics` rows are keyed by
  // UUID; `user_learning_progress` rows can be keyed by either form
  // depending on how they were written (see resolveTopicId). Bridge
  // both lookups so the Progress page matches whatever DashboardPage
  // sees for the same user.
  const resolved = resolveTopicId(topic.topicId);
  const slug = resolved?.slug ?? topic.topicId;
  const uuid = resolved?.uuid;

  const meta =
    (uuid && topicMeta.get(uuid)) ||
    topicMeta.get(slug) ||
    topicMeta.get(topic.topicId);

  const conceptsLearned =
    (uuid && learnMap[uuid]?.length) ||
    learnMap[slug]?.length ||
    learnMap[topic.topicId]?.length ||
    0;
  const totalConcepts = getTutorialByTopicId(slug)?.concepts.length ?? 0;
  const learnPct = totalConcepts > 0
    ? Math.round((conceptsLearned / totalConcepts) * 100)
    : 0;
  const accuracy = topic.attempted > 0
    ? Math.round((topic.correct / topic.attempted) * 100)
    : 0;

  return {
    topicId: topic.topicId,
    topicName: meta?.name ?? slug,
    topicIcon: meta?.icon ?? "📖",
    correct: topic.correct,
    attempted: topic.attempted,
    totalQuestions: topic.totalQuestions,
    completionPct: topic.completionPct,
    accuracy,
    learnPct,
    hasConcepts: conceptsLearned > 0,
  };
}

export default ProgressPage;
