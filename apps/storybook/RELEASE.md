# Storybook Release Guide

## Staging (automatic)

Merging to `main` with changes in `apps/storybook/`, `packages/datum-ui/`,
or `packages/shadcn/` automatically publishes a pre-release build to staging.

## Production

1. Create a changeset:

   ```bash
   pnpm changeset
   ```

   Select `@repo/storybook` and choose the bump type (patch/minor/major).

2. Commit the changeset and merge your PR to `main`.

3. The "Version Packages" PR is created automatically. Review and merge it.

4. On merge, a `storybook-v{version}` git tag is created and the
   production build is published automatically.

## Environments

| Environment | URL                             | Trigger           |
| ----------- | ------------------------------- | ----------------- |
| Staging     | storybook.staging.env.datum.net | Push to main      |
| Production  | storybook.datum.net             | storybook-v\* tag |

## Architecture

- **Docker image:** `ghcr.io/datum-cloud/datum-storybook`
- **OCI kustomize bundle:** `ghcr.io/datum-cloud/datum-storybook-kustomize`
- **Deployment:** FluxCD GitOps via [datum-cloud/infra](https://github.com/datum-cloud/infra)
- **Container:** Nginx serving static build on port 8080
