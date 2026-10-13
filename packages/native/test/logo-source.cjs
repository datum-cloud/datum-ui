/**
 * Extract the viewBox and path data (with their mark/text slot) from the web
 * logo components, so the native port can be checked against them.
 */
const fs = require('node:fs')
const path = require('node:path')

const LOGO_DIR = path.resolve(__dirname, '../../datum-ui/src/components/features/logo')

function readWebLogo(file) {
  const src = fs.readFileSync(path.join(LOGO_DIR, file), 'utf8')
  const viewBox = /viewBox="([^"]+)"/.exec(src)[1]
  const paths = [...src.matchAll(/<path\s+className=\{(mark|text)\}\s+d="([^"]+)"/g)].map(m => ({
    slot: m[1],
    d: m[2],
  }))
  return { viewBox, paths }
}

module.exports = { readWebLogo }
