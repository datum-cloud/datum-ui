---
"@datum-cloud/datum-ui": patch
---

Fix unstyled `Calendar` in consumer Tailwind v4 builds. The `@source` glob in `dist/styles/root.css` was previously `../*.mjs` (single-star, top-level only) and missed per-export bundles in subfolders like `dist/<name>/index.mjs`. Switched to recursive `../**/*.mjs` so every shipped chunk is scanned and its utilities emitted.
