# Release Workflow

This project uses [Changesets](https://github.com/changesets/changesets) for version management and releases.

## Quick Start

### For Developers (Adding Changes)

When you make changes that should be included in the next release:

```bash
pnpm changeset
```

Follow the prompts:
1. Select the package(s) that changed (usually `@datum-cloud/datum-ui`)
2. Choose version bump type:
   - **patch** - Bug fixes, minor updates (0.3.2 → 0.3.3)
   - **minor** - New features, backward-compatible (0.3.2 → 0.4.0)
   - **major** - Breaking changes (0.3.2 → 1.0.0)
3. Write a summary of the changes (this becomes the changelog entry)

Commit the changeset file with your PR:
```bash
git add .changeset/*.md
git commit -m "feat: add new Button variant"
```

### For Renovate (Automatic)

Renovate PRs **automatically include changesets** - no manual action needed!

## Release Process

### Continuous: Version Packages PR

Every time changes are merged to `main`, the **"Version Packages"** PR is automatically created or updated.

This PR:
- ✅ Bumps version numbers based on changesets
- ✅ Generates CHANGELOG.md entries
- ✅ Removes consumed changeset files
- ✅ Accumulates all changes (features, fixes, dependency updates)

**Do NOT merge this PR yet!** It's just a preview.

### When Ready to Release

1. **Review the "Version Packages" PR**
   - Check the version bump is correct
   - Review the changelog entries
   - Ensure all changes are documented

2. **Merge the "Version Packages" PR**
   - This commits the version bumps to `main`
   - Does NOT publish to npm yet

3. **Create a GitHub Release**
   - Go to [Releases](https://github.com/datum-cloud/datum-ui/releases)
   - Click "Draft a new release"
   - Choose or create a tag: `v{version}` (e.g., `v0.4.0`)
   - Release title: Same as tag (e.g., `v0.4.0`)
   - Description: Copy from CHANGELOG.md or auto-generate
   - Click "Publish release"

4. **Automatic npm Publish**
   - GitHub Actions automatically publishes to npm
   - Published to `@latest` tag
   - Includes npm provenance

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Developer PR with changeset                             │
│ OR Renovate PR (auto-adds changeset)                    │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
         ┌───────────────┐
         │  Merge to main│
         └───────┬───────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ Changesets Action creates/ │
    │ updates "Version Packages" │
    │ PR with all changes batched│
    └─────────────┬──────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Team reviews when  │
         │ ready              │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Merge "Version     │
         │ Packages" PR       │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Create GitHub      │
         │ Release            │
         └────────┬───────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ Auto-publish to npm│
         │ with @latest tag   │
         └────────────────────┘
```

## Example Scenarios

### Scenario 1: Regular Feature Release

1. Developer adds feature in PR with changeset: `minor` - "Add dark mode support"
2. PR merged to main
3. "Version Packages" PR created: `0.3.2 → 0.4.0`
4. Team reviews, approves
5. Merge "Version Packages" PR
6. Create GitHub Release `v0.4.0`
7. Package published to npm

### Scenario 2: Weekly Dependency Updates

1. Monday: Renovate opens 5 PRs (React, TypeScript, ESLint, etc.)
2. Each PR auto-includes a changeset
3. Team merges all 5 PRs throughout the week
4. "Version Packages" PR accumulates all 5 updates: `0.4.0 → 0.4.1`
5. Friday: Team merges "Version Packages" PR
6. Create GitHub Release `v0.4.1`
7. All dependency updates published together

### Scenario 3: Emergency Fix

1. Developer fixes critical bug with changeset: `patch` - "Fix memory leak in DataTable"
2. PR merged immediately
3. "Version Packages" PR created: `0.4.1 → 0.4.2`
4. Merge "Version Packages" PR immediately
5. Create GitHub Release `v0.4.2`
6. Hotfix published to npm

## Commands Reference

```bash
# Add a changeset
pnpm changeset

# Preview what version would be bumped (local only)
pnpm changeset status

# Manually bump versions (CI does this automatically)
pnpm changeset version

# Publish to npm (CI does this automatically)
pnpm changeset publish
```

## Configuration Files

- `.changeset/config.json` - Changesets configuration
- `.github/workflows/release.yml` - GitHub Actions workflow
- `renovate.json` - Renovate config with auto-changeset

## FAQs

**Q: What if I forget to add a changeset?**  
A: The "Version Packages" PR won't include your changes. You can add a changeset retroactively and it will be included in the next release.

**Q: Can I skip changesets for internal changes?**  
A: Yes! Only add changesets for changes that affect end-users. Internal refactoring doesn't need a changeset.

**Q: What about pre-releases (alpha, beta)?**  
A: Use snapshot releases: `pnpm changeset version --snapshot canary` - This is outside normal workflow for testing.

**Q: How do I undo a merged "Version Packages" PR?**  
A: You can revert the PR before creating the GitHub Release. After release, you'd need to publish a new version.

**Q: Why GitHub Release instead of auto-publish on merge?**  
A: It gives the team explicit control over when packages go to production npm registry.

## Troubleshooting

**"Version Packages" PR not created**
- Ensure changesets were added to merged PRs
- Check GitHub Actions logs for errors

**npm publish fails**
- Verify `NPM_TOKEN` secret is set in repository settings
- Check package version doesn't already exist on npm
- Ensure package.json has correct `publishConfig`

**Renovate PRs missing changesets**
- Check `renovate.json` has `postUpgradeTasks` configured
- Renovate bot needs write access to add changeset files
