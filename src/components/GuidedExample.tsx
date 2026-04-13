import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GuidedExample as GuidedExampleData } from "@/data/topicTutorials";

interface GuidedExampleProps {
  example: GuidedExampleData;
  /** Called when the student finishes and taps "הבנתי". */
  onComplete: () => void;
}

/** Minimal Python tokenizer (shared with PythonCodeBlock). */
type TokenType =
  | "keyword"
  | "builtin"
  | "string"
  | "number"
  | "comment"
  | "operator"
  | "function"
  | "param"
  | "text";

const KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await",
  "break", "class", "continue", "def", "del", "elif", "else", "except",
  "finally", "for", "from", "global", "if", "import", "in", "is",
  "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
  "while", "with", "yield",
]);

const BUILTINS = new Set([
  "abs", "all", "any", "bin", "bool", "chr", "dict", "dir", "divmod",
  "enumerate", "eval", "exec", "filter", "float", "format", "frozenset",
  "getattr", "hasattr", "hash", "help", "hex", "id", "input", "int",
  "isinstance", "issubclass", "iter", "len", "list", "map", "max",
  "min", "next", "object", "oct", "open", "ord", "pow", "print",
  "property", "range", "repr", "reversed", "round", "set", "setattr",
  "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple",
  "type", "vars", "zip",
]);

function tokenize(code: string): { type: TokenType; value: string }[] {
  const tokens: { type: TokenType; value: string }[] = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === "#") {
      tokens.push({ type: "comment", value: code.slice(i) });
      break;
    }
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      const triple = code.slice(i, i + 3);
      if (triple === '"""' || triple === "'''") {
        const end = code.indexOf(triple, i + 3);
        const endIdx = end === -1 ? code.length : end + 3;
        tokens.push({ type: "string", value: code.slice(i, endIdx) });
        i = endIdx;
      } else {
        let j = i + 1;
        while (j < code.length && code[j] !== quote && code[j] !== "\n") {
          if (code[j] === "\\") j++;
          j++;
        }
        tokens.push({ type: "string", value: code.slice(i, j + 1) });
        i = j + 1;
      }
      continue;
    }
    if (/\d/.test(code[i]) || (code[i] === "." && /\d/.test(code[i + 1] ?? ""))) {
      let j = i;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push({ type: "number", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_\u0590-\u05FF]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w\u0590-\u05FF]/.test(code[j])) j++;
      const word = code.slice(i, j);
      let type: TokenType = "text";
      if (KEYWORDS.has(word)) type = "keyword";
      else if (BUILTINS.has(word)) type = "builtin";
      else if (code[j] === "(") type = "function";
      tokens.push({ type, value: word });
      i = j;
      continue;
    }
    if (/[+\-*/%=<>!&|^~@]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[+\-*/%=<>!&|^~@]/.test(code[j])) j++;
      tokens.push({ type: "operator", value: code.slice(i, j) });
      i = j;
      continue;
    }
    tokens.push({ type: "text", value: code[i] });
    i++;
  }
  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "text-purple-700 dark:text-purple-400 font-semibold",
  builtin: "text-cyan-700 dark:text-cyan-400",
  string: "text-emerald-700 dark:text-emerald-400",
  number: "text-amber-700 dark:text-amber-400",
  comment: "text-slate-500 italic",
  operator: "text-pink-700 dark:text-pink-400",
  function: "text-yellow-700 dark:text-yellow-300",
  param: "text-orange-700 dark:text-orange-300",
  text: "text-slate-800 dark:text-slate-200",
};

/** Accumulates all traceRows from steps 0..stepIndex. */
function buildTraceRows(
  steps: GuidedExampleData["steps"],
  upToIndex: number
): { variable: string; value: string; stepIdx: number }[] {
  const rows: { variable: string; value: string; stepIdx: number }[] = [];
  for (let s = 0; s <= upToIndex; s++) {
    const row = steps[s]?.traceRow;
    if (row) {
      row.forEach((r) => rows.push({ ...r, stepIdx: s }));
    }
  }
  return rows;
}

const narrationVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function GuidedExample({ example, onComplete }: GuidedExampleProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const codeLines = useMemo(() => example.code.split("\n"), [example.code]);
  const tokenizedLines = useMemo(
    () => codeLines.map((line) => tokenize(line)),
    [codeLines]
  );

  const currentStep = example.steps[stepIndex];
  const isLast = stepIndex === example.steps.length - 1;
  const highlightSet = useMemo(
    () => new Set(currentStep?.highlightLines ?? []),
    [currentStep]
  );
  const traceRows = useMemo(
    () => buildTraceRows(example.steps, stepIndex),
    [example.steps, stepIndex]
  );
  const hasTrace = example.steps.some((s) => s.traceRow && s.traceRow.length > 0);

  function handleNext() {
    if (!isLast) {
      setStepIndex((i) => i + 1);
    } else {
      onComplete();
    }
  }

  return (
    <div dir="rtl" className="space-y-4">
      {/* Title + step counter */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-base">{example.title}</h3>
        <Badge variant="outline" className="text-xs shrink-0">
          שלב {stepIndex + 1} מתוך {example.steps.length}
        </Badge>
      </div>

      {/* Code block with line highlights */}
      <div
        dir="ltr"
        className="relative overflow-hidden rounded-xl border border-border bg-slate-100 dark:bg-[#1a1b2e] shadow-md"
      >
        {/* macOS-style header */}
        <div className="flex items-center gap-1.5 border-b border-border bg-black/5 dark:bg-white/5 px-4 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
          <span className="mr-3 text-[10px] text-muted-foreground font-mono">Python</span>
        </div>

        <div className="overflow-x-auto p-4">
          <pre className="text-sm leading-6 font-mono">
            {tokenizedLines.map((lineTokens, lineIdx) => {
              const lineNo = lineIdx + 1; // 1-based
              const isHighlighted = highlightSet.has(lineNo);
              return (
                <div
                  key={lineIdx}
                  className={`flex rounded transition-colors duration-200 ${
                    isHighlighted
                      ? "bg-yellow-200/70 dark:bg-yellow-500/20"
                      : ""
                  }`}
                >
                  <span className="mr-4 inline-block w-6 select-none text-right text-xs leading-6 text-muted-foreground">
                    {lineNo}
                  </span>
                  <code>
                    {lineTokens.map((token, tIdx) => (
                      <span key={tIdx} className={TOKEN_COLORS[token.type]}>
                        {token.value}
                      </span>
                    ))}
                  </code>
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Narration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          variants={narrationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-800/40 dark:bg-blue-950/20">
            <CardContent className="pt-3 pb-3">
              <p className="text-sm text-foreground leading-relaxed">
                💬 {currentStep?.narration}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Trace table — only shown if any step has traceRows */}
      {hasTrace && traceRows.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            טבלת מעקב
          </p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="py-2 px-3 text-right font-medium text-muted-foreground text-xs">
                    משתנה
                  </th>
                  <th className="py-2 px-3 text-left font-medium text-muted-foreground text-xs" dir="ltr">
                    ערך
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {traceRows.map((row, idx) => (
                    <motion.tr
                      key={`${row.stepIdx}-${row.variable}-${idx}`}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className={`border-b border-border last:border-0 ${
                        row.stepIdx === stepIndex
                          ? "bg-yellow-50 dark:bg-yellow-950/20"
                          : "bg-background"
                      }`}
                    >
                      <td className="py-2 px-3 font-mono text-xs text-foreground">
                        {row.variable}
                      </td>
                      <td className="py-2 px-3 font-mono text-xs text-foreground" dir="ltr">
                        {row.value}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        {stepIndex > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStepIndex((i) => i - 1)}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4 rotate-180" />
            הקודם
          </Button>
        )}
        <Button
          size="sm"
          className="flex-1 gap-2"
          onClick={handleNext}
        >
          {isLast ? (
            <>
              <CheckCircle className="h-4 w-4" />
              הבנתי, בוא נתרגל
            </>
          ) : (
            <>
              הבא
              <ChevronLeft className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
