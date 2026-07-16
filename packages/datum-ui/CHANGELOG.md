# @datum-cloud/datum-ui

## 1.5.0

### Minor Changes

- fe5921a: Add the `assistant` feature (`@datum-cloud/datum-ui/assistant`): a props-driven AI assistant workspace plus composable pieces (conversation, composer, message rendering, turn rail, history) and an `AssistantConfig` context for host-specific copy, models, tool labels, and link rendering. Host apps own state and transport and feed the workspace via props, so staff-portal and cloud-portal share one presentational layer.

## 1.4.0

### Minor Changes

- f82947b: Broad correctness and hardening pass across the component library:
  - Fixed bugs across base and feature components: button sizing, alert dismissal,
    responsive dropdown/popover handlers and modal default, sidebar state, multi-select
    selection, autocomplete/autosearch, tag-input, transfer, input-number, task-queue
    scheduling/timeout/reload, date-time pickers, grid gutters, code-editor YAML precision,
    rich-text editor, and data-table.
  - Fixed form data integrity: multi-step value merging, adapter type preservation, and
    dirty-state detection for Date/Map defaults.
  - Fixed the map module (listener leaks, crash paths) and place-autocomplete refetch loop.
  - Fixed theming/no-flash scripts and shared hooks (copy-to-clipboard, debounce, breakpoint).
  - Tightened peer dependency ranges to the tested majors (e.g. react-day-picker v10);
    consumers on older majors should verify.
  - Internal: split oversized modules, removed the legacy picker family, added import-layering
    enforcement, an export generator, and coverage/test gates.

## 1.3.2

### Patch Changes

- 22b1506: Fix `ResponsiveDropdown` closing when the window loses focus. `@radix-ui/react-menu` ≥2.1.17 closes menus on window blur, which unmounted dropdown content whenever the native file picker opened (or the user switched apps to drag a file in) — silently breaking flows like the DNS record import dropzone. The desktop variant now renders a Radix Popover, which keeps the same anchored dropdown UX without the blur-close behavior and is the correct semantics for the arbitrary interactive content this component hosts.

## 1.3.1

### Patch Changes

- f760a10: If the dialog content was scrollable it would scroll into and past the footer.

## 1.3.0

### Minor Changes

- a2466e4: Upgrade `@stepperize/react` to v7 and refactor the stepper to its redesigned API.

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

### Patch Changes

- a2466e4: Update dependencies and apply a security fix.
  - Override `undici` to `^7.28.0` to resolve a critical CRLF Injection
    vulnerability (pulled in transitively via jsdom, test-only).
  - Apply open Renovate updates: `@radix-ui/*` primitives, storybook 10.4.6,
    `@types/react`, tsdown, `@rsbuild/core`.
  - Bump remaining minor/patch deps: `@tiptap/*` 3.27, react-hook-form,
    `@conform-to/*`, `@tanstack/react-virtual`, lucide-react,
    isomorphic-dompurify, tailwindcss 4.3.1, eslint, vitest, turbo.
  - Upgrade `js-yaml` to v5 (now imported via flat named exports; peer range
    widened to `>=4.1.1`).
  - Bump the pinned package manager to pnpm 11.8.0.

## 1.2.0

### Minor Changes

- eb8bb48: GroupedTable: align header/body/cell styling with `data-table`, restyle the group band as a muted section header (subtle fill, matching the column header), and drop cell truncation. Adds slot-level `className` overrides mirroring data-table — `tableClassName`, `headerRowClassName`, `headerCellClassName`, `groupHeaderClassName` (`string | (group) => string`), `bodyClassName`, `rowClassName` (`string | (row) => string`), `cellClassName` (`string | (cell) => string`), and `toolbarClassName`.

## 1.1.0

### Minor Changes

- 36b0835: GroupedTable: full data-table parity — sortable column headers, checkbox multi-select, per-row action menus, search, and loading/empty states, while keeping collapsible banded groups. Reuses data-table's selection column, column header, row actions, and search matcher.
- 36b0835: Add `GroupedTable` — a reusable collapsible grouped table with TanStack columns aligned across groups and a per-group header `meta` slot.

## 1.0.0

### Major Changes

