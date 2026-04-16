import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Terminal,
  GitBranch,
  Network,
  Container,
  GitMerge,
  Cloud,
  Code2,
  FileCode2,
  Home,
  ChevronLeft,
  Lock,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * DevOpsTrackPage — Phase 10.2 / Issue #117
 *
 * Placeholder page for the DevOps Engineer learning track.
 * Shows the full 3-block, 8-phase structure from ROADMAP.md.
 * All phases are "coming soon" except Phase 1 (Python Fundamentals)
 * which links to the existing /dashboard.
 *
 * Language: English content, Hebrew UI chrome (bilingual per ROADMAP).
 */

interface DevOpsModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  lessonCount: number;
  status: "available" | "coming_soon" | "locked";
  route?: string;
  unlockCriteria?: string;
}

interface DevOpsPhase {
  id: string;
  block: "Foundation" | "Core" | "Advanced";
  phaseNumber: number;
  title: string;
  modules: DevOpsModule[];
}

const DEVOPS_PHASES: DevOpsPhase[] = [
  {
    id: "python-fundamentals",
    block: "Foundation",
    phaseNumber: 1,
    title: "Python Fundamentals",
    modules: [
      {
        id: "getting-started",
        title: "Variables & I/O",
        description: "Types, input/output, arithmetic",
        icon: <Code2 className="h-5 w-5" />,
        lessonCount: 8,
        status: "available",
        route: "/dashboard",
      },
      {
        id: "control-flow",
        title: "Control Flow",
        description: "Conditions, loops, logic",
        icon: <GitMerge className="h-5 w-5" />,
        lessonCount: 10,
        status: "available",
        route: "/dashboard",
      },
      {
        id: "data-structures",
        title: "Data Structures",
        description: "Strings, lists, dicts, sets",
        icon: <FileCode2 className="h-5 w-5" />,
        lessonCount: 12,
        status: "available",
        route: "/dashboard",
      },
    ],
  },
  {
    id: "linux-bash",
    block: "Foundation",
    phaseNumber: 2,
    title: "Linux & Bash",
    modules: [
      {
        id: "linux-basics",
        title: "Linux Basics",
        description: "cd, ls, pwd, file system navigation",
        icon: <Terminal className="h-5 w-5" />,
        lessonCount: 8,
        status: "coming_soon",
      },
      {
        id: "bash-scripting",
        title: "Bash Scripting",
        description: "grep, pipes, variables, scripts",
        icon: <Terminal className="h-5 w-5" />,
        lessonCount: 10,
        status: "coming_soon",
      },
      {
        id: "file-permissions",
        title: "File Permissions",
        description: "chmod, chown, users, groups",
        icon: <Terminal className="h-5 w-5" />,
        lessonCount: 6,
        status: "coming_soon",
      },
    ],
  },
  {
    id: "git",
    block: "Foundation",
    phaseNumber: 3,
    title: "Git & Version Control",
    modules: [
      {
        id: "git-basics",
        title: "Git Basics",
        description: "init, add, commit, status, log",
        icon: <GitBranch className="h-5 w-5" />,
        lessonCount: 8,
        status: "coming_soon",
      },
      {
        id: "git-branching",
        title: "Branching & Merging",
        description: "branch, merge, rebase, conflicts",
        icon: <GitBranch className="h-5 w-5" />,
        lessonCount: 10,
        status: "coming_soon",
      },
      {
        id: "git-remote",
        title: "Remote Workflows",
        description: "GitHub, pull requests, code review",
        icon: <GitBranch className="h-5 w-5" />,
        lessonCount: 8,
        status: "coming_soon",
      },
    ],
  },
  {
    id: "networking",
    block: "Core",
    phaseNumber: 4,
    title: "Networking Basics",
    modules: [
      {
        id: "tcp-ip",
        title: "TCP/IP & DNS",
        description: "IP addresses, ports, DNS resolution",
        icon: <Network className="h-5 w-5" />,
        lessonCount: 8,
        status: "locked",
        unlockCriteria: "סיים את שלב Git ובקרת גרסאות",
      },
      {
        id: "http",
        title: "HTTP & REST",
        description: "HTTP methods, status codes, APIs",
        icon: <Network className="h-5 w-5" />,
        lessonCount: 8,
        status: "locked",
        unlockCriteria: "סיים את שלב Git ובקרת גרסאות",
      },
    ],
  },
  {
    id: "docker",
    block: "Core",
    phaseNumber: 5,
    title: "Docker & Containers",
    modules: [
      {
        id: "docker-basics",
        title: "Docker Basics",
        description: "images, containers, Dockerfile",
        icon: <Container className="h-5 w-5" />,
        lessonCount: 10,
        status: "locked",
        unlockCriteria: "סיים את שלב רשתות בסיסיות",
      },
      {
        id: "docker-compose",
        title: "Docker Compose",
        description: "multi-container apps, networking",
        icon: <Container className="h-5 w-5" />,
        lessonCount: 8,
        status: "locked",
        unlockCriteria: "סיים את שלב רשתות בסיסיות",
      },
    ],
  },
  {
    id: "cicd",
    block: "Core",
    phaseNumber: 6,
    title: "CI/CD",
    modules: [
      {
        id: "github-actions",
        title: "GitHub Actions",
        description: "workflows, jobs, triggers",
        icon: <GitMerge className="h-5 w-5" />,
        lessonCount: 10,
        status: "locked",
        unlockCriteria: "סיים את שלב Docker ומיכלים",
      },
      {
        id: "jenkins",
        title: "Jenkins",
        description: "pipelines, agents, plugins",
        icon: <GitMerge className="h-5 w-5" />,
        lessonCount: 8,
        status: "locked",
        unlockCriteria: "סיים את שלב Docker ומיכלים",
      },
    ],
  },
  {
    id: "cloud",
    block: "Advanced",
    phaseNumber: 7,
    title: "Cloud (AWS/GCP)",
    modules: [
      {
        id: "aws-basics",
        title: "AWS Fundamentals",
        description: "EC2, S3, IAM, VPC",
        icon: <Cloud className="h-5 w-5" />,
        lessonCount: 12,
        status: "locked",
        unlockCriteria: "סיים את שלב CI/CD",
      },
      {
        id: "gcp-basics",
        title: "GCP Fundamentals",
        description: "Compute Engine, GCS, IAM",
        icon: <Cloud className="h-5 w-5" />,
        lessonCount: 10,
        status: "locked",
        unlockCriteria: "סיים את שלב CI/CD",
      },
    ],
  },
  {
    id: "iac",
    block: "Advanced",
    phaseNumber: 8,
    title: "Infrastructure as Code",
    modules: [
      {
        id: "terraform-basics",
        title: "Terraform",
        description: "providers, resources, state, modules",
        icon: <FileCode2 className="h-5 w-5" />,
        lessonCount: 12,
        status: "locked",
        unlockCriteria: "סיים את שלב ענן (AWS/GCP)",
      },
    ],
  },
];

