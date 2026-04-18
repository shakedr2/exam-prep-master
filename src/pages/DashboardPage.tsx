import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { trackDashboardViewed } from "@/lib/analytics";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTopicCompletion } from "@/hooks/useTopicCompletion";
import { getModulesByTrack } from "@/data/modules";
import { XpBadge } from "@/components/XpBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StreakBadge } from "@/features/gamification/components/StreakBadge";
import { DashboardStatsSkeleton } from "@/features/gamification/components/DashboardStatsSkeleton";
import { useGamification } from "@/features/gamification/hooks/useGamification";
import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";
import { useDailyLogin } from "@/features/gamification/hooks/useDailyLogin";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { OnboardingWizard } from "@/features/onboarding/components/OnboardingWizard";
import { Flame, CheckCircle2, GraduationCap, X, ChevronLeft, Home, Rocket, LogIn } from "lucide-react";
import { PythonHero } from "@/components/PythonHero";
import { TrackModuleList } from "@/components/TrackModuleList";
import { useTrackProgress } from "@/features/progress/hooks/useTrackProgress";

const PRACTICE_TIP_DISMISSED_KEY = "practice_tip_dismissed";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress } = useProgress();
  const { topics, loading } = useSupabaseTopics();
  const { learnMap, questionCounts } = useDashboardData();
  const { isTopicUnlocked, isTopicComplete } = useTopicCompletion();
  const gamification = useGamification();
  const { stats: precomputedStats } = useDashboardStats();
  const { state: onboardingState, loading: onboardingLoading } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  useDailyLogin();

  // Stats must reflect real authenticated-user data from Supabase.
  // `progress.streak` / `progress.xp` / `totalAnswered` from useProgress are
  // derived partly from localStorage (see useProgress facade) and carry stale
  // guest-session values across logins — don't source dashboard stats from it.
  const isAuthenticated = !!user;
  const stats = isAuthenticated
    ? {
        xp: gamification.xp,
        level: gamification.level,
        currentStreak: precomputedStats?.currentStreak ?? gamification.currentStreak ?? 0,
        longestStreak: precomputedStats?.longestStreak ?? gamification.longestStreak ?? 0,
        totalCorrect: precomputedStats?.correctAnswers ?? 0,
        totalAnswered: precomputedStats?.totalQuestionsAnswered ?? 0,
        lastActivityAt: precomputedStats?.lastActivityAt ?? null,
      }
    : {
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        totalCorrect: 0,
        totalAnswered: 0,
        lastActivityAt: null as string | null,
      };

  const [tipDismissed, setTipDismissed] = useState(
    () => localStorage.getItem(PRACTICE_TIP_DISMISSED_KEY) === "true"
  );

  useEffect(() => {
    if (!onboardingLoading && !onboardingState.completed) {
      setShowOnboarding(true);
    }
  }, [onboardingLoading, onboardingState.completed]);

  const dashboardViewedRef = useRef(false);
  useEffect(() => {
    if (dashboardViewedRef.current) return;
    dashboardViewedRef.current = true;
    trackDashboardViewed({
      total_answered: stats.totalAnswered,
      total_correct: stats.totalCorrect,
    });
  }, [stats.totalAnswered, stats.totalCorrect]);

  const hasPracticed = stats.totalAnswered > 0;
  const hasLearnedAny = Object.values(learnMap).some((arr) => arr.length > 0);
  const showPracticeTip = hasPracticed && !hasLearnedAny && !tipDismissed;
  const isNewUser = !hasPracticed && !hasLearnedAny;

  const pythonModules = useMemo(() => getModulesByTrack("python-fundamentals"), []);
  const pythonTrackProgress = useTrackProgress("python-fundamentals");

  const lastExam = useMemo(
    () => progress.examHistory.length > 0
      ? progress.examHistory[progress.examHistory.length - 1]
      : null,
    [progress.examHistory]
  );

  const lastActiveLabel = useMemo(() => {
    if (!stats.lastActivityAt) return null;
    const activityDate = new Date(stats.lastActivityAt).toDateString();
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (activityDate === today) return "היום";
    if (activityDate === yesterday.toDateString()) return "אתמול";
    return new Date(stats.lastActivityAt).toLocaleDateString("he-IL");
  }, [stats.lastActivityAt]);

  const handleLearn = useCallback(
    (topicId: string) => navigate(`/learn/${topicId}`),
    [navigate]
  );

  const handlePractice = useCallback(
    (topicId: string) => navigate(`/practice/${topicId}`),
    [navigate]
  );

  if (loading) {
    return (
      <div className="min-h-screen pb-24 pt-4">
        <div className="mx-auto max-w-2xl px-4">
          <DashboardStatsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-4">
      <div className="mx-auto max-w-2xl px-4 space-y-6">
        {/* Breadcrumb trail: Home → Python Fundamentals */}
        <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1 rounded px-1.5 py-1 hover:text-foreground hover:bg-foreground/5 transition-colors touch-manipulation"
          >
            <Home className="h-3.5 w-3.5" />
            <span>בית</span>
          </button>
          <ChevronLeft className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
          <span className="px-1.5 py-1 font-semibold text-foreground">יסודות פייתון</span>
        </nav>

        {/* Python Hero Section */}
        <PythonHero />

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono truncate">
              {isNewUser ? `ברוכים הבאים, ${progress.username}!` : `שלום, ${progress.username}`}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isNewUser ? "בואו נתחיל ללמוד Python 🐍" : "הנה סקירת הלימודים שלך."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <XpBadge xp={stats.xp} level={stats.level} />
            <StreakBadge
              currentStreak={stats.currentStreak}
              longestStreak={stats.longestStreak}
            />
          </div>
        </div>

        <OnboardingWizard
          open={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />

        {isNewUser ? (
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-2xl">
                  🐍
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">מאיפה מתחילים?</p>
                  <h2 className="font-bold text-foreground text-base leading-snug mb-1">
                    משתנים, טיפוסים וקלט/פלט
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    הנושא הראשון בקורס — int, float, str, bool, input() ו-print()
                  </p>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => navigate("/learn/variables_io")}
                  >
                    <Rocket className="h-4 w-4" />
                    התחל ללמוד
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Card className="bg-card border border-foreground/10">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{stats.totalCorrect}</p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">שאלות נכונות</p>
              </CardContent>
            </Card>
            <Card className="bg-card border border-foreground/10">
              <CardContent className="p-2 sm:p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{stats.totalAnswered}</p>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">סה״כ נפתרו</p>
              </CardContent>
            </Card>
            <Card className="bg-card border border-foreground/10">
              <CardContent className="p-2 sm:p-3 text-center flex flex-col items-center">
                {stats.currentStreak > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                      <p className="text-xl sm:text-2xl font-bold text-foreground font-mono">{stats.currentStreak}</p>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">ימים רצופים</p>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground mb-0.5" />
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground">
                      {lastActiveLabel ? `פעיל ${lastActiveLabel}` : "התחל לתרגל!"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!isAuthenticated && (
          <Card className="bg-muted/30 border border-dashed border-foreground/20">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <LogIn className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">התחבר כדי לשמור את ההתקדמות</p>
                  <p className="text-[11px] text-muted-foreground">
                    ההתקדמות שלך תישמר בענן ותהיה זמינה מכל מכשיר.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/login")} className="shrink-0 text-xs h-8">
                התחבר
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick exam CTA */}
        <Card
          className="bg-card border border-foreground/10 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => navigate("/exam")}
        >
          <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground">מבחן סימולציה</p>
                <p className="text-xs text-muted-foreground">
                  6 שאלות, 3 שעות — כמו במבחן האמיתי
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              {lastExam ? (
                <p className="text-xs text-muted-foreground">
                  אחרון: {Math.round((lastExam.score / lastExam.total) * 100)}%
                </p>
              ) : null}
              <Button size="sm" variant="outline" className="text-xs h-8 mt-1 min-w-[60px] touch-manipulation">
                התחל
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Soft practice tip banner */}
        {showPracticeTip && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/20 p-3 text-sm text-amber-700 dark:text-amber-400">
            <span className="mt-0.5 text-base">💡</span>
            <p className="flex-1">טיפ: נסה להתחיל עם למידת המושגים לפני שתתרגל!</p>
            <button
              onClick={() => {
                setTipDismissed(true);
                localStorage.setItem(PRACTICE_TIP_DISMISSED_KEY, "true");
              }}
              className="shrink-0 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 touch-manipulation"
              aria-label="סגור"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Module sections — Python Fundamentals only */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-foreground">מסלול הלמידה</h2>
            <span className="text-xs text-muted-foreground font-mono">
              {pythonTrackProgress.modules.length} מודולים · {pythonTrackProgress.completionPct}%
            </span>
          </div>
          <Progress
            value={pythonTrackProgress.completionPct}
            aria-label="התקדמות כוללת יסודות פייתון"
            className="h-1 mb-3"
          />
          <TrackModuleList
            modules={pythonModules}
            topics={topics}
            questionCounts={questionCounts}
            learnMap={learnMap}
            isTopicUnlocked={isTopicUnlocked}
            isTopicComplete={isTopicComplete}
            onLearn={handleLearn}
            onPractice={handlePractice}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
