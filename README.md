# datum-ui

This is the Datum UI monorepo. This repo is intended to help our teams and developers speed up development while building sustainable and low carbon footprint user interfaces.

## What's inside?

This monorepo is run on [Bun](https://bun.sh/) and built using [Turborepo](https://turbo.build/repo/). It includes the following packages/apps:

### Apps and Packages

- `docs`: susUI docs repo https://docs.sus-ui.datum.net/
- `operator`: Datum Operator Portal https://console.datum.net/
- `@repo/ui`: susUI component library shared by our other applications
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
- [MUIBase](https://mui.com/base-ui/) for headless accessibility-compliant components
- [Tailwindcss](https://tailwindcss.com/) for styles

### Prerequisites

Datum suggests using [Bun](https://bun.sh/) for its speed and versatility, however, Turborepo supports many of the common package managers such as `npm`, `yarn`, or `pnpm`.

To install Bun run:

```
curl -fsSL https://bun.sh/install | bash
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
bunx turbo login
```

Alternatively, you can log out:

```
bunx turbo logout
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
bunx turbo link
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
