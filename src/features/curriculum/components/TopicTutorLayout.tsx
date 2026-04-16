import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Topic, Lesson, Module } from "../types";
import { TutorChat } from "./TutorChat";
import { CurriculumSidebar } from "./CurriculumSidebar";
import { useTopicProgress } from "../hooks/useTopicProgress";

interface TopicTutorLayoutProps {
  topic: Topic;
}

/**
 * Shared layout for every topic page. Renders:
 *   - A branded hero with the topic's gradient and description
 *   - A 2-column grid: curriculum sidebar + tutor chat
 *   - A lesson detail strip that updates as the student clicks lessons
 *
 * The layout is responsive: sidebar collapses on mobile, chat takes
 * the full width and a "Curriculum" button reveals the sidebar.
 */
export function TopicTutorLayout({ topic }: TopicTutorLayoutProps) {
  const navigate = useNavigate();
  const { completedLessonIds, markLessonComplete } = useTopicProgress(topic.id);

  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(
    () => topic.modules[0]?.lessons[0]?.id,
  );
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Keep the active lesson valid if the curriculum shape ever changes.
  useEffect(() => {
    const exists = topic.modules.some((m) =>
      m.lessons.some((l) => l.id === activeLessonId),
    );
    if (!exists) {
      setActiveLessonId(topic.modules[0]?.lessons[0]?.id);
    }
  }, [topic, activeLessonId]);

  const activeLessonDetail = useMemo(() => {
    for (const m of topic.modules) {
      const l = m.lessons.find((ll) => ll.id === activeLessonId);
      if (l) return { module: m, lesson: l };
    }
    return undefined;
  }, [topic, activeLessonId]);

  const handleSelectLesson = useCallback((lesson: Lesson, _module: Module) => {
    setActiveLessonId(lesson.id);
    setSidebarOpenMobile(false);
  }, []);

  const TopicIcon = topic.icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-24 md:pb-8">
      {/* Hero */}
      <section
        className={cn(
          "relative overflow-hidden bg-gradient-to-br text-white",
          topic.accent.gradient,
        )}
      >
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <Button
            size="sm"
            variant="ghost"
            className="text-white/90 hover:bg-white/20 hover:text-white mb-3 -ms-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 me-1" />
            Back
          </Button>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur shrink-0">
              <TopicIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{topic.name}</h1>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {topic.track === "python" ? "Python Track" : "DevOps Track"}
                </Badge>
              </div>
              <p className="text-sm md:text-base text-white/90 mt-1 max-w-2xl">
                {topic.description}
              </p>
              <div className="flex items-center gap-2 mt-3 text-xs text-white/80">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{topic.tutor.name}</span>
                <span>·</span>
                <span>{topic.tutor.title}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active lesson strip */}
      {activeLessonDetail && (
        <div className="border-b bg-muted/40">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-start gap-4 flex-wrap">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                {activeLessonDetail.module.title}
              </div>
              <div className="text-sm font-semibold">
                {activeLessonDetail.lesson.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {activeLessonDetail.lesson.description}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {activeLessonDetail.lesson.keyTerms.slice(0, 5).map((term) => (
                <Badge key={term} variant="outline" className="font-mono text-[10px]">
                  {term}
                </Badge>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() =>
                  markLessonComplete(
                    activeLessonDetail.module.id,
                    activeLessonDetail.lesson.id,
                  )
                }
                disabled={completedLessonIds.has(activeLessonDetail.lesson.id)}
              >
                {completedLessonIds.has(activeLessonDetail.lesson.id)
                  ? "Completed ✓"
                  : "Mark complete"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs md:hidden"
                onClick={() => setSidebarOpenMobile((v) => !v)}
              >
                {sidebarOpenMobile ? "Hide curriculum" : "Curriculum"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid gap-4 md:grid-cols-[280px_1fr]">
          <div
            className={cn(
              "md:block",
              sidebarOpenMobile ? "block" : "hidden",
              "h-[70vh] md:h-[75vh]",
            )}
          >
            <CurriculumSidebar
              topic={topic}
              completedLessonIds={completedLessonIds}
              activeLessonId={activeLessonId}
              onSelectLesson={handleSelectLesson}
            />
          </div>
          <div className="h-[70vh] md:h-[75vh]">
            <TutorChat topic={topic} activeLessonId={activeLessonId} />
          </div>
        </div>
      </div>
    </div>
  );
}
