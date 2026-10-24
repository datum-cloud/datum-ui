// Guards the publish path for every public workspace package.
//
// npm trusted publishing cannot create a brand-new package through OIDC, so
// Release would 404 on it. Each package is therefore classified by what the
// registry says about its latest version:
//
//   ok       published with provenance -- CI can publish the next version
//   manual   published, but the latest version has no provenance attestation
//            (a manual publish); the next CI release attaches provenance
//   missing  not on npm at all
//
// The publish plan is registry-driven: it selects any non-private package whose
// version is absent from npm, even when no changeset names it. A missing
// package is therefore an error unless `.changeset/config.json` `ignore` lists
// it, because otherwise the next Release would try to publish it and fail with
// E404. Ignored packages are bootstrapping and warn instead. Registry failures
// also warn so a registry hiccup cannot block unrelated PRs.
//
// Manifest problems that break the npm trust exchange (a non-public
// publishConfig.access, or a repository.url that is not this repository) are
// reported as warnings before the registry result.
import path from 'node:path'
import {
  classify,
  ignoredPackages,
  lookup,
  manifestWarnings,
  packagesInChangesets,
  publicPackages,
} from './lib/npm-packages.mjs'

const root = process.cwd()
const targeted = packagesInChangesets(root)
const ignored = ignoredPackages(root)
let errors = 0

for (const { file, pkg } of publicPackages(root)) {
  const relative = path.relative(root, file)

  for (const message of manifestWarnings(pkg)) {
    console.log(`::warning file=${relative}::${pkg.name}: ${message}`)
  }

  const result = await lookup(pkg.name)
  const { level, message } = classify(
    pkg.name,
    result,
    targeted.has(pkg.name),
    ignored.has(pkg.name),
  )

  if (level === 'pass') {
    console.log(`ok ${relative}: ${message}`)
  } else {
    console.log(`::${level} file=${relative}::${pkg.name}: ${message}`)
  }
  if (level === 'error') errors += 1
}

if (errors > 0) process.exitCode = 1
