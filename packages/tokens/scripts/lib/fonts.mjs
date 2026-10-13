/**
 * Read the naming table of a TrueType/OpenType font.
 *
 * iOS registers embedded fonts under their PostScript name (nameID 6), not the
 * file name, so the generator records it next to each face.
 */

/**
 * @param {Uint8Array} buf
 * @returns {{ family?: string, fullName?: string, postScriptName?: string }} the family (1), full (4) and PostScript (6) names
 */
export function readFontNames(buf) {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength)
  const numTables = view.getUint16(4)
  let nameOffset = -1
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16
    const tag = String.fromCharCode(buf[rec], buf[rec + 1], buf[rec + 2], buf[rec + 3])
    if (tag === 'name') {
      nameOffset = view.getUint32(rec + 8)
      break
    }
  }
  if (nameOffset < 0)
    return {}

  const count = view.getUint16(nameOffset + 2)
  const strings = nameOffset + view.getUint16(nameOffset + 4)
  const found = {}
  for (let i = 0; i < count; i++) {
    const rec = nameOffset + 6 + i * 12
    const platformId = view.getUint16(rec)
    const nameId = view.getUint16(rec + 6)
    const length = view.getUint16(rec + 8)
    const offset = view.getUint16(rec + 10)
    // Windows (3) records are UTF-16BE; Mac Roman (1) records are 8-bit.
    if (platformId !== 3 && platformId !== 1)
      continue
    const bytes = buf.subarray(strings + offset, strings + offset + length)
    let text = ''
    if (platformId === 3) {
      for (let k = 0; k + 1 < bytes.length; k += 2)
        text += String.fromCharCode((bytes[k] << 8) | bytes[k + 1])
    }
    else {
      text = String.fromCharCode(...bytes)
    }
    // Prefer the Windows record when both exist.
    if (found[nameId] === undefined || platformId === 3)
      found[nameId] = text
  }
  return { family: found[1], fullName: found[4], postScriptName: found[6] }
}
