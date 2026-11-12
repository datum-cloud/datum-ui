---
"@datum-cloud/datum-ui": patch
---

Make `CodeEditor` and `MapTileLayer` follow the `ThemeProvider` resolved theme, so a `system` theme on a dark OS gets the dark editor and an explicit light or dark choice gets the matching map tiles. `MapTileLayer` also accepts an optional `theme` prop to force light or dark tiles.
