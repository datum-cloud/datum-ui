import type { BuildLogQLOptions, LogFilters } from '../types'
import { DEFAULT_LOGQL_MATCHER } from './constants'

/** Loki/Prometheus label names. Anything else is dropped, not interpolated. */
const LOKI_LABEL_NAME = /^[a-z_]\w*$/i

function escapeQuoted(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function matcherClause(label: string, values: readonly string[]): string | null {
  if (!LOKI_LABEL_NAME.test(label))
    return null

  const unique = [...new Set(values.map(v => v.trim()).filter(Boolean))]
  if (unique.length === 0)
    return null

  if (unique.length === 1) {
    return `${label}="${escapeQuoted(unique[0]!)}"`
  }

  const pattern = unique.map(escapeRegex).join('|')
  return `${label}=~"${escapeQuoted(pattern)}"`
}

function selectorFromMatchers(matchers: LogFilters | undefined): string {
  if (!matchers)
    return DEFAULT_LOGQL_MATCHER

  const clauses = Object.entries(matchers)
    .map(([label, values]) => matcherClause(label, values))
    .filter((clause): clause is string => clause !== null)

  if (clauses.length === 0)
    return DEFAULT_LOGQL_MATCHER

  return `{${clauses.join(', ')}}`
}

export function buildLogQL({ matchers, lineContains }: BuildLogQLOptions = {}): string {
  const selector = selectorFromMatchers(matchers)
  const text = lineContains?.trim()
  if (!text)
    return selector
  return `${selector} |= "${escapeQuoted(text)}"`
}
