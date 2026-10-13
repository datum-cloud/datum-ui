/**
 * Closes markdown constructs a streaming answer has opened but not yet
 * closed, so a renderer shows the half-written answer the way it will look
 * finished (a code block stays a code block, bold stays bold) instead of
 * flashing raw syntax until the closing token arrives.
 *
 * Only the tail is repaired; the input is never reordered. Cheap enough to
 * run on every streamed render.
 */
export function repairStreamingMarkdown(text: string): string {
  if (!text)
    return text

  const lines = text.split('\n')
  let inFence = false
  let fence = ''
  for (const line of lines) {
    const match = /^\s{0,3}(`{3,}|~{3,})/.exec(line)
    if (!match)
      continue
    const marker = match[1]!
    if (!inFence) {
      inFence = true
      fence = marker
    }
    else if (marker[0] === fence[0] && marker.length >= fence.length && line.trim() === marker) {
      inFence = false
    }
  }
  if (inFence)
    return `${text}${text.endsWith('\n') ? '' : '\n'}${fence}`

  // Inline constructs only matter on the last (still growing) line.
  const last = lines[lines.length - 1] ?? ''
  let suffix = ''

  // Inline code: an odd number of backticks leaves a span open.
  const ticks = (last.match(/`/g) ?? []).length
  const inCode = ticks % 2 === 1
  if (inCode)
    suffix += '`'

  if (!inCode) {
    // Strip code spans before counting emphasis markers inside them.
    const bare = last.replace(/`[^`]*`/g, '')
    // A link whose URL is still arriving: `[text](http://exa`
    if (/\[[^\]]*\]\([^)\s]*$/.test(bare))
      suffix += ')'
    const strong = (bare.match(/\*\*/g) ?? []).length
    if (strong % 2 === 1)
      suffix += '**'
    const strike = (bare.match(/~~/g) ?? []).length
    if (strike % 2 === 1)
      suffix += '~~'
  }

  // A dangling emphasis opener with nothing after it (`foo **`) renders as
  // literal asterisks either way; drop it instead of closing an empty span.
  if (suffix === '**' && /\*\*\s*$/.test(last))
    return text.replace(/\*\*\s*$/, '')

  return text + suffix
}
