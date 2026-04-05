import { useMemo } from "react";

interface Token {
  type: "keyword" | "builtin" | "string" | "number" | "comment" | "operator" | "function" | "param" | "text";
  value: string;
}

const KEYWORDS = new Set([
  "def", "return", "if", "elif", "else", "for", "while", "in", "not", "and", "or",
  "break", "continue", "pass", "class", "import", "from", "as", "try", "except",
  "finally", "raise", "with", "yield", "lambda", "global", "nonlocal", "assert", "del",
]);

const BUILTINS = new Set([
  "print", "range", "len", "str", "int", "float", "list", "dict", "set", "tuple",
  "sorted", "enumerate", "zip", "map", "filter", "input", "type", "isinstance",
  "True", "False", "None", "abs", "max", "min", "sum", "round", "append",
]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Comments
    if (code[i] === "#") {
      let end = code.indexOf("\n", i);
      if (end === -1) end = code.length;
      tokens.push({ type: "comment", value: code.slice(i, end) });
      i = end;
      continue;
    }

    // Strings
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
        if (j < code.length) j++;
        tokens.push({ type: "string", value: code.slice(i, j) });
        i = j;
      }
      continue;
    }

    // Numbers
    if (/\d/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push({ type: "number", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Words (identifiers, keywords, builtins)
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);

      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (BUILTINS.has(word)) {
        tokens.push({ type: "builtin", value: word });
      } else if (j < code.length && code[j] === "(") {
        tokens.push({ type: "function", value: word });
      } else {
        tokens.push({ type: "text", value: word });
      }
      i = j;
      continue;
    }

    // Operators
    if ("+-*/%=<>!&|^~@".includes(code[i])) {
      let j = i + 1;
      if (j < code.length && "=<>*".includes(code[j])) j++;
      tokens.push({ type: "operator", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Everything else (whitespace, punctuation)
    tokens.push({ type: "text", value: code[i] });
    i++;
  }

  return tokens;
}

const TOKEN_COLORS: Record<Token["type"], string> = {
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

interface PythonCodeBlockProps {
  code: string;
}

export function PythonCodeBlock({ code }: PythonCodeBlockProps) {
  const lines = useMemo(() => {
    const codeLines = code.split("\n");
    return codeLines.map(line => tokenize(line));
  }, [code]);

  return (
    <div dir="ltr" className="relative overflow-hidden rounded-xl border border-border bg-slate-100 dark:bg-[#1a1b2e] shadow-lg">
      {/* Header bar */}
      <div className="flex items-center gap-1.5 border-b border-border bg-black/5 dark:bg-white/5 px-4 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="mr-3 text-[10px] text-muted-foreground font-mono">Python</span>
      </div>

      <div className="overflow-x-auto p-4">
        <pre className="text-sm leading-6 font-mono">
          {lines.map((lineTokens, lineIdx) => (
            <div key={lineIdx} className="flex">
              <span className="mr-4 inline-block w-6 select-none text-right text-xs leading-6 text-muted-foreground">
                {lineIdx + 1}
              </span>
              <code>
                {lineTokens.map((token, tIdx) => (
                  <span key={tIdx} className={TOKEN_COLORS[token.type]}>
                    {token.value}
                  </span>
                ))}
              </code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
