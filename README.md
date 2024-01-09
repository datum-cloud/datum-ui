# datum-ui

This is the Datum UI monorepo. This repo is intended to help our teams and developers speed up development while building sustainable and low carbon footprint user interfaces.

## What's inside?

This monorepo is run on [Bun](https://bun.sh/) and built using [Turborepo](https://turbo.build/repo/). It includes the following packages/apps:

### Apps and Packages

- `docs`: susUI docs repo https://docs.sus-ui.datum.net/
- `operator`: Datum Operator Portal https://console.datum.net/
- `@repo/ui`: susUI component library shared by our other applications
- `@repo/dally`: DAL library for sharing common patterns and functionality in our other apps
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Stack

Our team using this stack for our Turborepo:

- [Bun](https://bun.sh/) to bundle, dev, test, deploy and run apps
- [TypeScript](https://www.typescriptlang.org/) for static type-checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Next.js](https://nextjs.org/) the React frame for the web
- [React](https://react.dev/) for creating user interfaces
- [SWR](https://swr.vercel.app/) for client-side data fetching, caching, and de-deduping API requests
- [HeadlessUI](https://headlessui.com/) for headless accessibility-compliant components
- [Tailwindcss](https://tailwindcss.com/) for styles without leaving TSX syntax

### Prerequisites

Datum suggests using [Bun](https://bun.sh/) for its speed and versatility, however, Turborepo supports many of the common package managers such as `npm`, `yarn`, or `pnpm`.

To install Bun run:

```
curl -fsSL https://bun.sh/install | bash
```

### Build

To build all apps and packages, run the following command:

```
bun run build
```

### Develop

To develop all apps and packages, run the following command:

```
bun install
bun dev
```

Alternatively, you can run a single repo instead of all the repos with the filter argument:

For example to develop on the docs app only run:

```
bun dev --filter docs
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
