import type { ParsedLogLine } from '../types'

const ACCESS_LOG_RE
  = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s+(\d{3})\s+(\d+)ms\b/i

const PATH_TOKEN_RE = /(?:^|\s)(\/\S+)/

export function parseLogLine(line: string): ParsedLogLine {
  const match = ACCESS_LOG_RE.exec(line)
  if (!match) {
    return { kind: 'text', line }
  }

  const method = match[1]
  const path = match[2]
  const status = match[3]
  const duration = match[4]
  if (!method || !path || !status || !duration) {
    return { kind: 'text', line }
  }

  return {
    kind: 'http',
    method: method.toUpperCase(),
    path,
    status: Number(status),
    durationMs: Number(duration),
  }
}

export function logLineDisplay(line: string): { path: string | null, message: string } {
  const parsed = parseLogLine(line)
  if (parsed.kind === 'http') {
    const match = ACCESS_LOG_RE.exec(line)
    const rest = match ? line.slice(match[0].length).trim() : ''
    return { path: parsed.path, message: extraMessage(rest) }
  }

  const path = PATH_TOKEN_RE.exec(line)?.[1] ?? null
  if (!path) {
    return { path: null, message: line }
  }

  return { path, message: extraMessage(stripOnce(line, path)) }
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
