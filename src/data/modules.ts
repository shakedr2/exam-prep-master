import type { TopicId } from "./questions";

export interface Module {
  id: string;
  title: string;
  description: string;
  topicIds: TopicId[];
  order: number;
  icon: string;
  comingSoon?: boolean;
}

export const MODULES: Module[] = [
  {
    id: "getting_started",
    title: "צעדים ראשונים",
    description: "משתנים, טיפוסים, קלט/פלט וחשבון",
    topicIds: ["variables_io", "arithmetic"],
    order: 1,
    icon: "👣",
  },
  {
    id: "control_flow",
    title: "בקרת זרימה",
    description: "תנאים ולולאות",
    topicIds: ["conditions", "loops"],
    order: 2,
    icon: "🔀",
  },
  {
    id: "data_structures",
    title: "מבני נתונים",
    description: "מחרוזות, רשימות, טאפלים, סטים ומילונים",
    topicIds: ["strings", "lists", "tuples_sets_dicts"],
    order: 3,
    icon: "🗃️",
  },
  {
    id: "functions_module",
    title: "פונקציות",
    description: "הגדרת פונקציות, פרמטרים וערכי החזרה",
    topicIds: ["functions"],
    order: 4,
    icon: "🧩",
  },
  {
    id: "code_tracing",
    title: "מעקב קוד",
    description: "מעקב ביצוע וחישובים מתמטיים",
    topicIds: ["tracing", "math"],
    order: 5,
    icon: "🔍",
  },
  {
    id: "oop_basics",
    title: "תכנות מונחה-עצמים",
    description: "מחלקות, ירושה ופולימורפיזם",
    topicIds: ["classes_objects", "inheritance", "polymorphism"],
    order: 6,
    icon: "🏛️",
  },
  {
    id: "advanced",
    title: "קבצים, חריגות ודקורטורים",
    description: "טיפול בקבצים, try/except, מתודות מיוחדות",
    topicIds: ["files_exceptions", "decorators_special"],
    order: 7,
    icon: "✨",
  },
];

export function getModuleForTopic(topicId: string): Module | undefined {
  return MODULES.find((m) => m.topicIds.includes(topicId as TopicId));
}