- fc4f1d8: `EmptyContent` actions now use an `as`-discriminated union that forwards the full `Button`
  (and anchor) prop surface, plus RBAC-friendly `hidden` and `tooltip` props.

  Migration:
  - `type` (action kind) → `as` (`'button' | 'link' | 'external-link'`).
  - `variant: 'default' | 'destructive' | 'outline'` → Button's `type` + `theme`
    (e.g. `destructive` → `type: 'danger'`; `outline` → `theme: 'outline'`).
  - `iconPosition: 'start' | 'end'` → `'left' | 'right'`.
  - New per-action props: `disabled`, `hidden`, `tooltip`, `tooltipSide`, and any other
    `Button` prop (`loading`, `theme`, `block`, …).
  - Disabled `link`/`external-link` actions now render as a plain disabled button (no anchor).

## 0.10.2

### Patch Changes

- f0495ef: Update dependencies across the workspace, including four major upgrades, with the affected components migrated.
  - Minor & patch bumps for ~37 packages (react 19.2.7, recharts 3.8.1, zod 4.4.3, react-hook-form 7.77, motion 12.40, tiptap 3.24, storybook 10.4.1, next 16.2.7, turbo 2.9.16, and others).
  - `@antfu/eslint-config` v8 → v9 and `@eslint-react/eslint-plugin` v3 → v5 (removed the obsolete `react/component-hook-factories` rule override).
  - `fumadocs-mdx` v14 → v15 (Vite/rolldown bundler; no config changes needed).
  - `react-day-picker` v9 → v10: Calendar migrated to the v10 API — `month_grid` classNames key, `startMonth`/`endMonth` navigation props, and `autoFocus`. Behavior is unchanged.

  Compatibility fixes: `recharts` 3.8 chart tooltip key coercion. Test setup gains a jsdom `elementFromPoint` polyfill for tiptap 3.24.

## 0.10.1

### Patch Changes

- 3d0c7b9: Fix `<DataTable.Server>` infinite update loop when paired with `useNuqsAdapter()` or `useNuqsAdapter({})` (no filters configured). The placeholder parsers map used internally when no filter parsers are supplied was rebuilt on every render — including a fresh `parseAsString.withDefault('')` parser instance — which caused `useQueryStates` to re-subscribe and return a new setter ref each render. That ref churn cascaded into an unstable `StateAdapter` and re-fired the URL-write effect in `useServerTable`, producing a "Maximum update depth exceeded" crash on first render of any page that wanted URL-persisted search/pagination without filters.

  Two changes land together:
  - `useNuqsAdapter`: the empty-filters sentinel is now a module-scoped constant, so the parsers reference passed to `useQueryStates` is stable across renders and the returned `StateAdapter` is referentially stable.
  - `useServerTable`: the `stateAdapter` is captured in a ref and dropped from the URL-write `useEffect` deps, as defense-in-depth so a future adapter-stability regression cannot cascade into the same loop.

  Resolves #98.

## 0.10.0

### Minor Changes

