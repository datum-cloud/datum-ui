---
"@datum-cloud/datum-ui": minor
---

Upgrade `@stepperize/react` to v7 and refactor the stepper to its redesigned API.

v7 is a ground-up API redesign, deferred from the dependency-update sweep. The
internal refactor remaps the removed v6 surface (`stepper.lookup.*`,
`stepper.state.current.data.id`, per-step `metadata`) onto the v7 instance
(`current`, `index`, `isFirst`/`isLast`, `goTo`, flow `data`) and the new
array-based `defineStepper(steps)` / `Provider` model.

Consumer-facing changes for the bare `Stepper` (the `FormStepper` API is
unchanged):

- `Stepper.Provider` prop `initialStep` → `defaultStep` (and `initialMetadata`
  → `defaultData`).
- The render-prop `methods` is now the flat v7 instance: use `methods.current.id`,
  `methods.next()/prev()/goTo()`, and `methods.isFirst`/`methods.isLast` instead
  of the old `methods.state.*` / `methods.navigation.*`.
