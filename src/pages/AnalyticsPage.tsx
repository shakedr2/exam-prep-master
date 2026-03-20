import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopicStat {
  topic: string;
  questionsAnswered: number;
  successRate: number;
}

interface SessionScore {
  date: string;
  score: number;
}

// TODO: replace with Supabase query
const MOCK_TOPIC_STATS: TopicStat[] = [
  { topic: "מעקב קוד", questionsAnswered: 24, successRate: 75 },
  { topic: "תנאים", questionsAnswered: 18, successRate: 83 },
  { topic: "לולאות", questionsAnswered: 20, successRate: 60 },
  { topic: "רשימות", questionsAnswered: 15, successRate: 53 },
  { topic: "מתמטיקה", questionsAnswered: 10, successRate: 90 },
];

// TODO: replace with Supabase query
const MOCK_SCORE_HISTORY: SessionScore[] = [
  { date: "12/3", score: 55 },
  { date: "13/3", score: 63 },
  { date: "14/3", score: 70 },
  { date: "15/3", score: 68 },
  { date: "16/3", score: 78 },
  { date: "17/3", score: 85 },
  { date: "18/3", score: 80 },
];

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen pb-24 pt-8">
      <div className="mx-auto max-w-lg px-4 space-y-8">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">📊 סטטיסטיקות</h1>
          <p className="text-muted-foreground">ביצועים לפי נושא וציון לאורך זמן</p>
        </div>

        {/* Topic summary table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="font-semibold text-foreground">סיכום לפי נושא</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">נושא</TableHead>
                <TableHead className="text-center">שאלות</TableHead>
                <TableHead className="text-center">הצלחה</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TOPIC_STATS.map((row) => (
                <TableRow key={row.topic}>
                  <TableCell className="font-medium">{row.topic}</TableCell>
                  <TableCell className="text-center text-muted-foreground">
                    {row.questionsAnswered}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        row.successRate >= 80
                          ? "text-success font-semibold"
                          : row.successRate >= 60
                          ? "text-xp font-semibold"
                          : "text-destructive font-semibold"
                      }
                    >
                      {row.successRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Score over time chart */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-semibold text-foreground">ציון לאורך זמן</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={MOCK_SCORE_HISTORY} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "ציון"]}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