const BLOCK_ORDER = ["Foundation", "Core", "Advanced"] as const;

const blockConfig = {
  Foundation: {
    label: "Foundation Block",
    sublabel: "Core skills every DevOps engineer needs",
    colorClass: "text-accent",
    borderClass: "border-accent/30",
    bgClass: "bg-accent/5",
  },
  Core: {
    label: "Core Block",
    sublabel: "Tools and practices used daily",
    colorClass: "text-primary",
    borderClass: "border-primary/30",
    bgClass: "bg-primary/5",
  },
  Advanced: {
    label: "Advanced Block",
    sublabel: "Cloud-scale infrastructure",
    colorClass: "text-warning",
    borderClass: "border-warning/30",
    bgClass: "bg-warning/5",
  },
} as const;

function ModuleRow({
  module,
  phaseNumber,
  moduleIndex,
  onNavigate,
}: {
  module: DevOpsModule;
  phaseNumber: number;
  moduleIndex: number;
  onNavigate?: () => void;
}) {
  const isAvailable = module.status === "available";
  const isComingSoon = module.status === "coming_soon";
  const isLocked = module.status === "locked";

  return (
    <motion.div
      whileHover={isAvailable ? { x: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "group flex items-center gap-4 rounded-xl border p-4 transition-colors duration-200",
        isAvailable
          ? "cursor-pointer border-foreground/10 bg-card hover:border-accent/40 hover:bg-accent/5"
          : "cursor-default border-foreground/5 bg-card/50 opacity-60",
      )}
      onClick={isAvailable ? onNavigate : undefined}
      role={isAvailable ? "button" : undefined}
      tabIndex={isAvailable ? 0 : undefined}
      onKeyDown={
        isAvailable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onNavigate?.();
            }
          : undefined
      }
    >
      {/* Phase + icon */}
      <div
        className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg",
          isAvailable
            ? "bg-accent/15 text-accent"
            : "bg-muted/50 text-muted-foreground",
        )}
      >
        {module.icon}
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            {`${phaseNumber}.${moduleIndex + 1}`}
          </span>
          {isComingSoon && (
            <Badge
              variant="secondary"
              className="h-4 px-1.5 text-[10px] text-muted-foreground"
            >
              Coming Soon
            </Badge>
          )}
        </div>
        <p className="truncate text-sm font-semibold text-foreground">
          {module.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {module.description}
        </p>
        {isLocked && module.unlockCriteria && (
          <p className="mt-0.5 text-[11px] text-muted-foreground/70 flex items-center gap-1">
            🔓 {module.unlockCriteria}
          </p>
        )}
      </div>

      {/* Lesson count / status */}
      <div className="flex flex-shrink-0 flex-col items-end gap-1">
        {isLocked ? (
          <Lock className="h-4 w-4 text-muted-foreground/50" />
        ) : isAvailable ? (
          <CheckCircle2 className="h-4 w-4 text-accent" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground/40" />
        )}
        <span className="font-mono text-[11px] text-muted-foreground">
          {module.lessonCount} lessons
        </span>
      </div>
    </motion.div>
  );
}

