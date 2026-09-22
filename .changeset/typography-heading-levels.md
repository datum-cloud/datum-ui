---
"@datum-cloud/datum-ui": minor
---

Headings below 16px now have somewhere to sit. The type scale's display steps start at 16px (`Title` level 6), so a section or card heading at 14px had no level and had to fall back to a raw size class.

- `Title` gains `level={7}`, the 14px floor of the scale. It renders an `h6`, since there is no `h7`, and `as` still overrides the element where the document outline and the visual size disagree.
- `Text` accepts `as="h1"` … `"h6"`, for a heading that has to stay in the outline at a size below the scale's heading floor.
