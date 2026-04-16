import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  ChevronLeft,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * OopTrackPage — Issue #266
 *
 * Dashboard page for the Python OOP track.
 * Shows 8 OOP modules with progress.
 */

interface OopModule {
  id: string;
  titleHe: string;
  title: string;
  descriptionHe: string;
  description: string;
  icon: string;
  status: "available" | "coming-soon";
  route?: string;
}

const OOP_MODULES: OopModule[] = [
  {
    id: "oop-intro",
    titleHe: "מבוא לתכנות מונחה-עצמים",
    title: "Introduction to OOP",
    descriptionHe: "למה משתמשים באובייקטים ואיך זה שונה מחשיבה פרוצדורלית",
    description: "Why OOP? Procedural vs Object-Oriented thinking",
    icon: "🏛️",
    status: "available",
    route: "/topics/python",
  },
  {
    id: "classes-objects",
    titleHe: "מחלקות ואובייקטים",
    title: "Classes and Objects",
    descriptionHe: "הגדרת מחלקה, יצירת מופעים, __init__, משתני מופע ומחלקה",
    description: "Defining classes, creating instances, __init__, instance vs class attributes",
    icon: "📦",
    status: "available",
    route: "/topics/python",
  },
  {
    id: "methods",
    titleHe: "מתודות",
    title: "Methods",
    descriptionHe: "מתודות מופע, self, מתודות מחלקה ומתודות סטטיות",
    description: "Instance methods, self, @classmethod, @staticmethod",
    icon: "⚙️",
    status: "available",
    route: "/topics/python",
  },
  {
    id: "encapsulation",
    titleHe: "אנקפסולציה",
    title: "Encapsulation",
    descriptionHe: "תכונות פרטיות, getters/setters, דקורטור @property",
    description: "Private attributes, getters & setters, @property decorator",
    icon: "🔒",
    status: "available",
    route: "/topics/python",
  },
  {
    id: "inheritance",
    titleHe: "ירושה",
    title: "Inheritance",
    descriptionHe: "מחלקת בסיס ומחלקה יורשת, super(), דריסת מתודות",
    description: "Base & derived classes, super(), method overriding",
    icon: "🌳",
    status: "available",
    route: "/topics/python",
  },
  {
    id: "polymorphism",
    titleHe: "פולימורפיזם",
    title: "Polymorphism",
    descriptionHe: "Duck typing, מחלקות מופשטות (ABC), ממשקים",
    description: "Duck typing, abstract classes (ABC), interface patterns",
    icon: "🦆",
    status: "available",
    route: "/topics/python",
  },
  {
    id: "dunder",
    titleHe: "מתודות מיוחדות (Dunder)",
    title: "Special / Dunder Methods",
    descriptionHe: "__str__, __repr__, __eq__, __len__, context managers",
    description: "__str__, __repr__, __eq__, __len__, context managers",
    icon: "✨",
    status: "available",
    route: "/topics/python",
  },
  {
    id: "patterns",
    titleHe: "תבניות עיצוב ב-OOP",
    title: "OOP Design Patterns",
    descriptionHe: "Singleton, Factory, Observer — מתי ואיך להשתמש",
    description: "Singleton, Factory, Observer — when and how to apply",
    icon: "🎨",
    status: "available",
    route: "/topics/python",
  },
];

function ModuleRow({
  mod,
  index,
  navigate,
}: {
  mod: OopModule;
  index: number;
  navigate: (path: string) => void;
}) {
  const isAvailable = mod.status === "available";

  return (
    <motion.button
      type="button"
      onClick={isAvailable && mod.route ? () => navigate(mod.route!) : undefined}
      disabled={!isAvailable}
      whileHover={isAvailable ? { x: -4 } : undefined}
      whileTap={isAvailable ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn(
        "group relative w-full rounded-xl border text-right",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        isAvailable
          ? "border-white/[0.08] bg-white/[0.03] hover:border-fuchsia-500/30 hover:bg-white/[0.06] cursor-pointer"
          : "border-white/[0.04] bg-white/[0.01] cursor-not-allowed opacity-50",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Index + status icon */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <span className="font-mono text-[10px] text-muted-foreground/60">
            {String(index + 1).padStart(2, "0")}
          </span>
          {isAvailable ? (
            <CheckCircle2 className="h-4 w-4 text-fuchsia-400/70" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/30" />
          )}
        </div>

        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-xl">
          {mod.icon}
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {mod.titleHe}
            </h3>
            {!isAvailable && (
              <Badge variant="outline" className="shrink-0 text-[10px]">
                בקרוב
              </Badge>
            )}
          </div>
          <p className="font-mono text-[11px] text-muted-foreground/60" dir="ltr">
            {mod.title}
          </p>
          <p className="text-xs text-muted-foreground">{mod.descriptionHe}</p>
        </div>
      </div>
    </motion.button>
  );
}

const OopTrackPage = () => {
  const navigate = useNavigate();

  const availableCount = OOP_MODULES.filter((m) => m.status === "available").length;
  const progressPercent = Math.round((availableCount / OOP_MODULES.length) * 100);

  return (
    <div className="min-h-screen bg-background pb-24 pt-6" dir="rtl">
      <div className="mx-auto max-w-3xl space-y-8 px-4">
        {/* Back nav */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>בית</span>
          </button>
          <ChevronLeft className="h-3.5 w-3.5 opacity-50" />
          <span className="text-foreground font-medium">תכנות מונחה-עצמים</span>
        </nav>

        {/* Header */}
        <header className="space-y-3">
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
            מחלקות, אובייקטים, ירושה, פולימורפיזם ואנקפסולציה — עקרונות OOP בפייתון.
          </p>

          {/* Progress bar */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {availableCount} מתוך {OOP_MODULES.length} מודולים זמינים
              </span>
              <span className="font-mono font-semibold text-fuchsia-400">
                {progressPercent}%
              </span>
            </div>
            <Progress
              value={progressPercent}
              className="h-1.5 bg-white/[0.06] [&>div]:bg-fuchsia-500"
            />
          </div>
        </header>

        {/* Modules list */}
        <section className="space-y-3" aria-label="מודולי OOP">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
            מודולים
          </h2>
          <div className="space-y-2">
            {OOP_MODULES.map((mod, i) => (
              <ModuleRow
                key={mod.id}
                mod={mod}
                index={i}
                navigate={navigate}
              />
            ))}
          </div>
        </section>

        <p className="pt-2 text-center font-mono text-[11px] text-muted-foreground">
          // עוד תרגול ושאלות לכל מודול בקרוב
        </p>
      </div>
    </div>
  );
};

export default OopTrackPage;
