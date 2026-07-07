import type { RichTextContentProps } from './types'
import DOMPurify from 'isomorphic-dompurify'
import { cn } from '../../../utils/cn'

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['strong', 'em', 'u', 's', 'a', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
}

/**
 * A bare domain (e.g. `example.com`) has no scheme and isn't a relative or
 * fragment reference, so it needs an https:// prefix to resolve correctly.
 * Anything already scheme-qualified (mailto:, tel:, http(s):, protocol-relative
 * //) or relative (/path, #anchor, ?query, ./, ../) must be left untouched.
 */
function needsHttpsPrefix(href: string): boolean {
  if (!href)
    return false
  if (/^[a-z][a-z0-9+.-]*:/i.test(href))
    return false // has a scheme: mailto:, tel:, http:, https:, …
  if (/^[/#?.]/.test(href))
    return false // relative path, fragment, query, or ./ ../
  return true
}

/**
 * Post-sanitization: normalizes link hrefs and hardens external links.
 * Applied AFTER DOMPurify so we only touch already-clean HTML.
 *
 * Only bare domains get an https:// prefix, and only http(s) links get
 * target/rel hardening — relative, fragment, tel:, and mailto: links are
 * preserved as-authored so they keep working.
 */
function normalizeLinks(html: string): string {
  return html.replace(/<a\s([^>]*)>/gi, (_match, attrs: string) => {
    const hrefMatch = attrs.match(/href="([^"]*)"/i)
    const href = hrefMatch?.[1] ?? ''
    const prefixed = needsHttpsPrefix(href)

    let normalized = attrs
    if (prefixed) {
      normalized = normalized.replace(/href="[^"]*"/i, `href="https://${href}"`)
    }

    // Harden only external http(s) links (including bare domains we just
    // prefixed). Same-page/relative/tel:/mailto: links keep their own behavior.
    if (prefixed || /^https?:\/\//i.test(href)) {
      if (!/\btarget=/i.test(normalized)) {
        normalized += ' target="_blank"'
      }
      if (!/\brel=/i.test(normalized)) {
        normalized += ' rel="noopener noreferrer"'
      }
    }

    return `<a ${normalized}>`
  })
}

export function RichTextContent({ content, className }: RichTextContentProps) {
  if (!content)
    return null

  // Sanitize first, then normalize links on clean output
  const sanitized = DOMPurify.sanitize(content, SANITIZE_CONFIG)
  const withSafeLinks = normalizeLinks(sanitized)

  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none',
        '[&_a]:text-primary text-sm [&_a]:underline [&_p]:my-1 [&_p:empty]:min-h-[1em]',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: withSafeLinks }}
    />
  )
}
