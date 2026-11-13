---
"@datum-cloud/datum-ui": patch
---

Fix `CodeEditor` crashing when a page renders on the server: import `Editor` from `@monaco-editor/react` by name, since Node loads the package's CommonJS build, where the default import is the whole module object.
