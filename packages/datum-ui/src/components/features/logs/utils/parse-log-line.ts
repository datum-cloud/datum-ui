import type { ParsedHttpLogLine, ParsedLogLine } from '../types'

const ACCESS_LOG_RE
  = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s+(\d{3})\s+(\d+)ms\b/i

const PATH_TOKEN_RE = /(?:^|\s)(\/\S+)/

/**
 * Parse an access-log line, falling back to Envoy/OTEL stream labels when the
 * body is empty (queryapi stores method/path/status as attributes).
 */
export function parseLogLine(line: string, labels: Record<string, string> = {}): ParsedLogLine {
  return parseAccessLogText(line) ?? parseAccessLogFields(labels) ?? { kind: 'text', line }
}

export function formatHttpLogLine(parsed: ParsedHttpLogLine): string {
  return `${parsed.method} ${parsed.path} ${parsed.status} ${parsed.durationMs}ms`
}

function parseAccessLogText(line: string): ParsedHttpLogLine | null {
  const match = ACCESS_LOG_RE.exec(line)
  if (!match)
    return null

  const method = match[1]
  const path = match[2]
  const status = match[3]
  const duration = match[4]
  if (!method || !path || !status || !duration)
    return null

  return {
    kind: 'http',
    method: method.toUpperCase(),
    path,
    status: Number(status),
    durationMs: Number(duration),
  }
}

function parseAccessLogFields(fields: Record<string, string>): ParsedHttpLogLine | null {
  const method = fields.method?.trim()
  const path = fields.path?.trim()
  const status = fields.response_code?.trim() ?? fields.status?.trim()
  if (!method || !path || !status || !/^\d{3}$/.test(status))
    return null

  return {
    kind: 'http',
    method: method.toUpperCase(),
    path,
    status: Number(status),
    durationMs: parseDurationMs(fields.duration),
  }
}

/** Envoy `%DURATION%` is milliseconds with no unit. */
function parseDurationMs(raw?: string): number {
  if (!raw)
    return 0
  const n = Number.parseFloat(raw.replace(/ms$/i, '').trim())
  return Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0
}

export interface SplitPath {
  pathname: string
  /** Raw query string without the leading `?`, or `''`. */
  search: string
  /** Decoded key/value pairs in order of appearance; repeated keys are kept. */
  params: Array<[key: string, value: string]>
}

/** Separate `/a/b?x=1&y=2` into its pathname and decoded search params. */
export function splitPathQuery(path: string): SplitPath {
  const hashIndex = path.indexOf('#')
  const withoutHash = hashIndex === -1 ? path : path.slice(0, hashIndex)
  const queryIndex = withoutHash.indexOf('?')
  if (queryIndex === -1)
    return { pathname: withoutHash, search: '', params: [] }

  const pathname = withoutHash.slice(0, queryIndex)
  const search = withoutHash.slice(queryIndex + 1)
  const params: Array<[string, string]> = []
  for (const [key, value] of new URLSearchParams(search)) {
    if (key)
      params.push([key, value])
  }
  return { pathname, search, params }
}

export function logLineDisplay(line: string, labels: Record<string, string> = {}): {
  parsed: ParsedLogLine
  path: string | null
  message: string
} {
  const parsed = parseLogLine(line, labels)
  if (parsed.kind === 'http') {
    const match = ACCESS_LOG_RE.exec(line)
    const rest = match ? line.slice(match[0].length).trim() : ''
    return { parsed, path: parsed.path, message: extraMessage(rest) }
  }

  const path = labels.path?.trim() || PATH_TOKEN_RE.exec(line)?.[1] || null
  if (!path) {
    return { parsed, path: null, message: line }
  }

  return { parsed, path, message: extraMessage(line ? stripOnce(line, path) : '') }
}

/** Drop leftover that is only fields already shown (method, status, path, duration, label=value). */
function extraMessage(rest: string): string {
  if (!rest) {
    return ''
  }

  const tokens = rest.split(/\s+/).filter(Boolean)
  const hasProse = tokens.some(token => !/^[A-Z_]\w*=\S+$/i.test(token))
  return hasProse ? rest : ''
}

function stripOnce(line: string, token: string): string {
  const index = line.indexOf(token)
  if (index === -1) {
    return line
  }

  return `${line.slice(0, index)}${line.slice(index + token.length)}`.replace(/\s+/g, ' ').trim()
}
