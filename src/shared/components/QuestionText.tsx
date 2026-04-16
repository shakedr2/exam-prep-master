import { Fragment } from "react";
import { PythonCodeBlock } from "@/components/PythonCodeBlock";

/**
 * Heuristic: returns true if a non-empty line looks like Python code.
 * Lines with Hebrew characters are always treated as natural-language text.
 */
function isPythonCodeLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // Hebrew characters → text, not code
  if (/[\u0590-\u05FF]/.test(trimmed)) return false;

  // Python keywords / statements at start of line
  if (
    /^(def |class |for |while |if |elif |else:|else$|return |return$|import |from |try:|except|finally:|with |raise |assert |pass$|break$|continue$|yield |del )/.test(
      trimmed,
    )
  )
    return true;

  // Function / method call at start of line (e.g. print(...), mystery(...))
  if (/^[a-zA-Z_][\w.]*\(/.test(trimmed)) return true;

  // Variable assignment  (x = ..., lst[0] = ..., x += ...)
  if (/^[a-zA-Z_]\w*(\[.*?\])?\s*[+\-*/%]?=\s/.test(trimmed)) return true;

  // Indented continuation (body of a block)
  if (/^\s{2,}/.test(line) && /[a-zA-Z_#"']/.test(trimmed[0])) return true;

  // Decorator
  if (/^@\w+/.test(trimmed)) return true;

  return false;
}

type Segment =
  | { type: "text"; content: string }
  | { type: "code"; content: string };

/**
 * Split a string into alternating text / code segments.
 * Code is detected line-by-line using Python heuristics.
 */
function parseTextWithCode(text: string): Segment[] {
  if (!text.includes("\n")) {
    return [{ type: "text", content: text }];
  }

  const lines = text.split("\n");
  const segments: Segment[] = [];
  let textBuf: string[] = [];
  let codeBuf: string[] = [];

  function flushText() {
    if (textBuf.length > 0) {
      const content = textBuf.join("\n").trim();
      if (content) segments.push({ type: "text", content });
      textBuf = [];
    }
  }

  function flushCode() {
    // Trim trailing empty lines from code block
    while (codeBuf.length > 0 && codeBuf[codeBuf.length - 1].trim() === "") {
      codeBuf.pop();
    }
    if (codeBuf.length > 0) {
      segments.push({ type: "code", content: codeBuf.join("\n") });
    }
    codeBuf = [];
  }

  for (const line of lines) {
    if (isPythonCodeLine(line)) {
      flushText();
      codeBuf.push(line);
    } else if (line.trim() === "" && codeBuf.length > 0) {
      // Blank line inside a code block — keep it as code
      codeBuf.push(line);
    } else {
      flushCode();
      textBuf.push(line);
    }
  }

  flushText();
  flushCode();

  return segments;
}

// ---------------------------------------------------------------------------
// Public components
// ---------------------------------------------------------------------------

interface QuestionTextProps {
  text: string;
  className?: string;
}

/**
 * Renders question / explanation text that may contain embedded Python code.
 *
 * - Pure text → rendered as a plain <span>
 * - Mixed text + code → text in <p>, code in <PythonCodeBlock>
 */
export function QuestionText({ text, className }: QuestionTextProps) {
  const segments = parseTextWithCode(text);

  // Fast path: no code detected
  if (segments.length === 1 && segments[0].type === "text") {
    return <span className={className}>{segments[0].content}</span>;
  }

  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      {segments.map((seg, i) =>
        seg.type === "code" ? (
          <PythonCodeBlock key={i} code={seg.content} />
        ) : (
          <p key={i}>{seg.content}</p>
        ),
      )}
    </div>
  );
}

/**
 * Renders text that may contain literal "\n" sequences (the two characters
 * backslash + n, common in quiz options that represent program output).
 * Converts them into real line breaks.
 */
export function FormattedOptionText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  // Literal backslash-n in runtime string
  if (!text.includes("\\n")) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split("\\n");
  return (
    <span className={`whitespace-pre-wrap ${className ?? ""}`}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && "\n"}
          {part}
        </Fragment>
      ))}
    </span>
  );
}
