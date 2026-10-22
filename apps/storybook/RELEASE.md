# Storybook Release Guide

Storybook ships as a container image and a kustomize bundle. The
[infra](https://github.com/datum-cloud/infra) repo deploys both with Flux
(`apps/datum-storybook`).

## Staging (automatic)

Every push to `main` runs `.github/workflows/publish-storybook.yml`, which
publishes:

- `ghcr.io/datum-cloud/datum-storybook:v0.0.0-main-<YYYYMMDD>-<HHMMSS>`
- `ghcr.io/datum-cloud/datum-storybook-kustomize` with the same tag

Staging follows the newest `v0.0.0-main-*` bundle, so a merge reaches
storybook.staging.env.datum.net in a few minutes.

## Production

Production follows the highest stable semver bundle (`>= 0.0.0`). A GitHub
release creates that tag.

1. Check that staging runs the commit you want to ship and looks right.
2. Pick the next version after the latest `vX.Y.Z` release on the
   [Releases](https://github.com/datum-cloud/datum-ui/releases) page.
3. Create the release from that commit:

   ```bash
   gh release create vX.Y.Z --target <sha> --title "Storybook vX.Y.Z" --notes-file notes.md
   ```

4. The `release: published` event runs the publish workflow. It tags the image
   and bundle `vX.Y.Z`, `vX.Y` and `vX`. Flux picks up the bundle within a few
   minutes.

Use plain `vX.Y.Z` tags. The `@datum-cloud/datum-ui@*` tags belong to the npm
package, and the old `storybook-v*` tags no longer deploy. The `version` in
`apps/storybook/package.json` comes from changesets and does not set the
release version.

The Storybook image builds `datum-ui` from the workspace, not from npm. A
failed npm publish in the Release workflow does not block a Storybook release.

### Hotfix

To ship a fix without the rest of `main`, branch from the current production
tag, apply the fix, and create the release from that branch's commit. Land the
same fix on `main` so the next release keeps it. `v2.0.2` followed this path.

## Environments

| Environment | URL                             | Trigger                 |
| ----------- | ------------------------------- | ----------------------- |
| Staging     | storybook.staging.env.datum.net | Push to `main`          |
| Production  | storybook.prod.env.datum.net    | GitHub `vX.Y.Z` release |

## Architecture

- **Image:** `ghcr.io/datum-cloud/datum-storybook`, a static build served by
  static-web-server on port 8080
- **Bundle:** `ghcr.io/datum-cloud/datum-storybook-kustomize`, built from
  `apps/storybook/config/base`
- **CI check:** the "Build Storybook image" job in `ci.yml` builds the image on
  every pull request, so a change that breaks it fails before merge
