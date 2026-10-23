# Release workflow

This repository publishes four npm packages from one release process. One
combined Version PR can publish several packages, and each published package
gets its own git tag and GitHub Release.

Storybook is separate. See [`apps/storybook/RELEASE.md`](../apps/storybook/RELEASE.md).

## What this repo publishes

| Package | Purpose |
| --- | --- |
| `@datum-cloud/datum-ui` | The React design system: components, theme, hooks, icons, utilities, and styles. |
| `@datum-cloud/datum-ui-tokens` | Design tokens (colour, spacing, radius, type, motion) as plain TypeScript, generated from the `datum-ui` CSS. |
| `@datum-cloud/datum-ui-native` | React Native components for the design system, including fonts and assets. |
| `@datum-cloud/datum-ui-assistant-core` | Platform-free core of the Datum assistant: types, message reducers, SSE/A2A stream parsing, and the shared chat transport. |

Only non-private packages under `packages/` publish. Internal workspace
packages such as `@repo/config` and `@repo/shadcn` are private and never
leave the repo.

## The mental model

```
one combined Version PR  ->  N npm publishes  ->  N tags + N GitHub Releases
```

- **One PR.** Every pending changeset accumulates in a single "Version
  Packages" PR. It is not one PR per package.
- **Only the listed packages ship.** Merging the Version PR publishes exactly
  the packages in that PR's publish plan. A package with no changeset is not
  bumped, and it is not published **as long as its current version is already on
  npm**. The plan is registry-driven: an unpublished, non-private workspace
  package is publishable even with no changeset. That is why a new package must
  be listed in `.changeset/config.json` `ignore` until it has been bootstrapped
  (see [Adding a new published package](#adding-a-new-published-package)).
- **One tag and one release per package.** `@datum-cloud/datum-ui@3.7.0` and
  `@datum-cloud/datum-ui-tokens@0.1.1` are separate tags and separate GitHub
  Releases from the same run.

### Worked example

Suppose five PRs merge, but only two of them carry changesets:

- one changeset requests a **minor** bump for `@datum-cloud/datum-ui`
- one changeset requests a **patch** bump for `@datum-cloud/datum-ui-tokens`

The Release workflow opens one Version PR containing:

- `@datum-cloud/datum-ui` `3.6.0` -> `3.7.0` (minor)
- `@datum-cloud/datum-ui-tokens` `0.1.0` -> `0.1.1` (patch)

The title suffix is the highest bump across the PR, so the title ends in
`(minor)`. Merging the PR produces two publishes:

- `@datum-cloud/datum-ui@3.7.0` plus tag and release `@datum-cloud/datum-ui@3.7.0`
- `@datum-cloud/datum-ui-tokens@0.1.1` plus tag and release `@datum-cloud/datum-ui-tokens@0.1.1`

The other three packages do not publish, because their current versions are
already on npm and no changeset bumps them. That is why five merged PRs can
produce two publishes: merged PRs are not the publish set; the changesets and
the registry state are. Versions in this example are the ones current when this
guide was written.

## Who does what

| Role | Responsibility |
| --- | --- |
| Contributor | Add a changeset with `pnpm changeset` when a change should reach npm. Pick the package(s) and the bump type, write a summary, and commit the `.changeset/*.md` file with the PR. |
| Reviewer | Review normal PRs and the Version PR. On the Version PR, check that every listed package should ship and that each bump type and summary is correct. |
| Maintainer | Approve the pending Version PR workflow run, merge the Version PR when the team is ready, watch the Release run, and confirm the expected tags, releases, and provenance exist. |
| Package owner | Bootstrap a newly added package: first manual publish plus the npm trusted-publisher registration, then verify the first CI publish has provenance. |

A contributor can be a reviewer. The only split that matters is that a human
approves the bot-created Version PR run and decides when to merge.

## The flow, step by step

1. **A PR with a changeset merges to `main`.** CI runs lint, typecheck, test,
   build, and the remaining checks.
2. **Release starts after CI succeeds.** `.github/workflows/release.yml` is
   triggered by `workflow_run` when the `CI` workflow completes, and only runs
   jobs for a successful CI run caused by a push to `main`.
3. **`select-mode` decides what this run is.** It emits `mode` (`version`,
   `publish`, or `none`) and, for `publish`, a **publish plan artifact**.
4. **`version` opens or updates the Version PR** when changesets exist. It runs
   `pnpm changeset version`, writes the combined PR body, and sets the title
   suffix from the highest bump. It has no npm or OIDC credential.
5. **A maintainer approves the pending run and merges.** The bot-created PR may
   leave its first CI run at `action_required`. Approve that run, wait for green
   checks, then merge.
6. **CI runs on the merge commit.** When it succeeds, Release runs again.
7. **`select-mode` now reports `publish`.** The merge consumed the changesets,
   so the decision comes from the registry: these package versions are not
   published yet.
8. **`pack` produces the tarballs.** It downloads the `public-packages-dist`
   artifact from the triggering CI run, asserts that every non-private
   `packages/*` package has a `dist/`, and packs only the plan packages.
9. **`publish` publishes the tarballs.** It publishes to npm through OIDC and
   creates one git tag and one GitHub Release per published package.

### The four jobs and what each may do

| Job | Runs when | May do | Must not do |
| --- | --- | --- | --- |
| `select-mode` | Successful CI push to `main` | Read the repo; run `changesets/action/select-mode@v2`; write the mode output and publish plan artifact | Write contents or mint an OIDC token |
| `version` | `mode == version` | Write contents and pull requests; run `pnpm changeset version`; create/edit the Version PR | Publish to npm or mint an OIDC token |
| `pack` | `mode == publish` | Read contents and Actions artifacts; download the CI build; assert `dist/`; run `changesets/action/pack@v2` | Publish to npm or mint an OIDC token |
| `publish` | `mode == publish` | Write contents (tags and releases); mint an OIDC token; run `changesets/action/publish@v2` | Edit pull requests |

The workflow sets `permissions: {}` at the top level and grants each job only
the scopes in this table. Only `publish` has `id-token: write`. `pack` takes no
publish credential at all, so a compromised pack step cannot publish, and the
`version` job cannot mint an OIDC token.

Release concurrency is queued, not cancelled (`cancel-in-progress: false`). A
newer CI run does not kill a publish in flight.

## How detection works

Two different questions are answered by two different sources.

| Question | Source |
| --- | --- |
| What version bump does each package get? | Changeset files in `.changeset/*.md`. `pnpm changeset version` applies them. |
| Which packages still need publishing? | The npm registry. The release action compares each package version with what is already published, then drops packages listed in `.changeset/config.json` `ignore`. |
| What will this run pack and publish? | The publish plan artifact written by `select-mode`. It is the single source of truth for the run. |
| Should CI let this package merge at all? | The guard in the lint job, which classifies each public package against the registry. |

`select-mode` behaves as follows:

- **`version`** — at least one changeset exists. Open or update the combined
  Version PR.
- **`publish`** — no changesets exist, and at least one non-ignored package
  version is not on the registry. The plan lists exactly those non-ignored
  packages.
- **`none`** — no changesets exist and the publish plan is empty (every
  non-ignored package version is already on the registry). No `version`, `pack`,
  or `publish` job runs.

The `none` case is normal after a release, after a docs-only merge, or after a
merge that carried no changeset.

### How to get the mode you want

You do not choose `mode` in the UI or pass a flag. It is derived from what is on
`main` when Release runs. To get a particular mode, change what you merge:

| Intent | What to merge | Mode |
| --- | --- | --- |
| Release | A PR with a changeset, then the Version PR it opens | `version`, then `publish` |
| No release | A PR without a changeset (docs, CI, tests) | `none` |
| Release only some packages | Changesets only on those packages | `version` for that set, then `publish` |
| Bootstrap a new package | The package PR with its name in `.changeset/config.json` `ignore`, no changeset | `none` (the plan skips it) |
| Withhold a package | Remove or hold its changeset before the Version PR is created | `version` without it |

`mode` is visible in the **Select release mode** step of the Release run and in
the `select-mode` job output. There is no manual override: the publish plan
comes from changesets and the registry, not from a person typing a package
list.

### The CI guard

`node .github/scripts/check-npm-packages.mjs` runs in the lint job before a PR
can merge. It looks up every public package on npm and classifies the latest
version:

| Status | Meaning | Effect |
| --- | --- | --- |
| `ok` | Latest version is published with provenance. | Pass. CI can publish the next version. |
| `manual` | The package is on npm, but its latest version has no provenance attestation, usually because it was published by hand. | Warning. The next CI release attaches provenance. |
| `missing` + listed in `.changeset/config.json` `ignore` | The package is not on npm yet and is being bootstrapped. | Warning. Changesets excludes ignored packages from the publish plan, so no publish is attempted. |
| `missing` + not listed in `ignore` | The package is not on npm and the plan would select it. | **Error.** The plan is registry-driven, so Release would try to publish it and fail with `E404`, even if no changeset exists. Add it to `ignore` until it is bootstrapped. |
| registry error | npm could not be reached or returned an unexpected response. | Warning. A registry hiccup does not block unrelated PRs. |

The guard also warns, per package, when `publishConfig.access` is not
`"public"` or `repository.url` does not point at
`https://github.com/datum-cloud/datum-ui`. Both break the npm trust exchange, so
they are surfaced before the next release instead of at publish time.

The script exits non-zero for any error: a missing package that is not in
`ignore`. That is the guard's job — catch the problem before merge instead of at
release time. Ignoring a missing package is the only way it can merge without a
manual first publish.

Run it locally from the repository root (the script resolves packages from
`process.cwd()`):

```bash
node .github/scripts/check-npm-packages.mjs
```

## Trusted publishing

Every npm publish uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers)
with OIDC. There is no long-lived npm token in this repository.

- The `publish` job requests a short-lived OIDC token with `id-token: write`.
  No other job has that permission.
- npm verifies the token against a trusted-publisher binding and returns a
  short-lived publish credential.
- Provenance is attached automatically. You do not pass a provenance flag.
- The workflow **filename** is part of the trust. The binding names
  `release.yml`, so renaming or moving that file silently breaks publishing:
  the job fails auth, and it does not fall back to a token. Do not rename it.
- There is no token fallback by design. A broken trust fails loudly with
  `ENEEDAUTH` instead of publishing without provenance.

### One-time setup per package

The package must already exist on npm. OIDC cannot create a new package; a
human performs the first publish (see the next section). Then, on a machine
with npm `>= 11.15` and 2FA enabled on the npm account:

```bash
npm trust github @datum-cloud/datum-ui-tokens \
  --file release.yml --repo datum-cloud/datum-ui --allow-publish
```

Repeat for every package that publishes from this workflow:

```bash
npm trust github @datum-cloud/datum-ui-native \
  --file release.yml --repo datum-cloud/datum-ui --allow-publish
npm trust github @datum-cloud/datum-ui-assistant-core \
  --file release.yml --repo datum-cloud/datum-ui --allow-publish
```

`@datum-cloud/datum-ui` was the first package bound to this workflow. Confirm
the other three have a matching trust entry before relying on CI to publish
them. The `manual` status in the guard is a reminder that a package exists but
has not yet been proven through a CI publish.

After registering trust, validate with a patch release and confirm that version
has provenance before treating the package as ready. npm versions are permanent,
so pick a version you are willing to keep.

## Adding a new published package

A new package needs two merges. The first gets reviewed code onto `main`
without asking npm to create the package. The second asks CI to publish it.
This is deliberate: it keeps unreviewed code off npm and lets the first publish
come from reviewed `main`.

### Why the first merge must add the package to `ignore`

The publish plan is **registry-driven**, not changeset-driven. Any non-private
workspace package whose version is absent from npm is in the plan, even when no
changeset names it. A brand-new `0.1.0` package would therefore be selected on
the first Release run after it lands: `select-mode` would return `publish`, and
`publish` would fail with `E404`, because OIDC can only publish a version of a
package that already exists.

Listing the package in `.changeset/config.json` `"ignore"` is what prevents
that. Changesets excludes ignored packages from the publish plan, so the plan
skips it and no publish is attempted. **The step is not optional:** the guard in
the lint job fails the PR when a public package is missing from npm and is not
listed in `ignore`, because the registry-driven plan would publish it. The
`ignore` entry is mandatory, not advisory.

### Before the first merge

The package manifest needs:

- a unique `name` and a `version`
- `"publishConfig": { "access": "public" }`
- `"repository": { "url": "https://github.com/datum-cloud/datum-ui" }` (a
  `directory` field is fine)
- `files` including `dist`
- a build that writes `packages/<pkg>/dist/` — the CI artifact upload is
  `packages/*/dist/`, so a package with the standard layout is picked up
  without editing the workflow

Then:

1. **Add the package name to `.changeset/config.json` `"ignore"` in the same
   PR, and merge that PR without a changeset.**

   ```json
   "ignore": ["@datum-cloud/datum-ui-example"]
   ```

   The publish plan skips the package, so no publish is attempted and the
   guard's `missing` warning describes the real state. Without the entry, the
   guard fails the PR. If another published package depends on the new one, add
   those dependents to `ignore` too: changesets rejects a skipped package that a
   non-skipped package depends on.

2. **From a clean `main`, perform the first publish by hand.**

   ```bash
   pnpm --filter <pkg> build
   pnpm --filter <pkg> publish --access public --no-git-checks
   ```

3. **Register the trusted publisher.**

   ```bash
   npm trust github <pkg> --file release.yml --repo datum-cloud/datum-ui --allow-publish
   ```

4. **Open a follow-up PR that removes the package from `ignore` and adds a
   changeset.** The guard reports `manual` (warning) once the package is on
   npm. Merge the PR; Release opens the Version PR. Approve and merge the
   Version PR, and that merge publishes the next version through OIDC.
5. **Verify provenance.** The guard reports `ok` on the next PR, and:

   ```bash
   npm view <pkg>@<version> dist.attestations --json
   ```

Together, the `ignore` entry and the guard turn the "new package at release
time" failure into a review-time step: the first merge stays out of the publish
plan, and a changeset that targets a `missing` package fails CI on purpose.

## Maintainer release checklist

1. **Review the Version PR body.** It has one section per releasing package
   with the bump type and the changeset summaries. The title suffix is the
   highest bump in the PR (`major` > `minor` > `patch`).
2. **Confirm every listed package should ship.** `pnpm changeset version`
   already ran in the Version PR branch: the changesets are consumed and their
   `.changeset/*.md` files are deleted there, so there is nothing left to remove
   or hold in the PR itself. If the PR contains a package you do not want to
   ship, do not merge it. Close it, then remove or hold that changeset on
   `main` (where the file still exists) before the next Release run recreates
   the Version PR, or edit the Version PR to revert that package's version bump
   and changelog. There is no per-package publish button later.
3. **Approve the pending workflow run.** A bot-created Version PR can show
   `action_required` on its first CI run. Open the PR's Checks tab, approve the
   run, and wait for green checks. The workflow run does not start until you
   approve it.
4. **Merge the Version PR.** This is the publish decision. Merging publishes the
   listed packages; there is no separate release step.
5. **Watch the Release run.** It starts after CI on the merge commit succeeds.
   Confirm `select-mode` reports `publish`, the plan lists only the expected
   packages, `pack` succeeds, and `publish` succeeds.
6. **Confirm the output.** There is one npm version, one tag, and one GitHub
   Release per published package, for example
   `@datum-cloud/datum-ui@3.7.0` and
   `@datum-cloud/datum-ui-tokens@0.1.1`.
7. **Confirm provenance.** Check the npm package page, or:

   ```bash
   npm view <pkg>@<version> dist.attestations --json
   ```

8. **If the run fails partway,** re-run Release on the same SHA after fixing the
   cause. Already-published versions are skipped and the remainder publishes.
   Tags and releases are not reconciled by a re-run; see the troubleshooting
   table.

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `E404` / `PUT .../<pkg>` on publish | The package is not on npm. OIDC cannot create a package. | Bootstrap it with one manual publish of that version, register `npm trust`, then re-run Release; the now-published version drops out of the plan. The bootstrap runbook prevents this by adding the package to `ignore` first. |
| `ENEEDAUTH` | No trusted-publisher entry, or the entry names a different repo or workflow filename. | Re-register with `npm trust github <pkg> --file release.yml --repo datum-cloud/datum-ui --allow-publish`, then re-run Release. Do not add a token. |
| Some packages published, run exited 1 | Partial publish, often one bad package or a failed tag/release step. | Fix the cause and re-run Release on the same SHA. Changesets skips versions already on npm and publishes the remainder. |
| Package is on npm, but its tag or GitHub Release is missing | The run failed after publishing, or the version was published by hand. | Create them manually: `git tag '@datum-cloud/datum-ui@3.7.0' <sha>`, `git push origin '@datum-cloud/datum-ui@3.7.0'`, then `gh release create '@datum-cloud/datum-ui@3.7.0' --title '@datum-cloud/datum-ui@3.7.0' --notes-file <notes.md>`. A re-run will not recreate them. |
| `pack` fails downloading `public-packages-dist` | The CI artifact expired (retention is 7 days) or the triggering run did not upload it. | Re-run CI on the same SHA so a fresh artifact exists; its completion triggers Release again. Otherwise land a new commit with the fix. |
| Version PR checks sit at `action_required` | GitHub is holding the first workflow run for a bot-authored PR until a human approves it. | Open the PR's Checks tab, approve the pending run, wait for green, then merge. |
| Trust exchange denied with a correct-looking setup | `repository.url` in the package manifest does not point at `datum-cloud/datum-ui`, or the package has no matching trust entry. | Fix `repository.url`, open a PR with a changeset, and merge it. That triggers `version`, which opens or updates the Version PR; approve and merge that Version PR. The publish runs on that merge. An existing version cannot be republished. |
| Release ran but did nothing | `select-mode` returned `none`: no changesets and every non-ignored version is already on npm. | Expected. Merge a changeset if a release was intended. |

## FAQ

**Why did only two packages publish when five PRs merged?**

Five PRs merged, but only two carried changesets (or the other changesets
targeted packages whose versions were already on npm). The Version PR bumps only
packages named by changesets, and the publish plan contains only versions not
already on npm, minus packages listed in `.changeset/config.json` `ignore`.
Merged PRs are not the publish set.

**Why does the Version PR wait for me before its checks run?**

The Version PR is created by a bot using the workflow token. GitHub holds the
first workflow run for approval, which appears as `action_required`. Nothing is
wrong: approve the pending run in the PR's Checks tab, then wait for the checks
to finish before merging.

**What do I do if a package published but its release is missing?**

Create the tag and GitHub Release manually (commands in the troubleshooting
table). A re-run will not do it, because the version is already on npm and is
therefore excluded from the publish plan.

**Why one PR and N releases?**

One Version PR keeps review in one place: all bumps and changelog entries are
visible together, and the merge is a single decision. The publishes and releases
stay per package because each npm package has its own version, tag, and release
notes.

**Why not build only the changed packages?**

The full build is cheap in practice — roughly 25 seconds in the Build job on
the runs we measured, and Build already waits on Test — so filtering saves
little on the critical path. Treat that figure as an observation, not a
guarantee. More importantly, the Version PR merge changes only `package.json`
and `CHANGELOG` files, so "what changed in the last commit" is not the publish
set. A changeset can also bump a package with no source change, for example
through `updateInternalDependencies: patch`. Building everything and packing
only the plan packages is simpler and means npm receives exactly the artifact
CI validated. If CI time becomes a real problem, the fallback is to build the plan
packages inside `pack`, which trades "publish what CI validated" for a fresh
build.

**Why can a re-run not recreate a missing tag?**

The publish action tags what it publishes. A version already on npm is skipped
by the plan, so the action never sees it again. Re-running repairs publishes,
not tags or releases; reconcile those by hand.

**Why is there no long-lived npm token any more?**

A long-lived token is a secret that must be stored, rotated, and could leak, and
it can publish without provenance if trust breaks. OIDC issues a short-lived
credential per run, scoped to this repository and `release.yml`, and attaches
provenance automatically. Removing the fallback is intentional: a broken trust
fails loudly instead of publishing quietly through a token.

**What does "manual" mean in the guard?**

The package is on npm, but the latest version has no provenance attestation,
which usually means a human published it. It is a warning, not a failure. The
next CI release attaches provenance and the package becomes `ok`. The guard
cannot prove the trusted-publisher entry exists until CI publishes once.

## File map

### Workflow jobs

| Path | Contents |
| --- | --- |
| `.github/workflows/release.yml` | `select-mode` -> `version` or `pack` -> `publish`. Runs after successful CI on `main`. |
| `.github/workflows/ci.yml` | Lint (includes the npm guard and script tests), typecheck, test, build, Storybook checks. Uploads `public-packages-dist`. |
| `.github/workflows/renovate-changeset.yml` | Adds a patch changeset to Renovate PRs labelled `runtime-deps`. |

### CI artifacts

| Artifact | Contents | Used by |
| --- | --- | --- |
| `public-packages-dist` | `packages/*/dist/`, plus `packages/native/fonts/` and `packages/native/assets/`. Retention: 7 days. | `pack` |
| `datum-ui-dist` | `packages/datum-ui/dist/` only. | Storybook build |

### Release scripts

| Path | Purpose |
| --- | --- |
| `.github/scripts/check-npm-packages.mjs` | CI guard: classifies every public package as `ok`, `manual`, `missing`, or a registry error, against the changesets `ignore` list, and warns on manifest issues that break trusted publishing. |
| `.github/scripts/assert-public-dist.mjs` | Fails `pack` if any non-private `packages/*` package has no `dist/`. |
| `.github/scripts/generate-version-pr-body.sh` | Asks `changeset status` for the release plan JSON and pipes it to the formatter. |
| `.github/scripts/format-version-pr-body.mjs` | Builds the Version PR body and bump type from that JSON. |

Related: `.github/scripts/renovate-changeset.sh` writes the Renovate
runtime-dependency changeset, and `.github/scripts/lib/npm-packages.mjs`
contains the registry lookup, the changesets `ignore` reader, the manifest
warnings, and the classification used by the guard.

### Configuration and design

| Path | Purpose |
| --- | --- |
| `.changeset/config.json` | Changesets configuration: `baseBranch: main`, public access, internal dependency updates, and `ignore` (packages excluded from the publish plan while they are being bootstrapped). |
| `renovate.json` | Labels `dependencies` updates `runtime-deps`; devDependency-only updates get no changeset. |
| `docs/superpowers/specs/2026-10-23-multi-package-release-flow-design.md` | Design spec (local only; `/docs/` is gitignored). |
| `docs/superpowers/plans/2026-10-23-multi-package-release-flow.md` | Implementation plan (local only). |

## Glossary

| Term | Meaning |
| --- | --- |
| **Changeset** | A markdown file in `.changeset/` that names package(s) and a bump type and summarises the change. `pnpm changeset` creates one. |
| **Version PR** | The combined "Version Packages" pull request. It applies all pending changesets to versions and changelogs. Merging it is the publish decision. |
| **Publish plan** | The artifact emitted by `select-mode` that lists exactly which packages this run will pack and publish. It is registry-driven and excludes packages in `.changeset/config.json` `ignore`. It is the source of truth for the run. |
| **Pack** | Turning a built package directory into a `.tgz` tarball with `pnpm pack`. Packing does not build; it ships what is on disk, which is why `assert-public-dist.mjs` runs first. |
| **Trusted publisher** | An npm-side binding that lets a specific GitHub repository and workflow file publish a package through OIDC instead of a token. |
| **Provenance** | A signed npm attestation recording which repository, workflow, and commit built the published tarball. CI attaches it automatically. |
| **OIDC** | OpenID Connect. GitHub issues a short-lived identity token to a job; npm exchanges it for a short-lived publish credential. |
