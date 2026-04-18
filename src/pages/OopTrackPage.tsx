import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTopicCompletion } from "@/hooks/useTopicCompletion";
import { getModulesByTrack } from "@/data/modules";
import { Progress } from "@/components/ui/progress";
import { TrackModuleList } from "@/components/TrackModuleList";
import { Home, ChevronLeft } from "lucide-react";
import { useTrackProgress } from "@/features/progress/hooks/useTrackProgress";

const OopTrackPage = () => {
  const navigate = useNavigate();
  const { topics, loading } = useSupabaseTopics();
  const { learnMap, questionCounts } = useDashboardData();
  const { isTopicUnlocked, isTopicComplete } = useTopicCompletion();

  const oopModules = useMemo(() => getModulesByTrack("python-oop"), []);
  const oopTrackProgress = useTrackProgress("python-oop");

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
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="h-32 rounded-2xl bg-muted" />
            <div className="h-20 rounded bg-muted" />
            <div className="h-20 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-4" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 space-y-6">
        {/* Breadcrumb */}
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
          <span className="px-1.5 py-1 font-semibold text-foreground">תכנות מונחה-עצמים</span>
        </nav>

        {/* Hero banner */}
        <header className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/15 to-fuchsia-500/5 p-6 space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 text-3xl shadow-[0_0_24px_rgba(217,70,239,0.15)]">
              🏛️
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                תכנות מונחה-עצמים
              </h1>
              <p className="font-mono text-sm text-muted-foreground" dir="ltr">
                Object-Oriented Programming
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            מחלקות, אובייקטים, ירושה, פולימורפיזם ודקורטורים — עקרונות OOP בפייתון.
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">התקדמות כוללת</span>
              <span className="font-mono font-semibold text-fuchsia-400">{oopTrackProgress.completionPct}%</span>
            </div>
            <Progress
              value={oopTrackProgress.completionPct}
              className="h-1.5 bg-white/[0.06] [&>div]:bg-fuchsia-500"
            />
            <p className="text-[11px] text-muted-foreground">
              {oopTrackProgress.modules.length} מודולים
            </p>
          </div>
        </header>

        {/* Module sections — same structure as Python Fundamentals */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">מסלול הלמידה</h2>
          <TrackModuleList
            modules={oopModules}
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

export default OopTrackPage;
