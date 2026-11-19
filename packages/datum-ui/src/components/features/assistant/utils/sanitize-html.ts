const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => HTML_ESCAPE_MAP[c]!)
}

const ALLOWED_TAGS = new Set(['p', 'strong', 'em', 'u', 's', 'br'])

/** Whitelist-sanitize the tiptap-authored HTML of a user message before render. */
export function sanitizeUserHtml(raw: string): string {
  const doc = new DOMParser().parseFromString(raw, 'text/html')

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(node.textContent ?? '')
    }
    if (node.nodeType !== Node.ELEMENT_NODE)
      return ''

    const el = node as Element
    const tag = el.tagName.toLowerCase()
    const children = Array.from(el.childNodes).map(walk).join('')

    if (ALLOWED_TAGS.has(tag)) {
      return tag === 'br' ? '<br>' : `<${tag}>${children}</${tag}>`
    }
    return children
  }

  const result = Array.from(doc.body.childNodes).map(walk).join('')
  return result.startsWith('<p>') ? result : `<p>${result}</p>`
}

/**
 * Plain-text fallback for {@link sanitizeUserHtml} where `DOMParser` does not
 * exist (a server render): drops every tag, escapes what is left, and wraps
 * it in one paragraph.
 */
export function stripTagsToHtml(raw: string): string {
  return `<p>${escapeHtml(decodeEntities(raw.replace(/<[^>]*>/g, '')))}</p>`
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: '\'',
  gt: '>',
  lt: '<',
  nbsp: '\u00A0',
  quot: '"',
}

/**
 * Decodes the entities an editor's HTML carries, in one pass so `&amp;lt;`
 * stays `&lt;`. An unknown name or an out-of-range code point is left as is.
 */
function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name: string) => {
    if (name[0] !== '#')
      return NAMED_ENTITIES[name.toLowerCase()] ?? entity
    const code = name[1] === 'x' || name[1] === 'X' ? Number.parseInt(name.slice(2), 16) : Number(name.slice(1))
    return code > 0 && code <= 0x10FFFF ? String.fromCodePoint(code) : entity
  })
}
