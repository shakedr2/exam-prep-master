import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Target,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/contexts/AuthContext";
import { MODULES } from "@/data/modules";
import { questions as staticQuestions } from "@/data/questions";
import { Progress } from "@/components/ui/progress";
import { HeroFrame } from "@/shared/components/HeroFrame";
import { cn } from "@/lib/utils";

/* ── 3D SVG Logos ────────────────────────────────────── */

function PythonLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn("drop-shadow-[0_4px_12px_rgba(124,92,252,0.4)]", className)}
      style={{
        perspective: "600px",
      }}
    >
      <svg
        viewBox="0 0 110 110"
        className="h-full w-full"
        style={{
          transform: "rotateY(-12deg) rotateX(5deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <defs>
          <linearGradient id="py-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4B8BBE" />
            <stop offset="100%" stopColor="#306998" />
          </linearGradient>
          <linearGradient id="py-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD43B" />
            <stop offset="100%" stopColor="#FFE873" />
          </linearGradient>
        </defs>
        {/* Blue snake (top-left) */}
        <path
          d="M54.9 3.3C28.5 3.3 30.6 14.9 30.6 14.9l.03 12h24.8v3.6H18.8S3 28 3 54.7c0 26.7 13.8 25.8 13.8 25.8h8.2V67.8s-.4-13.8 13.6-13.8h23.4s13.2.2 13.2-12.8V18.4S77.7 3.3 54.9 3.3zm-13 8.7c2.4 0 4.3 1.9 4.3 4.3 0 2.4-1.9 4.3-4.3 4.3-2.4 0-4.3-1.9-4.3-4.3 0-2.4 1.9-4.3 4.3-4.3z"
          fill="url(#py-blue)"
        />
        {/* Yellow snake (bottom-right) */}
        <path
          d="M55.1 106.7c26.4 0 24.3-11.6 24.3-11.6l-.03-12H54.6v-3.6h36.6S107 82 107 55.3c0-26.7-13.8-25.8-13.8-25.8h-8.2v12.7s.4 13.8-13.6 13.8H48s-13.2-.2-13.2 12.8v22.8s-2.4 15.1 20.3 15.1zm13-8.7c-2.4 0-4.3-1.9-4.3-4.3 0-2.4 1.9-4.3 4.3-4.3 2.4 0 4.3 1.9 4.3 4.3 0 2.4-1.9 4.3-4.3 4.3z"
          fill="url(#py-yellow)"
        />
      </svg>
    </div>
  );
}

function OopLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn("drop-shadow-[0_4px_12px_rgba(217,70,239,0.35)]", className)}
      style={{
        perspective: "600px",
      }}
    >
      <svg
        viewBox="0 0 110 110"
        className="h-full w-full"
        style={{
          transform: "rotateY(-10deg) rotateX(6deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <defs>
          <linearGradient id="oop-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="oop-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        {/* Outer class box */}
        <rect x="8" y="8" width="94" height="94" rx="12" fill="url(#oop-grad2)" opacity="0.25" />
        {/* Class header bar */}
        <rect x="8" y="8" width="94" height="26" rx="10" fill="url(#oop-grad1)" />
        {/* «class» keyword text area (abstract chevrons) */}
        <text x="55" y="25" textAnchor="middle" fontSize="10" fill="white" fontFamily="monospace" fontWeight="bold">
          class
        </text>
        {/* Inheritance arrow pointing down */}
        <line x1="55" y1="38" x2="55" y2="70" stroke="url(#oop-grad1)" strokeWidth="3" strokeDasharray="4 2" />
        <polygon points="49,68 55,78 61,68" fill="#d946ef" />
        {/* Child class box */}
        <rect x="26" y="78" width="58" height="24" rx="8" fill="url(#oop-grad1)" opacity="0.7" />
        <text x="55" y="94" textAnchor="middle" fontSize="9" fill="white" fontFamily="monospace" fontWeight="bold">
          object
        </text>
      </svg>
    </div>
  );
}

function DevOpsLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn("drop-shadow-[0_4px_12px_rgba(124,92,252,0.3)]", className)}
      style={{
        perspective: "600px",
      }}
    >
      <svg
        viewBox="0 0 120 60"
        className="h-full w-full"
        style={{
          transform: "rotateY(12deg) rotateX(5deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <defs>
          <linearGradient id="devops-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c5cfc" />
            <stop offset="50%" stopColor="#9b7fff" />
            <stop offset="100%" stopColor="#7c5cfc" />
          </linearGradient>
        </defs>
        {/* Infinity loop */}
        <path
          d="M30 30c0-11 8.9-20 20-20s20 9 20 20-8.9 20-20 20"
          fill="none"
          stroke="url(#devops-grad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M90 30c0 11-8.9 20-20 20s-20-9-20-20 8.9-20 20-20"
          fill="none"
          stroke="url(#devops-grad)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Arrow on the loop */}
        <polygon
          points="82,18 90,14 86,22"
          fill="#9b7fff"
        />
        <polygon
          points="38,42 30,46 34,38"
          fill="#9b7fff"
        />
      </svg>
    </div>
  );
}

/* ── TrackCard (glass-morphism) ───────────────────────── */

type TrackCardProps = {
  nameHe: string;
  nameEn: string;
  description: string;
  logo: React.ReactNode;
  accentColor: string; // for glow border on hover
  moduleCount?: number;
  progressPercent?: number;
  comingSoon?: boolean;
  onSelect?: () => void;
};

