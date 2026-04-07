# Datum Storybook

Interactive component documentation for the [Datum design system](https://www.npmjs.com/package/@datum-cloud/datum-ui). Browse, test, and explore all UI components with live examples and controls.

## Getting Started

```bash
# Install dependencies (from repo root)
pnpm install

# Start dev server
pnpm --filter @repo/storybook dev
```

Open [http://localhost:6006](http://localhost:6006) to view the Storybook.

## Scripts

| Command                                   | Description              |
| ----------------------------------------- | ------------------------ |
| `pnpm --filter @repo/storybook dev`       | Start development server |
| `pnpm --filter @repo/storybook build`     | Build static site        |
| `pnpm --filter @repo/storybook lint`      | Run ESLint               |
| `pnpm --filter @repo/storybook typecheck` | Run TypeScript checks    |

## Writing Stories

Stories live in `stories/` organized by category:

- **`stories/base/`** — Core components (Button, Input, Card, etc.)
- **`stories/features/`** — Composite components (DataTable, Form, Dropzone, etc.)
- **`stories/helpers/`** — Shared decorators and mock data

Each story file follows the [Component Story Format (CSF)](https://storybook.js.org/docs/api/csf).

## Contributing

See the [release guide](./RELEASE.md) for how staging and production deployments work.
