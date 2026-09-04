---
"@datum-cloud/datum-ui": minor
---

Add a shared motion token layer and apply it across components.

Easing curves and durations now live in one place (`motion.css` for CSS, `EASE`/`DURATION` from the package entry for Motion), so animation stays consistent. Buttons and other pressable elements now react to a press, tooltips and popovers open faster and scale from their trigger instead of the centre, and drawers use a dedicated curve. A `prefers-reduced-motion` fallback removes movement while keeping fades.
