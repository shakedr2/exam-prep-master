import type { TopicId } from "./questions";

export type TrackId = "python-fundamentals" | "python-oop" | "devops";

export interface Module {
  id: string;
  title: string;
  description: string;
  topicIds: TopicId[];
  order: number;
  icon: string;
  comingSoon?: boolean;
  track?: TrackId;
}

export const MODULES: Module[] = [
  // ── Python Fundamentals ──────────────────────────────
  {
    id: "getting_started",
    title: "צעדים ראשונים",
    description: "משתנים, טיפוסים, קלט/פלט וחשבון",
    topicIds: ["variables_io", "arithmetic"],
    order: 1,
    icon: "👣",
    track: "python-fundamentals",
  },
  {
    id: "control_flow",
    title: "בקרת זרימה",
    description: "תנאים ולולאות",
    topicIds: ["conditions", "loops"],
    order: 2,
    icon: "🔀",
    track: "python-fundamentals",
  },
  {
    id: "data_structures",
    title: "מבני נתונים",
    description: "מחרוזות, רשימות, טאפלים, סטים ומילונים",
    topicIds: ["strings", "lists", "tuples_sets_dicts"],
    order: 3,
    icon: "🗃️",
    track: "python-fundamentals",
  },
  {
    id: "functions_module",
    title: "פונקציות",
    description: "הגדרת פונקציות, פרמטרים וערכי החזרה",
    topicIds: ["functions"],
    order: 4,
    icon: "🧩",
    track: "python-fundamentals",
  },
  {
    id: "code_tracing",
    title: "מעקב קוד",
    description: "מעקב ביצוע וחישובים מתמטיים",
    topicIds: ["tracing", "math"],
    order: 5,
    icon: "🔍",
    track: "python-fundamentals",
  },
  {
    id: "files_exceptions",
    title: "קבצים וחריגות",
    description: "טיפול בקבצים ו-try/except",
    topicIds: ["files_exceptions"],
    order: 6,
    icon: "📂",
    track: "python-fundamentals",
  },

  // ── Python OOP ───────────────────────────────────────
  {
    id: "classes_objects",
    title: "מחלקות ואובייקטים",
    description: "הגדרת מחלקה, יצירת מופעים, __init__, משתני מופע",
    topicIds: ["classes_objects"],
    order: 7,
    icon: "📦",
    track: "python-oop",
  },
  {
    id: "inheritance",
    title: "ירושה",
    description: "מחלקת בסיס ומחלקה יורשת, super(), דריסת מתודות",
    topicIds: ["inheritance"],
    order: 8,
    icon: "🌳",
    track: "python-oop",
  },
  {
    id: "polymorphism",
    title: "פולימורפיזם",
    description: "Duck typing, מחלקות מופשטות (ABC), ממשקים",
    topicIds: ["polymorphism"],
    order: 9,
    icon: "🦆",
    track: "python-oop",
  },
  {
    id: "decorators_special",
    title: "דקורטורים ומתודות מיוחדות",
    description: "דקורטורים, @property, __str__, __repr__, __eq__",
    topicIds: ["decorators_special"],
    order: 10,
    icon: "✨",
    track: "python-oop",
  },

  // ── DevOps ───────────────────────────────────────────
  {
    id: "linux_basics",
    title: "יסודות לינוקס",
    description: "cd, ls, pwd, ניווט במערכת הקבצים",
    topicIds: ["linux_basics"],
    order: 11,
    icon: "🐧",
    track: "devops",
  },
  {
    id: "file_permissions",
    title: "הרשאות קבצים",
    description: "chmod, chown, משתמשים, קבוצות",
    topicIds: ["file_permissions"],
    order: 12,
    icon: "🔐",
    track: "devops",
  },
  {
    id: "bash_scripting",
    title: "תכנות Bash",
    description: "grep, צינורות, משתנים, סקריפטים",
    topicIds: ["bash_scripting"],
    order: 13,
    icon: "💻",
    track: "devops",
  },
  {
    id: "networking_fundamentals",
    title: "יסודות רשת",
    description: "TCP/IP, DNS, פורטים ו-HTTP",
    topicIds: ["networking_fundamentals"],
    order: 14,
    icon: "🌐",
    track: "devops",
  },
];

export function getModuleForTopic(topicId: string): Module | undefined {
  return MODULES.find((m) => m.topicIds.includes(topicId as TopicId));
}

export function getModulesByTrack(track: TrackId): Module[] {
  return MODULES.filter((m) => m.track === track).sort((a, b) => a.order - b.order);
}
