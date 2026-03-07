---
"@datum-cloud/datum-ui": minor
---

Ship uncompiled CSS instead of compiled Tailwind output (fixes #16)

- **Breaking:** Grid and NProgress CSS are now separate optional imports (`@datum-cloud/datum-ui/grid`, `@datum-cloud/datum-ui/nprogress`)
- **Breaking:** Requires Tailwind CSS v4.0.7+ (v4.2.1+ recommended)
- Removed CSS compilation from build pipeline — raw CSS files are copied to dist
- Embedded `@source` directive in shipped CSS for zero-config consumer class scanning
- Pre-expanded grid system `@apply` directives into self-contained CSS
- Eliminated duplicate Tailwind stylesheets that caused responsive utility conflicts