function TrackCard({
  nameHe,
  nameEn,
  description,
  logo,
  accentColor,
  moduleCount,
  progressPercent,
  comingSoon = false,
  onSelect,
}: TrackCardProps) {
  const { t } = useTranslation();
  const interactive = !comingSoon && !!onSelect;

  return (
    <motion.button
      type="button"
      onClick={interactive ? onSelect : undefined}
      disabled={!interactive}
      aria-label={nameHe}
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl text-right",
        "border border-white/[0.08] bg-white/[0.03]",
        "backdrop-blur-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "transition-all duration-300",
        interactive
          ? "cursor-pointer hover:border-white/[0.15] hover:bg-white/[0.05]"
          : "cursor-not-allowed opacity-60",
      )}
      style={
        interactive
          ? ({
              "--glow-color": accentColor,
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Hover glow effect (CSS-driven for performance) */}
      {interactive && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
          style={{
            boxShadow: `inset 0 0 0 1px ${accentColor}33, 0 0 20px ${accentColor}1a`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 p-5 sm:p-6">
        {/* Top row: logo + coming soon badge */}
        <div className="flex items-start justify-between">
          <div className="h-12 w-12 sm:h-14 sm:w-14 transition-transform duration-300 group-hover:scale-105">
            {logo}
          </div>
          {comingSoon && (
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur-sm">
              {t("common.comingSoon")}
            </span>
          )}
        </div>

        {/* Title block */}
        <div className="space-y-0.5">
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            {nameHe}
          </h3>
          <p className="font-mono text-xs text-muted-foreground" dir="ltr">
            {nameEn}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Progress bar */}
        {!comingSoon && typeof progressPercent === "number" && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("common.progress")}</span>
              <span className="font-mono font-semibold text-foreground">
                {progressPercent}%
              </span>
            </div>
            <Progress
              value={progressPercent}
              className="h-1.5 bg-white/[0.08] [&>div]:bg-primary"
            />
          </div>
        )}

        {/* Footer: module count + arrow */}
        <div className="flex items-center justify-between pt-1">
          {typeof moduleCount === "number" && (
            <span className="font-mono text-xs text-muted-foreground">
              {moduleCount} {t("common.modules")}
            </span>
          )}
          {!comingSoon && (
            <span
              className={cn(
                "mr-auto flex h-8 w-8 items-center justify-center rounded-full",
                "border border-white/[0.08] bg-white/[0.04]",
                "transition-all duration-300",
                "group-hover:border-white/[0.15] group-hover:bg-white/[0.08] group-hover:-translate-x-1",
              )}
              aria-hidden="true"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ── HomePage ─────────────────────────────────────────── */

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, totalCorrect, totalAnswered } = useProgress();

  const pythonPercent = useMemo(() => {
    const pythonTopicIds = new Set(
      MODULES.filter((m) => !m.comingSoon && m.track === "python-fundamentals").flatMap((m) => m.topicIds),
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

  const pythonModuleCount = MODULES.filter((m) => !m.comingSoon && m.track === "python-fundamentals").length;

  const oopPercent = useMemo(() => {
    const oopTopicIds = new Set(
      MODULES.filter((m) => !m.comingSoon && m.track === "python-oop").flatMap((m) => m.topicIds),
    );
    const oopQuestionIds = new Set(
      staticQuestions
        .filter((q) => oopTopicIds.has(q.topic))
        .map((q) => q.id),
    );
    if (oopQuestionIds.size === 0) return 0;

    const answeredCorrect = Object.entries(progress.answeredQuestions).filter(
      ([id, v]) => oopQuestionIds.has(id) && v.correct,
    ).length;

    return Math.round((answeredCorrect / oopQuestionIds.size) * 100);
  }, [progress.answeredQuestions]);

  const oopModuleCount = MODULES.filter((m) => !m.comingSoon && m.track === "python-oop").length;

  const devopsModuleCount = MODULES.filter((m) => !m.comingSoon && m.track === "devops").length;

  const handlePythonTrack = () => {
    if (!user && !progress.username) {
      navigate("/onboarding");
      return;
    }
    navigate("/dashboard");
  };

  const greeting = progress.username
    ? t("home.greeting", { name: progress.username })
    : t("home.welcome");

  return (
    <div className="min-h-screen bg-background pb-24 pt-6">
      <div className="mx-auto max-w-5xl space-y-8 px-4 sm:space-y-10">
        {/* Hero */}
        <HeroFrame
          variant="python"
          eyebrow={t("home.heroEyebrow")}
          title={
            <>
              <span className="block">{greeting}</span>
              <span className="mt-1 block text-[0.85em] font-semibold text-white/80">
                {t("home.heroPractice")}
              </span>
            </>
          }
          subtitle={
            <span className="text-white/80">
              {t("home.heroSubtitle")}
            </span>
          }
          actions={
            totalAnswered > 0 ? (
              <>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                  <Target className="h-3.5 w-3.5" />
                  <span>
                    <span className="font-mono font-semibold">
                      {totalCorrect}
                    </span>{" "}
                    {t("home.questionsSolved")}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>
                    {t("home.outOf")}{" "}
                    <span className="font-mono font-semibold">
                      {totalAnswered}
                    </span>
                  </span>
                </div>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white/90 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{t("home.readyToStart")}</span>
              </div>
            )
          }
        />

        {/* Track cards */}
        <section aria-labelledby="tracks-heading" className="space-y-5">
          <h2
            id="tracks-heading"
            className="text-lg font-bold text-foreground sm:text-xl"
          >
            {t("home.learningPaths")}
          </h2>

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
                nameHe={t("home.pythonName")}
                nameEn="Python Fundamentals"
                description={t("home.pythonDescription")}
                logo={<PythonLogo />}
                accentColor="#7c5cfc"
                progressPercent={pythonPercent}
                moduleCount={pythonModuleCount}
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
                nameHe={t("home.devopsName")}
                nameEn="DevOps Engineer"
                description={t("home.devopsDescription")}
                logo={<DevOpsLogo />}
                accentColor="#7c5cfc"
                moduleCount={devopsModuleCount}
                onSelect={() => navigate("/tracks/devops")}
              />
            </motion.div>
          </motion.div>

          <p
            className="pt-4 text-center font-mono text-[11px] text-muted-foreground"
            dir="ltr"
          >
            // more tracks coming soon — stay tuned
          </p>
        </section>

        {/* Footer */}
        <footer className="pt-4 pb-2 text-center text-xs text-muted-foreground/60 space-x-3 space-x-reverse">
          <Link to="/terms" className="hover:text-muted-foreground transition-colors">
            {t("common.termsOfService")}
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
