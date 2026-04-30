---
"@datum-cloud/datum-ui": minor
---

`CodeEditor` gains an optional `placeholder` prop. Mirrors HTML `<input>` semantics — visible while `value === ''`, hidden as soon as content is entered.

The `language` prop type widens from the previous 9-value `EditorLanguage` to a new exported `MonacoLanguage` — a literal union of ~70 Monaco built-in language IDs intersected with `(string & {})` so any custom-registered Monaco language ID is accepted while autocomplete is preserved for known ones. `EditorLanguage` is unchanged and still exported for backward compatibility (used by `CodeEditorTabs.format`).

Both changes are additive — every previously valid call site continues to compile.
