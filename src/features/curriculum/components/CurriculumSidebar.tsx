import { Check, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic, Lesson, Module } from "../types";

interface CurriculumSidebarProps {
  topic: Topic;
  /** Lesson ids the current user has completed. */
  completedLessonIds: Set<string>;
  /** Currently-focused lesson id. */
  activeLessonId?: string;
  /** Called when the learner picks a lesson from the sidebar. */
  onSelectLesson: (lesson: Lesson, module: Module) => void;
}

const LEVEL_LABELS: Record<Lesson["level"], string> = {
  beginner: "Beginner / מתחילים",
  intermediate: "Intermediate / בינוני",
  advanced: "Advanced / מתקדם",
};

const LEVEL_COLORS: Record<Lesson["level"], string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  advanced: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

/**
 * Left (or right, in RTL) rail showing the topic's full curriculum.
 *
 * Visual rules:
 *   - Completed lessons show a green check.
 *   - Active lesson is highlighted with the topic's accent ring.
 *   - A lesson is "locked" only if the PREVIOUS module has not been
 *     fully completed, to give the learner freedom inside a module
 *     but keep progression pressure across modules.
 */
export function CurriculumSidebar({
  topic,
  completedLessonIds,
  activeLessonId,
  onSelectLesson,
}: CurriculumSidebarProps) {
  const totalLessons = topic.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0,
  );
  const completedCount = topic.modules
    .flatMap((m) => m.lessons)
    .filter((l) => completedLessonIds.has(l.id)).length;

  const percent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

  return (
    <aside className="flex flex-col h-full rounded-2xl border bg-card overflow-hidden">
      <header className="px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">Curriculum / תכנית לימודים</h2>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              {completedCount} / {totalLessons} lessons
            </span>
            <span>{percent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full bg-gradient-to-r transition-[width]", topic.accent.gradient)}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </header>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {topic.modules.map((module, moduleIdx) => {
          const prev = topic.modules[moduleIdx - 1];
          const prevComplete =
            !prev || prev.lessons.every((l) => completedLessonIds.has(l.id));
          return (
            <ModuleSection
              key={module.id}
              module={module}
              moduleNumber={moduleIdx + 1}
              locked={!prevComplete}
              topic={topic}
              completedLessonIds={completedLessonIds}
              activeLessonId={activeLessonId}
              onSelectLesson={onSelectLesson}
            />
          );
        })}
      </nav>
    </aside>
  );
}

interface ModuleSectionProps {
  module: Module;
  moduleNumber: number;
  locked: boolean;
  topic: Topic;
  completedLessonIds: Set<string>;
  activeLessonId?: string;
  onSelectLesson: (lesson: Lesson, module: Module) => void;
}

function ModuleSection({
  module,
  moduleNumber,
  locked,
  topic,
  completedLessonIds,
  activeLessonId,
  onSelectLesson,
}: ModuleSectionProps) {
  return (
    <section>
      <div className="px-2 mb-1.5 flex items-center gap-2">
        <span className="text-[11px] font-mono text-muted-foreground">
          {String(moduleNumber).padStart(2, "0")}
        </span>
        <span className="text-xs font-semibold truncate">
          {module.emoji && <span className="mr-1">{module.emoji}</span>}
          {module.title}
        </span>
        {locked && <Lock className="h-3 w-3 text-muted-foreground" />}
      </div>
      <ul className="space-y-0.5">
        {module.lessons.map((lesson) => {
          const completed = completedLessonIds.has(lesson.id);
          const active = activeLessonId === lesson.id;
          return (
            <li key={lesson.id}>
              <button
                type="button"
                onClick={() => onSelectLesson(lesson, module)}
                disabled={locked && !completed}
                className={cn(
                  "w-full rounded-lg px-2 py-1.5 flex items-start gap-2 text-start transition-colors",
                  "hover:bg-muted focus:outline-none focus-visible:ring-2",
                  topic.accent.ring,
                  active && "bg-muted ring-2",
                  locked && !completed && "opacity-50 cursor-not-allowed",
                )}
              >
                <span className="mt-0.5">
                  {completed ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </span>
                <span className="flex-1 min-w-0 space-y-0.5">
                  <span className="block text-xs font-medium truncate">
                    {lesson.title}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <span
                      className={cn(
                        "inline-flex items-center rounded px-1 py-0",
                        LEVEL_COLORS[lesson.level],
                      )}
                    >
                      {LEVEL_LABELS[lesson.level]}
                    </span>
                    <span>·</span>
                    <span>{lesson.practiceQuestions}q</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