function PhaseSection({
  phase,
  navigate,
}: {
  phase: DevOpsPhase;
  navigate: (path: string) => void;
}) {
  const totalModules = phase.modules.length;
  const availableModules = phase.modules.filter(
    (m) => m.status === "available",
  ).length;
  const progressPercent = Math.round((availableModules / totalModules) * 100);
  const blockCfg = blockConfig[phase.block];

  return (
    <div className="space-y-3">
      {/* Phase header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold",
            blockCfg.borderClass,
            blockCfg.bgClass,
            blockCfg.colorClass,
          )}
        >
          {phase.phaseNumber}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">{phase.title}</p>
          <Progress
            value={progressPercent}
            className="mt-1 h-1 bg-muted [&>div]:bg-accent"
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {availableModules}/{totalModules}
        </span>
      </div>

      {/* Module rows */}
      <div className="space-y-2 ps-11">
        {phase.modules.map((mod, index) => (
          <ModuleRow
            key={mod.id}
            module={mod}
            phaseNumber={phase.phaseNumber}
            moduleIndex={index}
            onNavigate={mod.route ? () => navigate(mod.route!) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

const DevOpsTrackPage = () => {
  const navigate = useNavigate();

  const totalModules = DEVOPS_PHASES.reduce(
    (sum, p) => sum + p.modules.length,
    0,
  );
  const availableModules = DEVOPS_PHASES.reduce(
    (sum, p) => sum + p.modules.filter((m) => m.status === "available").length,
    0,
  );
  const overallPercent = Math.round((availableModules / totalModules) * 100);

  return (
    <div className="min-h-screen bg-background pb-24 pt-4" dir="ltr">
      <div className="mx-auto max-w-2xl px-4 space-y-6">
        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="flex items-center gap-1 text-xs text-muted-foreground"
          dir="rtl"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1 rounded px-1.5 py-1 hover:text-foreground hover:bg-foreground/5 transition-colors touch-manipulation"
          >
            <Home className="h-3.5 w-3.5" />
            <span>בית</span>
          </button>
          <ChevronLeft className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
          <span className="px-1.5 py-1 font-semibold text-foreground">
            DevOps Engineer
          </span>
        </nav>

        {/* Hero header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-2xl border border-foreground/10 bg-gradient-to-br from-accent/20 to-accent/5 p-6"
        >
          <p className="font-mono text-xs tracking-wide text-muted-foreground">
            // track.devops-engineer
          </p>
          <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
            DevOps Engineer
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            From Python scripting to cloud infrastructure. A complete path from
            zero to a job-ready DevOps engineer.
          </p>

          {/* Overall progress */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-mono font-semibold text-foreground">
                {overallPercent}%
              </span>
            </div>
            <Progress
              value={overallPercent}
              className="h-2 bg-muted [&>div]:bg-accent"
            />
            <p className="text-[11px] text-muted-foreground">
              {availableModules} of {totalModules} modules available
            </p>
          </div>
        </motion.header>

        {/* Block sections */}
        {BLOCK_ORDER.map((block) => {
          const blockPhases = DEVOPS_PHASES.filter((p) => p.block === block);
          const blockCfg = blockConfig[block];

          return (
            <motion.section
              key={block}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              aria-labelledby={`block-${block}`}
              className="space-y-5"
            >
              {/* Block header */}
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3",
                  blockCfg.borderClass,
                  blockCfg.bgClass,
                )}
              >
                <div className="flex-1">
                  <h2
                    id={`block-${block}`}
                    className={cn(
                      "text-sm font-bold uppercase tracking-wider",
                      blockCfg.colorClass,
                    )}
                  >
                    {blockCfg.label}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {blockCfg.sublabel}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-mono text-xs font-semibold",
                    blockCfg.colorClass,
                  )}
                >
                  {blockPhases.length} phases
                </span>
              </div>

              {/* Phases */}
              <div className="space-y-6">
                {blockPhases.map((phase) => (
                  <PhaseSection
                    key={phase.id}
                    phase={phase}
                    navigate={navigate}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}

        {/* Footer note */}
        <p className="pt-2 text-center font-mono text-[11px] text-muted-foreground">
          // more phases coming soon — stay tuned
        </p>
      </div>
    </div>
  );
};

export default DevOpsTrackPage;
