/**
 * Configure the Monaco Editor loader to use the locally installed monaco-editor
 * package instead of fetching assets from a CDN.  This is required in offline
 * or restricted network environments (CI sandboxes, strict CSPs, etc.).
 */
import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

// Tell the monaco-editor runtime which web worker to spin up.
// We only need the base editor worker because Python uses a simple
// textmate-style tokenizer with no language server.
window.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

// Point the @monaco-editor/react loader at the already-bundled module,
// bypassing its built-in AMD/CDN loader.
loader.config({ monaco });
