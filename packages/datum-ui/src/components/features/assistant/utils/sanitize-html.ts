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
