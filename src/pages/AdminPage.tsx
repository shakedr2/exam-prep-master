import { useState } from "react";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { topics } from "@/data/questions";
import { AlertTriangle } from "lucide-react";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

const AdminPage = () => {
  const { progress } = useProgress();
  const isAdmin = ADMIN_EMAIL && progress.username === ADMIN_EMAIL;

  const [form, setForm] = useState({
    topic: "",
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct: "",
    explanation: "",
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-6 pb-24">
      <div className="mx-auto max-w-2xl px-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Admin area — connect Supabase tables to enable full functionality.
          </p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Topic</Label>
              <Select onValueChange={(v) => setForm((f) => ({ ...f, topic: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select topic" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Question Text</Label>
              <Textarea
                placeholder="Enter question..."
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
              />
            </div>
            {(["A", "B", "C", "D"] as const).map((letter) => {
              const key = `option${letter}` as "optionA" | "optionB" | "optionC" | "optionD";
              return (
                <div key={letter} className="space-y-1.5">
                  <Label>Option {letter}</Label>
                  <Input
                    placeholder={`Option ${letter}`}
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              );
            })}
            <div className="space-y-1.5">
              <Label>Correct Answer</Label>
              <Select onValueChange={(v) => setForm((f) => ({ ...f, correct: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Explanation</Label>
              <Textarea
                placeholder="Explain why this is correct..."
                value={form.explanation}
                onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))}
              />
            </div>
            <Button className="w-full" disabled>
              Add Question (connect Supabase to enable)
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Questions Database</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No questions in database yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
