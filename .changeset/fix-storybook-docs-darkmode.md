---
"@repo/storybook": patch
---

Fix docs dark mode. The component preview on a docs page now gets a dark
background in dark mode (matching the dark-rendered component), while the rest
of the docs chrome stays light. Removes the custom docs `DocsContainer`, which
threw a "combining Storybook hooks with framework hooks" runtime error and
themed the whole docs page (clashing with the light prose and tables).
