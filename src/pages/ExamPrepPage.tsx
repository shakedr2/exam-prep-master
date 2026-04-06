import { useNavigate } from "react-router-dom";
import { useSupabaseTopics } from "@/hooks/useSupabaseTopics";
import { useSupabaseQuestionCount } from "@/hooks/useSupabaseQuestions";
import { topicTutorials } from "@/data/topicTutorials";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { BookOpen, GraduationCap, Target, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

function TopicRubricCard({
  topic,
  index,
}: {
  topic: { id: string; name: string; icon: string | null; description: string | null };
  index: number;
}) {
  const navigate = useNavigate();
  const count = useSupabaseQuestionCount(topic.id);
  const { progress, getTopicCompletion } = useProgress();
  const completion = getTopicCompletion(topic.id, count);

  const tutorial = topicTutorials.find((t) => t.topicId === topic.id);
  const introText = tutorial
    ? tutorial.introduction.length > 100
      ? tutorial.introduction.slice(0, 100) + "..."
      : tutorial.introduction
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-card border border-foreground/10 hover:border-primary/40 hover:shadow-md transition-all">
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{topic.icon ?? "📖"}</span>
              <div>
                <p className="font-bold text-foreground">{topic.name}</p>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {count} שאלות
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono text-muted-foreground">{completion}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={completion} className="h-1.5" />

          {/* Introduction */}
          {introText && (
            <p className="text-xs text-muted-foreground leading-relaxed">{introText}</p>
          )}

          {/* Concept badges */}
          {tutorial && tutorial.concepts.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tutorial.concepts.map((concept) => (
                <Badge key={concept.title} variant="secondary" className="text-[10px]">
                  {concept.title}
                </Badge>
              ))}
            </div>
          )}

          {/* Tutorial accordion */}
          {tutorial && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details" className="border-b-0">
                <AccordionTrigger className="text-xs text-muted-foreground py-2 hover:no-underline">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    פרטים נוספים
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-1">
                  {tutorial.quickTip && (
                    <div className="bg-primary/5 rounded-md p-3">
                      <p className="text-xs font-medium text-primary">טיפ מהיר</p>
                      <p className="text-xs text-muted-foreground mt-1">{tutorial.quickTip}</p>
                    </div>
                  )}
                  {tutorial.commonMistakes.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-foreground mb-1">טעויות נפוצות:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {tutorial.commonMistakes.map((mistake, i) => (
                          <li key={i} className="text-xs text-muted-foreground">
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Action button */}
          <Button
            size="sm"
            className="w-full"
            onClick={() => navigate(`/practice/${topic.id}`)}
          >
            <span className="flex items-center gap-2">
              התחל ללמוד
              <ChevronLeft className="h-4 w-4" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const ExamPrepPage = () => {
  const navigate = useNavigate();
  const { topics, loading } = useSupabaseTopics();

  if (loading) {
    return (
      <div className="min-h-screen pb-24 pt-4" dir="rtl">
        <div className="mx-auto max-w-2xl px-4 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-80" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 pt-4" dir="rtl">
      <div className="mx-auto max-w-2xl px-4 space-y-6">
        {/* Page header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">
              מפת הלימוד למבחן
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            סקירה מאורגנת של כל הנושאים, התוכן והשאלות
          </p>
        </div>

        {/* Topic rubric cards */}
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <TopicRubricCard key={topic.id} topic={topic} index={index} />
          ))}
        </div>

        {/* Exam simulation CTA */}
        <Card
          className="bg-card border border-foreground/10 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => navigate("/exam")}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">מבחן סימולציה</p>
                <p className="text-xs text-muted-foreground">
                  6 שאלות, 3 שעות — כמו במבחן האמיתי
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="text-xs h-7">
              התחל מבחן
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamPrepPage;
