#!/usr/bin/env bash
set -euo pipefail

# Generates a detailed PR description for the "Version Packages" PR.
#
# We deliberately do NOT hand-parse the changeset markdown (quote-sensitive grep
# is brittle and silently produces empty output). Instead we ask changesets for
# its structured release plan via `changeset status --output` and format that
# JSON with a small Node helper. (STRUCT-076)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASE_JSON="$(mktemp)"
trap 'rm -f "$RELEASE_JSON"' EXIT

# `changeset status` diffs against the `main` baseBranch by its local name. The
# Release checkout is a detached SHA with only `origin/main`, so without a local
# `main` status fails, the error is swallowed below, and the PR body reads "No
# changesets found" with no title suffix. fetch-depth: 0 alone does not create it.
# Keep git quiet: stdout is the PR body, and its first line sets the title suffix.
git rev-parse --verify -q refs/heads/main >/dev/null ||
  git branch --no-track main origin/main >/dev/null

# `changeset status` prints a human-readable summary to stdout and writes the
# machine-readable release plan to the --output file. Swallow stdout and a
# non-zero exit (e.g. no changesets) so we can report cleanly from Node.
pnpm changeset status --output="$RELEASE_JSON" >/dev/null 2>&1 || true

node "$SCRIPT_DIR/format-version-pr-body.mjs" "$RELEASE_JSON"
