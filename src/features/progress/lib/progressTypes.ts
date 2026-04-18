export type TrackId = "python" | "oop" | "devops";

export interface TopicProgress {
  topicId: string;
  correct: number;
  attempted: number;
  totalQuestions: number;
  completionPct: number;
}

export interface ModuleProgress {
  moduleId: string;
  topics: TopicProgress[];
  totalQuestions: number;
  correct: number;
  completionPct: number;
}

export interface TrackProgress {
  trackId: TrackId;
  modules: ModuleProgress[];
  totalQuestions: number;
  correct: number;
  completionPct: number;
}

export interface ResumeTarget {
  trackId: TrackId;
  moduleId: string | null;
  topicId: string | null;
}
