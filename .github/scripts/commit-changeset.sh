#!/usr/bin/env bash
set -euo pipefail

changeset=.changeset/renovate-dependencies.md

bash .github/scripts/renovate-changeset.sh

if [ -z "$(git status --porcelain -- "$changeset")" ]; then
  exit 0
fi

EXPECTED_HEAD=$(git rev-parse HEAD)
export EXPECTED_HEAD

status=0
scripts/sign-commit "$BRANCH" "chore(deps): add runtime-dependency changeset" "$changeset" || status=$?
if [ "$status" -eq 3 ]; then
  echo "::notice::The branch moved while the changeset was prepared; the next run commits it."
  exit 0
fi
exit "$status"
