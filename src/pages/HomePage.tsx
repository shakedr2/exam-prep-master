import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  ArrowLeft,
  Lock,
  Sparkles,
  BookOpen,
  Target,
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import { MODULES } from "@/data/modules";
import { questions as staticQuestions } from "@/data/questions";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * HomePage — Phase 10.2
 *
 * Top-level landing for the app. Surfaces the available learning Tracks
 * and lets the learner drill into one. Currently exposes two tracks:
 *
 *   1. Python Fundamentals  → links to the existing Dashboard
 *   2. DevOps Engineer      → "Coming Soon" placeholder
 *
 * Design intent (Phase 10.2, Issue #117):
 *   • Hebrew-first RTL layout, unique visual identity (not SoloLearn).
 *   • Cards use the design-token gradient utilities
 *     (`gradient-primary`, `gradient-accent`) and `shadow-glow-*`
 *     on hover — no hardcoded colors.
 *   • Responsive: 1 column on mobile, 2 columns on tablet/desktop.
 *   • Code-inspired accents (mono English labels, `//` comment marks)
 *     to reinforce the programming-education identity.
 */

type TrackCardProps = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  gradientClass: string;
  glowClass: string;
  stats?: { label: string; value: string }[];
  progressPercent?: number;
  comingSoon?: boolean;
  comingSoonLabel?: string;
  onSelect?: () => void;
};

function TrackCard({
  name,
  slug,
  tagline,
  description,
  icon,
  gradientClass,
  glowClass,
  stats,
  progressPercent,
  comingSoon = false,
  comingSoonLabel,
  onSelect,
}: TrackCardProps) {
  const interactive = !comingSoon && !!onSelect;

  return (
    <motion.button
      type="button"
      onClick={interactive ? onSelect : undefined}
      disabled={!interactive}
      aria-label={name}
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-foreground/10 text-right",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "transition-shadow duration-300",
        interactive
          ? cn("cursor-pointer hover:border-foreground/20", glowClass)
          : "cursor-not-allowed",
      )}
    >
      {/* Gradient background layer */}
      <div
        className={cn(
          "absolute inset-0",
          gradientClass,
          comingSoon && "opacity-40",
        )}
        aria-hidden="true"
      />

      {/* Decorative dot pattern — reinforces unique identity, no hardcoded colors */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "16px 16px",
          color: "hsl(0 0% 100%)",
        }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col gap-5 p-6 text-primary-foreground sm:p-7">
        {/* Header row: icon + status badge */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl",
              "bg-white/15 backdrop-blur-sm ring-1 ring-white/25",
              "transition-transform duration-300",
              interactive && "group-hover:scale-110 group-hover:rotate-[-3deg]",
            )}
          >
            {icon}
          </div>
          {comingSoon ? (
            <Badge
              variant="secondary"
              className="gap-1 border-0 bg-white/20 text-primary-foreground backdrop-blur-sm"
            >
              <Lock className="h-3 w-3" />
              {comingSoonLabel ?? "בקרוב"}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="gap-1 border-0 bg-white/20 text-primary-foreground backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3" />
              זמין
            </Badge>
          )}
        </div>

        {/* Title + code-comment tagline */}
        <div className="space-y-1.5">
          <p
            className="font-mono text-xs tracking-wide text-primary-foreground/70"
            dir="ltr"
          >
            // {tagline}
          </p>
          <h3 className="text-2xl font-bold leading-tight sm:text-3xl">
            {name}
          </h3>
          <p className="font-mono text-[11px] text-primary-foreground/60" dir="ltr">
            track.{slug}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-primary-foreground/90 sm:text-base">
          {description}
        </p>

        {/* Progress — only for active tracks with a meaningful number */}
        {!comingSoon && typeof progressPercent === "number" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary-foreground/80">התקדמות</span>
              <span className="font-mono font-semibold">{progressPercent}%</span>
            </div>
            <Progress
              value={progressPercent}
              className="h-1.5 bg-white/20 [&>div]:bg-white"
            />
          </div>
        )}

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm"
              >
                <p className="font-mono text-lg font-bold leading-none">
                  {s.value}
                </p>
                <p className="mt-1 text-[11px] text-primary-foreground/75">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold">
            {comingSoon ? "בקרוב נוסיף את המסלול" : "התחל מסלול"}
          </span>
          {!comingSoon && (
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm",
                "transition-transform duration-300 group-hover:-translate-x-1",
              )}
              aria-hidden="true"
            >
              <ArrowLeft className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

