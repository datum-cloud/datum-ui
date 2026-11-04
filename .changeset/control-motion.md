---
"@datum-cloud/datum-ui": minor
---

Animate `Checkbox`, `RadioGroup`, `Switch`, `Collapsible`, copy buttons and chips with Motion, and redraw the spinner.

- `Checkbox`: the check mark draws on when ticked and fades out quickly when cleared, and the box presses in slightly on click. The indeterminate state now shows a dash on a filled box instead of a tick on an empty one.
- `RadioGroupItem`: the dot pops in from half size with a small spring and fades out when another option is chosen.
- `Switch`: the thumb slides on a light spring, stretches toward its destination while the pointer is held, and the on/off glyphs cross-fade.
- `Spinner` and `SpinnerIcon`: a faint track with an arc that fades from a transparent tail to a solid head, turning once every 0.8s. The rotation runs through the Web Animations API, so it stays smooth while the main thread is busy. The track now follows the arc colour by default (`trackClassName` still overrides it), and `Spinner` takes its colour from `className`, defaulting to `text-primary`.
- `CollapsibleContent`: height and opacity animate open and closed, and reverse smoothly when toggled mid-way. The content stays mounted (inert while closed, hidden once the close finishes) instead of being unmounted. `className` now goes on an inner wrapper, so padding no longer holds a closed panel open. `AppNavigation` keeps its own collapse animation.
- Copy buttons in `Form.CopyBox`, the logs detail panel and assistant messages: the copy icon cross-fades into a check while the copied state lasts. Each logs copy button now tracks its own state, so only the one clicked changes.
- `TagsInput` and `MultiSelect` chips: chips fade and scale in when added; when one is removed it fades out and the chips after it slide into the gap.

Under reduced motion the controls keep their fades but drop the movement; the spinner keeps turning.

`motion` is now a required peer dependency. It was optional, but `Tabs` and the root entry already imported it.