- 93b48e7: This release bundles a new Datum logo component family, a `Form.Stepper`
  validation-error fix, a new `AppNavigation` customisation API, an
  adapter-aware zod schema convention used by the demo stories, and a
  routine minor/patch dependency bump.

  ## New — Datum logo at `@datum-cloud/datum-ui/logo`

  Four SVG components under a single `Logo` namespace:
  - `Logo.Flat` — horizontal lockup (D mark + Datum wordmark)
  - `Logo.Stacked` — vertical lockup
  - `Logo.Icon` — standalone D mark
  - `Logo.Text` — "Datum" wordmark only (cropped viewBox)

  Each component accepts a `tone` prop with four values:

  | Tone              | Use case                                                   |
  | ----------------- | ---------------------------------------------------------- |
  | `brand` (default) | Navy text `#0C1D31` + rose mark `#BF9595` — light surfaces |
  | `mono-light`      | Lime mark `#E6F59F` + white text — dark surfaces           |
  | `mono-dark`       | Solid navy — monochrome on light surfaces                  |
  | `white`           | Solid white — photographic / strongly coloured surfaces    |

  Sizing is driven entirely by Tailwind classes (`h-8 w-auto`, `size-12`,
  etc.). Default a11y is `role="img"` + `aria-label="Datum"`; pass
  `decorative` to set `aria-hidden` when the logo sits beside brand text.

  A theme-aware adapter ships separately at `@datum-cloud/datum-ui/logo/themed`
  (`ThemedLogo.{Flat,Stacked,Icon,Text}`). It picks `brand` on light
  theme and `mono-light` on dark theme via `useTheme()`, with a
  `ClientOnly` fallback for SSR safety. Consumers without a theme
  system can use the core `Logo.*` components — no optional peer needed.

  ## Fixed — `Form.Stepper` hid zod validation errors on Next click

  The stepper's `<form>` submit handler did not call
  `markAllFieldsTouched()` the way `Form.Root` does, so the display-touched
  gate kept zod-derived errors hidden — only the autofocus on the first
  invalid input fired. The handler now mirrors `Form.Root`'s logic (with
  the same visible-submitter guard that ignores Conform's hidden
  `__intent__` buttons), so invalid fields surface their messages on the
  Next click.

  ## New — `AppNavigation` `itemClassName` + `activeItemClassName`

  Two optional props on `AppNavigation` (and the underlying `NavMenu`)
  let consumers override the visual treatment of nav-item buttons
  without forking the component:

  ```tsx
  <AppNavigation
    ...
    activeItemClassName="font-bold text-primary border-l-2 border-primary"
  />
  ```

  `activeItemClassName` is appended only when the item is active, so the
  override fires on the actual active leaf only.

  ## Convention — adapter-aware zod required-field schemas

  The demo Form schemas in
  `apps/storybook/stories/features/form/_shared.tsx` document a small
  schema convention that surfaces the same custom message under both
  adapters:

  ```ts
  z.string({ error: "Name is required" }).min(1, "Name is required");
  ```

  Conform's `parseWithZod` strips empty inputs to `undefined` (which
  otherwise yields zod v4's default `"Invalid input"`); RHF's
  `zodResolver` passes `""` through unchanged. The constructor-level
  `error` catches the Conform path; `.min(1)` catches the RHF path.

  ## Chore — dependency bumps

  Routine minor and patch bumps applied across the workspaces via
  `ncu --target minor` (stays within the current major for every
  package). Notable: `pnpm` 10.33.2 → 10.33.4, `turbo` 2.9.6 → 2.9.12,
  `tailwindcss` 4.2.4 → 4.3.0, `next` 16.2.4 → 16.2.6, `react-hook-form`
  7.74.0 → 7.75.0, the `@tiptap/*` family 3.22.5 → 3.23.1, `tsdown`
  0.21.10 → 0.22.0 (pre-1.0 minor — verified the build still passes),
  and `zod` 4.4.1 → 4.4.3.

  Major upgrades intentionally deferred (need individual investigation):
  `pnpm` 10 → 11, `react-day-picker` 9 → 10, `fumadocs-mdx` 14 → 15,
  `@eslint-react/eslint-plugin` 3 → 5.

## 0.9.0

### Minor Changes

- 3a389c4: `CodeEditor` gains an optional `placeholder` prop. Mirrors HTML `<input>` semantics — visible while `value === ''`, hidden as soon as content is entered.

  The `language` prop type widens from the previous 9-value `EditorLanguage` to a new exported `MonacoLanguage` — a literal union of ~70 Monaco built-in language IDs intersected with `(string & {})` so any custom-registered Monaco language ID is accepted while autocomplete is preserved for known ones. `EditorLanguage` is unchanged and still exported for backward compatibility (used by `CodeEditorTabs.format`).

  Both changes are additive — every previously valid call site continues to compile.

- f28c2fc: Adds a unified picker family at `@datum-cloud/datum-ui/picker`: seven opinionated wrappers (`DatePicker`, `DateRangePicker`, `TimePicker`, `TimeRangePicker`, `DateTimePicker`, `DateTimeRangePicker`, `DateRangeTimePicker`) plus the underlying primitives (`Picker.Root`, `Picker.Trigger`, `Picker.Content`, `Picker.Calendar`, `Picker.TimeInput`, `Picker.Presets`, `Picker.Footer`, `Picker.TimezoneIndicator`, `Picker.TimezoneSelect`).

  The new family covers every realistic combination of date and time selection through a single mental model: native `Date` for date-only modes, `"HH:mm"` strings for time-only modes, and UTC ISO strings paired with a `timezone` prop for time-bearing modes. Range-mode `onChange` may include a `preset` key when the value came from a preset click - useful for URL hydration.

  Helpers exported alongside: `formatPickerValue`, `isoToZonedDate`, `zonedDateToIso`, `getBrowserTimezone`, `formatTimezoneLabel`, `formatTimeLabel`, `parseTimeString`, `dateToYYYYMMDD`, `isValidTimeString`, plus the `usePickerContext` hook for primitive composition.

  The change is purely additive. Existing `@datum-cloud/datum-ui/date-picker`, `@datum-cloud/datum-ui/date-time-picker`, and `@datum-cloud/datum-ui/time-picker` exports are unchanged in this release; they will become adapter shims with a development-only `@deprecated` warning in a follow-up minor release before the eventual `1.0.0` removal. See `picker-migration.mdx` for the full upgrade path.

