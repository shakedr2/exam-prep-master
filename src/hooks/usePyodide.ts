import { useState, useRef, useCallback } from "react";

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: {
    set: (key: string, value: unknown) => void;
  };
}

interface PyodideResult {
  output: string;
  error?: string;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

const PYODIDE_VERSION = "0.27.0";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;

let _pyodideInstance: PyodideInterface | null = null;
let _loadPromise: Promise<PyodideInterface> | null = null;

function ensurePyodide(): Promise<PyodideInterface> {
  if (_pyodideInstance) return Promise.resolve(_pyodideInstance);
  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise<PyodideInterface>((resolve, reject) => {
    const initialize = () => {
      window
        .loadPyodide({ indexURL: PYODIDE_INDEX_URL })
        .then((instance) => {
          _pyodideInstance = instance;
          resolve(instance);
        })
        .catch(reject);
    };

    if (typeof window.loadPyodide === "function") {
      initialize();
      return;
    }

    const script = document.createElement("script");
    script.src = PYODIDE_SCRIPT_URL;
    script.onload = initialize;
    script.onerror = () => reject(new Error("Failed to load Pyodide script"));
    document.head.appendChild(script);
  });

  return _loadPromise;
}

export function usePyodide() {
  const [isLoading, setIsLoading] = useState(false);
  const pyodideRef = useRef<PyodideInterface | null>(_pyodideInstance);

  const runPython = useCallback(async (code: string): Promise<PyodideResult> => {
    let pyodide = pyodideRef.current;

    if (!pyodide) {
      setIsLoading(true);
      try {
        pyodide = await ensurePyodide();
        pyodideRef.current = pyodide;
      } finally {
        setIsLoading(false);
      }
    }

    pyodide.globals.set("_user_code", code);

    try {
      const raw = await pyodide.runPythonAsync(`
import sys, io, traceback as _tb

_buf = io.StringIO()
_old_out = sys.stdout
_old_err = sys.stderr
sys.stdout = _buf
sys.stderr = _buf
_err_msg = None

try:
    exec(_user_code)
except Exception:
    _err_msg = _tb.format_exc()
finally:
    sys.stdout = _old_out
    sys.stderr = _old_err

[_buf.getvalue(), _err_msg]
`);

      const [output, errorMsg] = raw as [string, string | null];
      return { output: output ?? "", error: errorMsg ?? undefined };
    } catch (e) {
      return { output: "", error: String(e) };
    }
  }, []);

  return { runPython, isLoading };
}
