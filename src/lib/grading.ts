// Lenient grading utility - focuses on conceptual understanding, not exact syntax

export type GradeResult = {
  score: "correct" | "partial" | "incorrect";
  message: string;
};

/**
 * Normalize a string for comparison:
 * - trim, collapse whitespace, lowercase
 */
function normalize(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Remove all whitespace for tight comparison
 */
function stripAll(s: string): string {
  return s.replace(/\s/g, "").toLowerCase();
}

/**
 * Calculate similarity ratio (0-1) between two strings using character overlap
 */
function similarity(a: string, b: string): number {
  const sa = stripAll(a);
  const sb = stripAll(b);
  if (sa === sb) return 1;
  if (!sa.length || !sb.length) return 0;

  // Longest Common Subsequence ratio
  const m = sa.length;
  const n = sb.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = sa[i - 1] === sb[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs = dp[m][n];
  return (2 * lcs) / (m + n);
}

/**
 * Check if answer is a syntax-only variation of the correct answer.
 * e.g. missing quotes, extra commas, parentheses differences
 */
function isSyntaxVariation(answer: string, correct: string): boolean {
  // Strip common syntax characters and compare
  const syntaxChars = /['"`,;()[\]{}]/g;
  const a = stripAll(answer).replace(syntaxChars, "");
  const b = stripAll(correct).replace(syntaxChars, "");
  return a === b;
}

/**
 * Check if multiline outputs match with flexible whitespace/newlines
 */
function multilineMatch(answer: string, correct: string): "exact" | "partial" | "none" {
  // Exact after normalization
  if (normalize(answer) === normalize(correct)) return "exact";

  // Compare line by line
  const aLines = answer.trim().split(/[\n,]+/).map(l => l.trim()).filter(Boolean);
  const cLines = correct.trim().split(/[\n,]+/).map(l => l.trim()).filter(Boolean);

  if (aLines.length === 0) return "none";

  let matchCount = 0;
  for (let i = 0; i < Math.max(aLines.length, cLines.length); i++) {
    const al = normalize(aLines[i] || "");
    const cl = normalize(cLines[i] || "");
    if (al === cl) matchCount++;
    else if (stripAll(al) === stripAll(cl)) matchCount += 0.8;
  }

  const ratio = matchCount / Math.max(cLines.length, 1);
  if (ratio >= 0.9) return "exact";
  if (ratio >= 0.5) return "partial";
  return "none";
}

/**
 * Grade a tracing question answer leniently
 */
export function gradeTracingAnswer(answer: string, correct: string): GradeResult {
  const a = answer.trim();
  const c = correct.trim();

  // Exact match
  if (a === c) return { score: "correct", message: "✅ מצוין! תשובה מדויקת!" };

  // Normalized exact match (whitespace/case)
  if (normalize(a) === normalize(c)) return { score: "correct", message: "✅ נכון! (הבדלי רווחים בלבד)" };

  // Strip all whitespace match
  if (stripAll(a) === stripAll(c)) return { score: "correct", message: "✅ נכון! התוכן מדויק" };

  // Syntax variation (quotes, brackets etc.)
  if (isSyntaxVariation(a, c)) return { score: "correct", message: "✅ נכון! הבדל סינטקטי בלבד — ההבנה מושלמת" };

  // Multiline check
  const ml = multilineMatch(a, c);
  if (ml === "exact") return { score: "correct", message: "✅ נכון!" };
  if (ml === "partial") return { score: "partial", message: "🟡 חלקית נכון — חלק מהפלט נכון, אבל לא הכל" };

  // High similarity
  const sim = similarity(a, c);
  if (sim >= 0.85) return { score: "partial", message: "🟡 כמעט! קרוב מאוד לתשובה — בדוק שוב את הפרטים הקטנים" };
  if (sim >= 0.6) return { score: "partial", message: "🟡 חלקית — יש הבנה של הכיוון, אבל התשובה לא מדויקת" };

  return { score: "incorrect", message: "❌ לא נכון" };
}

/**
 * Grade a fill-blank answer leniently
 */
export function gradeBlankAnswer(answer: string, correct: string): GradeResult {
  const a = answer.trim();
  const c = correct.trim();

  if (a === c) return { score: "correct", message: "" };
  if (normalize(a) === normalize(c)) return { score: "correct", message: "" };
  if (stripAll(a) === stripAll(c)) return { score: "correct", message: "" };
  if (isSyntaxVariation(a, c)) return { score: "correct", message: "סינטקס שונה, ההבנה נכונה" };

  const sim = similarity(a, c);
  if (sim >= 0.75) return { score: "partial", message: "קרוב מאוד" };

  return { score: "incorrect", message: "" };
}
