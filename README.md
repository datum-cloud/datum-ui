# Datum UI

This repository contains the code for the [Datum](https://docs.datum.net) [operator portal](https://console.datum.net). 

> This repository is experimental meaning that it's based on untested ideas or techniques and not yet established or finalized!
> This means that support is best effort (at best!) and we strongly encourage you to NOT use this in production - reach out to [@matoszz](https://github.com/matoszz) with any questions regarding timeline, roadmap, etc.

## Overview

This monorepo is run on [Bun](https://bun.sh/) and built using [Turborepo](https://turbo.build/repo/). It includes the following packages/apps:

- `operator`: Datum Operator Portal https://console.datum.net/
- `@repo/ui`: susUI component library shared by our other applications
- `@repo/dally`: DAL library for sharing common patterns and functionality in our other apps
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

These apps / packages are built with the following tools and frameworks:

- [Bun](https://bun.sh/) to bundle, dev, test, deploy and run apps
- [TypeScript](https://www.typescriptlang.org/) for static type-checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Next.js](https://nextjs.org/) the React frame for the web
- [React](https://react.dev/) for creating user interfaces
- [SWR](https://swr.vercel.app/) for client-side data fetching, caching, and de-deduping API requests
- [HeadlessUI](https://headlessui.com/) for headless accessibility-compliant components
- [Tailwindcss](https://tailwindcss.com/) for styles without leaving TSX syntax

## Prerequisites

We've chosen to use [Turboo](https://turbo.build/) for our bundler and build systems and [Bun](https://bun.sh/) for package management, and have a [Taskfile] setup for several convenient actions which occur across the various components used within this repo.

[Install task](https://taskfile.dev/installation/) to take advantage of some of the automation; you can use `bun` or `turbo` to do common things such as `turbo build` or `turbo dev`; see the Taskfile or run `task` to have the available commands and descriptions echo'd out for you. 

## Development

Given this is a mono-repo setup, we're making potentially many apps with shared configurations. This is called "workspaces". If you look at some of the structure we've setup below:

- apps/docs: nextjs with typescript
- apps/operator: nextjs with typescript
- packages/ui: shared React component library
- packages/eslint-config: Shared configuration (ESLint)
- packages/typescript-config: Shared TypeScript `tsconfig.json`

Each of these is a workspace - a folder containing a `package.json`. Each workspace can declare its own dependencies, run its own scripts, and export code for other workspaces to use. When you run tasks with `turbo`, such as `turbo lint`, Turborepo looks at each lint script in each workspace and runs it.

### Shared components

As an example, if you look within `packages/typescript-config` you will see the that the name of the package is `@repo/typescript-config`, but if you look within `apps/docs/tsconfig.json` you'll see we're importing `@repo/typescript-config/nextjs.json` directly into our `tsconfig.json` file.

This pattern allows for a monorepo to share a single `tsconfig.json` across all its workspaces, reducing code duplication.
