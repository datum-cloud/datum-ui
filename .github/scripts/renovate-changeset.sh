#!/usr/bin/env bash
set -euo pipefail

# Creates a real patch changeset for a Renovate runtime-dependency upgrade so the
# bump flows through changesets into an actual @datum-cloud/datum-ui release,
# instead of an empty changeset that can never produce one. (STRUCT-075)
#
# Invoked as a Renovate postUpgradeTask in `executionMode: branch`, so it runs
# once per upgrade branch. Pure devDependency bumps do not run this task and so
# intentionally produce no changeset.

CHANGESET_FILE=".changeset/renovate-dependencies.md"

mkdir -p .changeset

# Only create the changeset once per branch.
if [ -f "$CHANGESET_FILE" ]; then
  exit 0
fi

cat > "$CHANGESET_FILE" <<'EOF'
---
'@datum-cloud/datum-ui': patch
---

Update runtime dependencies.
EOF