const HomePage = () => {
  const navigate = useNavigate();
  const { progress, totalCorrect, totalAnswered } = useProgress();

  // Python track progress: share of static Python-topic questions that the
  // learner has answered correctly. Using staticQuestions as the denominator
  // matches the approach in DashboardPage and gives a stable, meaningful
  // percentage without needing an extra Supabase query on the landing page.
  const pythonPercent = useMemo(() => {
    const pythonTopicIds = new Set(
      MODULES.filter((m) => !m.comingSoon).flatMap((m) => m.topicIds),
    );
    const pythonQuestionIds = new Set(
      staticQuestions
        .filter((q) => pythonTopicIds.has(q.topic))
        .map((q) => q.id),
    );
    if (pythonQuestionIds.size === 0) return 0;

    const answeredCorrect = Object.entries(progress.answeredQuestions).filter(
      ([id, v]) => pythonQuestionIds.has(id) && v.correct,
    ).length;

    return Math.round((answeredCorrect / pythonQuestionIds.size) * 100);
  }, [progress.answeredQuestions]);

  const handlePythonTrack = () => {
    if (!progress.username) {
      navigate("/onboarding");
      return;
    }
    navigate("/dashboard");
  };

  const greeting = progress.username ? `שלום, ${progress.username}` : "ברוכים הבאים";

  return (
    <div className="min-h-screen bg-background pb-24 pt-6" dir="rtl">
      <div className="mx-auto max-w-5xl px-4">
        {/* Hero / header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 space-y-3 sm:mb-10"
        >
          <p
            className="font-mono text-xs tracking-wide text-muted-foreground"
            dir="ltr"
          >
            // exam-prep-master / home
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {greeting}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            בחר מסלול למידה כדי להתחיל. כל מסלול בנוי משלבים, מודולים ושאלות תרגול
            — הכל בעברית, עם משוב מיידי.
          </p>

          {/* Quick stats strip (only if learner has activity) */}
          {totalAnswered > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-3 py-1.5 text-xs text-muted-foreground">
                <Target className="h-3.5 w-3.5 text-primary" />
                <span>
                  <span className="font-mono font-semibold text-foreground">
                    {totalCorrect}
                  </span>
                  {" "}
                  שאלות נפתרו נכון
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-3 py-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5 text-accent" />
                <span>
                  מתוך{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {totalAnswered}
                  </span>
                </span>
              </div>
            </div>
          )}
        </motion.header>

        {/* Tracks section */}
        <section aria-labelledby="tracks-heading" className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2
              id="tracks-heading"
              className="text-lg font-bold text-foreground sm:text-xl"
            >
              מסלולי למידה
            </h2>
            <span
              className="font-mono text-[11px] text-muted-foreground"
              dir="ltr"
            >
              tracks[]
            </span>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TrackCard
                name="יסודות פייתון"
                slug="python-fundamentals"
                tagline="Python Fundamentals"
                description="משתנים, תנאים, לולאות, מחרוזות, רשימות ופונקציות — הכנה מלאה למבחן האוניברסיטה הפתוחה."
                icon={<Code2 className="h-7 w-7" />}
                gradientClass="gradient-primary"
                glowClass="hover:shadow-glow-primary"
                progressPercent={pythonPercent}
                stats={[
                  { label: "שאלות נכונות", value: String(totalCorrect) },
                  { label: "סה״כ תרגולים", value: String(totalAnswered) },
                ]}
                onSelect={handlePythonTrack}
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TrackCard
                name="מהנדס DevOps"
                slug="devops-engineer"
                tagline="DevOps Engineer"
                description="Linux, Git, רשתות, Docker, CI/CD, ענן ו‑Infrastructure as Code. מסלול שלם מ‑0 למהנדס."
                icon={<Server className="h-7 w-7" />}
                gradientClass="gradient-accent"
                glowClass="hover:shadow-glow-accent"
                comingSoon
                comingSoonLabel="בקרוב"
              />
            </motion.div>
          </motion.div>

          {/* Subtle footer note */}
          <p
            className="pt-4 text-center font-mono text-[11px] text-muted-foreground"
            dir="ltr"
          >
            // more tracks coming soon — stay tuned
          </p>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
