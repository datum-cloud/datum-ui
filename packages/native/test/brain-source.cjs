/**
 * Extract the viewBox and path data from the web assistant's BrainGlyph, so the
 * native port can be checked against it.
 */
const fs = require('node:fs')
const path = require('node:path')

const FILE = path.resolve(__dirname, '../../datum-ui/src/components/features/assistant/components/brain-glyph.tsx')

function readWebBrain() {
  const src = fs.readFileSync(FILE, 'utf8')
  return { viewBox: /viewBox="([^"]+)"/.exec(src)[1], d: /\bd="([^"]+)"/.exec(src)[1] }
}

module.exports = { readWebBrain }
