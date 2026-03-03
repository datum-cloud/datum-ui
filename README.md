<p align="center">
  <img
    width="64px"
    src="assets/logo.png"
    style="border: 1px solid #e5e7eb; border-radius: 0.5rem;"
  />

  <h1 align="center">Datum UI</h1>

  <p align="center">
    Datum Cloud Design System & Component Library
  </p>
</p>

---

## About

Datum UI is Datum Cloud's design system and React component library. It provides themed, composable components built on [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com), and [Tailwind CSS v4](https://tailwindcss.com) with a Figma-driven design token pipeline.

### Key Features

- **50+ Components** — Buttons, forms, data tables, dialogs, maps, typography, navigation, and more
- **Two-Layer Architecture** — shadcn/Radix primitives (base) + Datum-customized components (features)
- **Compound Form System** — Built on Conform.js and Zod with validation, field arrays, and multi-step support
- **Interactive Maps** — SSR-safe Leaflet integration with drawing tools, layers, clustering, and fullscreen
- **Task Queue** — Background task engine with progress UI, retry logic, and summary dialogs
- **Design Token Pipeline** — Figma tokens → purpose tokens → theme classes
- **Dark Mode** — Built-in theme provider with system preference detection
- **TypeScript** — Fully typed with exported types for all components

### Built With

- **React 19** — Latest React with server component support
- **Tailwind CSS v4** — Utility-first CSS framework
- **Radix UI** — Accessible, unstyled primitives
- **shadcn/ui** — Component foundation layer
- **CVA** — Class-variance-authority for variant-based component APIs
- **Conform.js + Zod** — Form state management and schema validation

---

## Monorepo Structure

```
packages/
  datum-ui/        # Component library (@datum-cloud/datum-ui)
  shadcn/          # shadcn/ui primitives (@repo/shadcn)
  config/          # Shared config (TypeScript, Tailwind, ESLint)
apps/
  docs/            # Fumadocs documentation site
  storybook/       # Storybook component explorer
```

| Package | Description | npm |
|---|---|---|
| `@datum-cloud/datum-ui` | Published component library | [![npm](https://img.shields.io/npm/v/@datum-cloud/datum-ui)](https://www.npmjs.com/package/@datum-cloud/datum-ui) |
| `@repo/shadcn` | Internal shadcn/ui primitives | — |
| `@repo/config` | Shared TypeScript, Tailwind, and ESLint config | — |

---

## Prerequisites

- **Node.js >= 24** — Required for ESM module resolution with pnpm's strict dependency linking
- **pnpm >= 10** — Monorepo package manager

## Quick Start (Development)

```bash
# Clone and install
git clone https://github.com/datum-cloud/datum-ui.git
cd datum-ui
pnpm install

# Start Storybook (component explorer)
pnpm --filter @repo/storybook dev

# Start documentation site
pnpm --filter @repo/docs dev

# Build the component library
pnpm --filter @datum-cloud/datum-ui build

# Run all checks
pnpm --filter @datum-cloud/datum-ui typecheck
pnpm --filter @datum-cloud/datum-ui lint
pnpm --filter @datum-cloud/datum-ui test
```

> **Note:** Apps auto-build `@datum-cloud/datum-ui` before starting via a `predev` script.

---

## Usage (Consumers)

Install the package:

```bash
npm install @datum-cloud/datum-ui
# or
yarn add @datum-cloud/datum-ui
# or
pnpm add @datum-cloud/datum-ui
# or
bun add @datum-cloud/datum-ui
```

Wrap your app with `DatumProvider` and import styles:

```tsx
import { DatumProvider, Button, Input } from '@datum-cloud/datum-ui'
import '@datum-cloud/datum-ui/styles'

function App() {
  return (
    <DatumProvider>
      <Input placeholder="Enter your name" />
      <Button type="primary" theme="solid">
        Submit
      </Button>
    </DatumProvider>
  )
}
```

### Entry Points

| Import Path | Description |
|---|---|
| `@datum-cloud/datum-ui` | All components, hooks, providers, and utilities |
| `@datum-cloud/datum-ui/components` | Components only (base + features) |
| `@datum-cloud/datum-ui/providers` | `DatumProvider` |
| `@datum-cloud/datum-ui/hooks` | `useCopyToClipboard`, `useDebounce` |
| `@datum-cloud/datum-ui/icons` | `CloseIcon`, `IconWrapper`, `SpinnerIcon` |
| `@datum-cloud/datum-ui/utils` | `cn` (className merge utility) |
| `@datum-cloud/datum-ui/styles` | Global CSS (fonts, tokens, component styles) |

### Peer Dependencies

All peer dependencies are **optional** — install only what you use.

> Replace `npm install` with `yarn add`, `pnpm add`, or `bun add` for your package manager.

```bash
# Core (required)
npm install react react-dom

# Forms
npm install @conform-to/react @conform-to/zod zod

# Maps
npm install leaflet react-leaflet leaflet-draw leaflet.fullscreen leaflet.markercluster react-leaflet-markercluster

# Charts
npm install recharts

# Date pickers
npm install react-day-picker date-fns date-fns-tz

# Animations
npm install motion
```

See the full peer dependency list in the [package README](packages/datum-ui/README.md).

---

## Component Overview

### Base Components (30)

Thin wrappers around shadcn/Radix primitives with Datum styling.

`Alert` · `Badge` · `Breadcrumb` · `Button` · `ButtonGroup` · `Calendar` · `Card` · `Chart` · `Checkbox` · `Collapsible` · `Command` · `Dialog` · `HoverCard` · `Input` · `InputGroup` · `Label` · `Map` · `PlaceAutocomplete` · `Popover` · `RadioGroup` · `Select` · `Separator` · `Sheet` · `Skeleton` · `Spinner` · `Switch` · `Table` · `Tabs` · `Textarea` · `Tooltip` · `Typography` · `VisuallyHidden`

### Feature Components (18)

Complex, fully-customized components with significant business logic.

`Autocomplete` · `AvatarStack` · `CalendarDatePicker` · `Dropdown` · `Dropzone` · `EmptyContent` · `FileInputButton` · `Form` · `Grid` · `InputNumber` · `InputWithAddons` · `LoaderOverlay` · `MoreActions` · `NProgress` · `PageTitle` · `Sidebar` · `Stepper` · `TagInput` · `TaskQueue` · `TimeRangePicker` · `Toast`

For the complete component API with props, sub-components, and usage examples, see the [package README](packages/datum-ui/README.md).

---

## Documentation

- **[Package README](packages/datum-ui/README.md)** — Full component catalog, API reference, and usage examples
- **[Documentation Site](apps/docs/)** — Component docs, guides, and live previews
- **[Storybook](apps/storybook/)** — Interactive component explorer

---

## Contributing

```bash
# 1. Create a feature branch
git checkout -b feat/my-feature

# 2. Make changes and verify
pnpm --filter @datum-cloud/datum-ui build
pnpm --filter @datum-cloud/datum-ui typecheck
pnpm --filter @datum-cloud/datum-ui lint
pnpm --filter @datum-cloud/datum-ui test

# 3. Add a changeset
pnpm changeset

# 4. Commit and push
git add .
git commit -m "feat: description of changes"
git push -u origin feat/my-feature
```

## License

MIT