### Patch Changes

- 3a389c4: Bump `embla-carousel-react` from `^8` to `^8.6.0` and `input-otp` from `^1` to `^1.4.2` (renovate-flagged within-major range tightening; no behavior change for consumers already on the prior ranges).
- 3a389c4: Fix unstyled `Calendar` in consumer Tailwind v4 builds. The `@source` glob in `dist/styles/root.css` was previously `../*.mjs` (single-star, top-level only) and missed per-export bundles in subfolders like `dist/<name>/index.mjs`. Switched to recursive `../**/*.mjs` so every shipped chunk is scanned and its utilities emitted.
- f28c2fc: `CalendarDatePicker`, `DateTimePicker`, `TimePicker`, and `TimeRangePicker` are now thin adapter shims that delegate to the new unified `@datum-cloud/datum-ui/picker` family. Public APIs are unchanged - every existing prop, value shape, and `onChange` envelope is preserved by the shim, and each legacy test suite passes against its shim unchanged (with one mechanical update: `getByRole('button')` -> `getByRole('combobox')` to match the new picker trigger's improved ARIA semantics).

  In development builds, each legacy component logs a one-time `console.warn` pointing at the replacement and the migration guide. The warning is silent in `production` and `test` builds.

  The shims will remain through `0.10.x`. The legacy directories (`calendar-date-picker/`, `date-time-picker/`, `time-picker/`, `time-range-picker/`, `date-picker/`) are scheduled for removal in `1.0.0`, at which point importers will need to switch to `@datum-cloud/datum-ui/picker`. See `picker-migration.mdx` for the full upgrade path.

  Two new picker primitives ship alongside to support legacy DateTimePicker UX: `Picker.TimeInputField` (typeable HH:mm input, distinct from the slot-dropdown `Picker.TimeInput`) and a `variant` prop on `Picker.TimezoneIndicator` (`'full'` default, `'compact'` for bare-name display). The `DateTimePicker` wrapper gains `timeInputMode` and `timezoneIndicatorVariant` props to drive these.

## 0.8.1

### Patch Changes

- abd07f0: Bump `cmdk` dependency floor from `^1` to `^1.1.1`. Within-major range tightening; no behavior change for consumers already on `^1`.
- abd07f0: Bump `date-fns` peer dependency floor from `>=4` to `>=4.1.0`. v4.1.0 is additive (time-zone support in `format`/`formatISO`/`formatISO9075`/`formatRelative`/`formatRFC3339`, plus `constructFrom` null-arg bugfix). Within-major range tightening; no breaking change.
- 45e1024: Fix Tailwind v4 CSS resolver recursion on the `@datum-cloud/datum-ui/nprogress` import.

  **Problem**

  Consumers importing `@datum-cloud/datum-ui/nprogress` from a Tailwind v4 stylesheet could hit:

  ```
  [@tailwindcss/vite:generate:build] Exceeded maximum recursion depth while
  resolving `nprogress/nprogress.css` in
  `.../node_modules/@datum-cloud/datum-ui/dist/nprogress`
  ```

  The shipped `dist/nprogress/nprogress.css` began with `@import 'nprogress/nprogress.css';` to pull in the upstream nprogress library styles. Under certain `node_modules` layouts, Tailwind v4's CSS resolver interpreted that bare specifier as colliding with the file's own containing directory (`.../nprogress/nprogress.css`) and recursed into itself.

  **Fix**

  Inline the upstream nprogress@0.2.0 base styles directly into `src/components/features/nprogress/nprogress.css`. The custom theme overrides (`--color-primary` bar, spinner, peg) are preserved below the inlined base. Visual output is unchanged.

  No API changes — consumers keep `@import '@datum-cloud/datum-ui/nprogress'` as-is.

## 0.8.0

### Minor Changes

- 8f3aec8: Promote timezone-to-UTC timestamp helpers into the public `/utils` subpath.

  **Added**
  - `toUTCTimestampStartOfDay(date, timezone)` — returns Unix timestamp (seconds) for the start of a day in the given IANA timezone.
  - `toUTCTimestampEndOfDay(date, timezone)` — returns Unix timestamp (seconds) for the end of a day in the given IANA timezone.

  Both functions are ported verbatim from cloud-portal's vendored `app/modules/datum-ui/utils/timezone.ts`. Consumers can now import them from `@datum-cloud/datum-ui/utils`:

  ```ts
  import {
    toUTCTimestampEndOfDay,
    toUTCTimestampStartOfDay,
  } from "@datum-cloud/datum-ui/utils";
  ```

  No breaking changes.

## 0.7.0

### Minor Changes

- f9b4cb4: Sync behavior and primitives that landed in cloud-portal's vendored `app/modules/datum-ui/` fork between March and April 2026.

  **Added**
  - `useBreakpoint` hook returning `'mobile' | 'tablet' | 'desktop'` tier (SSR-safe, matchMedia-backed).
  - `MobileSheet` base primitive — bottom-sheet wrapper around `Sheet` for mobile UX.
  - `ResponsiveDropdown` base primitive — `DropdownMenu` on desktop/tablet, `MobileSheet` on mobile.
  - `RichTextEditor` feature component (compound API: `RichTextEditor.Toolbar`, `.Bold`, `.Italic`, `.Underline`, `.Strike`, `.Link`, `.Content`, `.CharacterCount`) with TipTap 3.x as optional peer deps.
  - `RichTextContent` read-only renderer with DOMPurify sanitization.
  - Optional Canela font export at `@datum-cloud/datum-ui/styles/canela` (opt-in; default stack is system sans).
  - Mobile long-press tooltip support via `TouchTooltipBubble` (500ms press → show, 1500ms auto-dismiss).
  - `ResponsivePopover` base primitive — `Popover` on desktop/tablet, `MobileSheet` on mobile. Honors `InSheetContext` to avoid sheet-in-sheet stacking.
  - `InSheetContext` / `useInSheet` helper exported from `@datum-cloud/datum-ui/mobile-sheet` — lets nested responsive components detect when they're already inside a sheet and stay as popovers.
  - `MultiSelect` feature component (ported from cloud-portal) with responsive overlay support.

  **Changed**
  - `PageTitle` — title now uses `font-title text-3xl leading-none`, description gains `max-w-2xl`, title span exposes `data-e2e="page-title"`.
  - `TagsInput` — new optional props `delimiters`, `normalizer`, `validator` (Zod); auto-confirms pending input on blur. Defaults preserve existing behavior.
  - `Form.Dialog` — new optional `showHeaderClose` prop (default `true`); passing `false` disables the header close (X).
  - `Form.Field` — label row now uses `items-start` (visual alignment change — multi-line labels now top-align with help icon). New optional `showErrors` prop (default `true`). Help-icon tooltip now wraps responsively on narrow viewports (`w-[calc(100vw-2rem)] sm:w-auto sm:max-w-xs`).
  - `TimeRangePicker` — renders inside `MobileSheet` on mobile viewports; existing Popover behavior preserved on tablet/desktop.
  - `Tooltip` — `TooltipContent` gains `max-w-[calc(100vw-2rem)]` so narrow viewports don't clip long messages.
  - `TaskQueueDropdown` now uses `ResponsiveDropdown` — renders as a bottom sheet on mobile with a "Tasks" title; keeps the desktop dropdown layout (384px fixed width) on ≥768px viewports. `TaskPanelHeader` is hidden on mobile. Upstream's `summaryRenderContent` feature is preserved.
  - `ResponsiveDropdown` gains optional `responsive?: boolean` prop (default `true`) and honors `InSheetContext` — nested instances inside a `MobileSheet` automatically stay as dropdowns to prevent sheet-in-sheet stacking.
  - Popover/dropdown consumers are now responsive by default. Each gains optional `responsive?: boolean` (default `true`) and `sheetTitle?: string` props. Desktop behavior unchanged. Affected: `Combobox`, `Autocomplete`, `Autosearch`, `CalendarDatePicker`, `DateTimePicker`, `MoreActions`, `RichTextEditor` link toolbar, `AbsoluteRangePanel` (TimeRangePicker internal, context-suppressed), `DataTable` row actions and checkbox/select filter popovers.
  - Option-picker components (`Autocomplete`, `MultiSelect`, `Autosearch`, `CheckboxFilter`) now share an internal engine (`useOptionPicker` + `OptionList`) that owns search filtering, keyboard navigation, empty/creatable rows, and virtualization. No public API changes — the refactor is internal and behavior-preserving.
  - `CalendarDatePicker` internally decomposed into 5 focused files (types, hook, header, presets, trigger + composition root). No public API changes — 901 lines → 170-line composition root.
  - `MoreActions` action shape renamed: `action` property → `onClick` for consistency with `DataTable`'s `ActionItem<TData>`. Shared `ActionRow` component extracted; consumed by both `MoreActions` and `DataTable` row actions.
  - `CheckboxFilter` (data-table) is now a thin adapter over `MultiSelect`. Visually matches MultiSelect's badge trigger. No public API change to `FilterCheckboxProps`.
  - `CalendarDatePicker` and `DateTimePicker` share a `useDateConstraints` hook for minDate/maxDate/disablePast/disableFuture constraint derivation (internal, no API change). `DateTimePicker` gains optional `disablePast`/`disableFuture` props.
  - `TimePicker` upgraded from native `<input type="time">` to a scrollable time-slot dropdown (ResponsivePopover + OptionList). Breaking: `step` prop is now in minutes (default 15); native mobile time picker replaced by MobileSheet with time slots.

  **Removed**
  - `Combobox` is removed. Migrate to `Autocomplete` — the APIs overlap for the common case (`options`, `value`, `onValueChange`, `placeholder`, `disabled`). `Autocomplete` additionally supports option grouping, virtualization, custom rendering, and creatable items. `Form.Combobox` continues to work (now wraps `Autocomplete` internally).

  **Dependencies**
  - New optional peer deps: `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-underline`, `@tiptap/extension-character-count`, `@tiptap/extension-placeholder` (all `>=3`, required only if consuming `RichTextEditor`).
  - New runtime dep: `isomorphic-dompurify` (required by `RichTextContent` sanitization).

## 0.6.1

### Patch Changes

- 48e2240: Tighten peer and dependency version ranges following upstream patch releases.
  - `@hookform/resolvers`: `^5` → `^5.2.2`
  - `class-variance-authority`: `^0.7` → `^0.7.1`

  Transitive updates via the inlined shadcn primitives:
  - `@types/geojson`: `^7946` → `^7946.0.16`
  - `@types/leaflet.fullscreen`: `^3` → `^3.0.3`

## 0.6.0

### Minor Changes

- a15efc6: Add pluggable form adapter system supporting Conform.js and React Hook Form

  The form system now uses a pluggable adapter architecture, allowing consumers to choose between Conform.js and React Hook Form as their form library backend.

  **New exports:**
  - `@datum-cloud/datum-ui/form/adapters/conform` - Conform.js adapter (existing behavior)
  - `@datum-cloud/datum-ui/form/adapters/rhf` - React Hook Form adapter (new)

  **Migration:** Wrap your app root with the adapter provider:

  ```tsx
  import { ConformAdapter } from "@datum-cloud/datum-ui/form/adapters/conform";

  function App() {
    return (
      <ConformAdapter>
        {/* existing Form.Root usage unchanged */}
      </ConformAdapter>
    );
  }
  ```

  All existing `Form.*` component APIs remain unchanged. The adapter is selected once at the app level.

## 0.5.0

### Minor Changes

- db5b71d: Add CodeEditor and CodeEditorTabs components - Monaco-based code editor with VS Code UX, dual-format JSON/YAML support, and form integration

## 0.4.0

### Minor Changes

- ce285b3: Expose Avatar component in base components

  This change makes the Avatar component available for import from the main package. The Avatar component provides a user profile picture display with fallback support for initials.

## 0.2.0

### Minor Changes

- 270228f: Overhaul CSS architecture: consumers now own their Tailwind setup. Remove DatumProvider in favor of direct ThemeProvider usage. Theme tokens moved from .theme-alpha scoping to :root/.dark. Remove tw-animate-css and tailwind-scrollbar-hide from package deps. Add ./styles export with "style" condition for PostCSS compatibility.
- 270228f: Add per-component subpath exports so consumers only install peer deps for components they use (e.g. `@datum-cloud/datum-ui/button`). Includes 50 component entries, grouped exports for date-picker/map/dropzone/chart/form, and updated docs/storybook imports.
- dae5ade: Complete restructure of the datum-ui package from a flat component library into a scalable monorepo-based design system with a two-layer architecture (shadcn primitives + datum components), full test suite, Storybook explorer, and Fumadocs documentation site
- dae5ade: Add Typography component (Title, Text, Paragraph, Link, List, Blockquote, Code), Map docs and Storybook stories
- 99e72fd: Ship uncompiled CSS instead of compiled Tailwind output (fixes #16)
  - **Breaking:** Grid and NProgress CSS are now separate optional imports (`@datum-cloud/datum-ui/grid`, `@datum-cloud/datum-ui/nprogress`)
  - **Breaking:** Requires Tailwind CSS v4.0.7+ (v4.2.1+ recommended)
  - Removed CSS compilation from build pipeline — raw CSS files are copied to dist
  - Embedded `@source` directive in shipped CSS for zero-config consumer class scanning
  - Pre-expanded grid system `@apply` directives into self-contained CSS
  - Eliminated duplicate Tailwind stylesheets that caused responsive utility conflicts

### Patch Changes

- 270228f: Fix npm publish lifecycle: restore workspace deps in postpublish instead of postpack so the stripped package.json is used during upload
- 270228f: Fix: republish with workspace dependencies correctly stripped
- dae5ade: Add peer dependency documentation to all component doc pages, fix incorrect dependency listings, and add lucide-react guidance to installation docs
- 270228f: Add package README with full component catalog and AI-friendly documentation, update all docs to show multi-package-manager install tabs

## 0.2.0-alpha.8

### Minor Changes

- 50ce0e8: Ship uncompiled CSS instead of compiled Tailwind output (fixes #16)
  - **Breaking:** Grid and NProgress CSS are now separate optional imports (`@datum-cloud/datum-ui/grid`, `@datum-cloud/datum-ui/nprogress`)
  - **Breaking:** Requires Tailwind CSS v4.0.7+ (v4.2.1+ recommended)
  - Removed CSS compilation from build pipeline — raw CSS files are copied to dist
  - Embedded `@source` directive in shipped CSS for zero-config consumer class scanning
  - Pre-expanded grid system `@apply` directives into self-contained CSS
  - Eliminated duplicate Tailwind stylesheets that caused responsive utility conflicts

## 0.2.0-alpha.7

### Patch Changes

- Fix npm publish lifecycle: restore workspace deps in postpublish instead of postpack so the stripped package.json is used during upload

## 0.2.0-alpha.6

### Patch Changes

- Fix: republish with workspace dependencies correctly stripped

## 0.2.0-alpha.5

### Minor Changes

- Overhaul CSS architecture: consumers now own their Tailwind setup. Remove DatumProvider in favor of direct ThemeProvider usage. Theme tokens moved from .theme-alpha scoping to :root/.dark. Remove tw-animate-css and tailwind-scrollbar-hide from package deps. Add ./styles export with "style" condition for PostCSS compatibility.

## 0.2.0-alpha.4

### Minor Changes

- Add per-component subpath exports so consumers only install peer deps for components they use (e.g. `@datum-cloud/datum-ui/button`). Includes 50 component entries, grouped exports for date-picker/map/dropzone/chart/form, and updated docs/storybook imports.

## 0.2.0-alpha.3

### Patch Changes

- Add package README with full component catalog and AI-friendly documentation, update all docs to show multi-package-manager install tabs

## 0.2.0-alpha.2

### Minor Changes

- d3a7f77: Add Typography component (Title, Text, Paragraph, Link, List, Blockquote, Code), Map docs and Storybook stories

## 0.2.0-alpha.1

### Patch Changes

- Add peer dependency documentation to all component doc pages, fix incorrect dependency listings, and add lucide-react guidance to installation docs

## 0.2.0-alpha.0

### Minor Changes

- Complete restructure of the datum-ui package from a flat component library into a scalable monorepo-based design system with a two-layer architecture (shadcn primitives + datum components), full test suite, Storybook explorer, and Fumadocs documentation site
