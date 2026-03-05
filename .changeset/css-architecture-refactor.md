---
"@datum-cloud/datum-ui": minor
---

Overhaul CSS architecture: consumers now own their Tailwind setup. Remove DatumProvider in favor of direct ThemeProvider usage. Theme tokens moved from .theme-alpha scoping to :root/.dark. Remove tw-animate-css and tailwind-scrollbar-hide from package deps. Add ./styles export with "style" condition for PostCSS compatibility.
