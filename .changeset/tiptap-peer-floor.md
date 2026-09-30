---
"@datum-cloud/datum-ui": minor
---

Raise the `@tiptap/*` peer floors to `>=3.30.5`.

`@tiptap/core` 3.7.0 through 3.30.4 carries a HIGH quadratic ReDoS in block and inline Markdown attribute parsing, and every version below 3.30.4 also lets `mergeAttributes()` turn an own `__proto__` key into an inherited executable DOM attribute. The old floor of `>=3.27.1` let a consumer install an affected version.

Each `@tiptap` package pins `@tiptap/core` to its own exact version, so raising the floor on the six packages this library declares is enough to guarantee a patched core. If you are pinned below 3.30.5, move the `@tiptap` family together, since each package declares an exact-version peer on the others.
