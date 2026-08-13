import type { ParsedLogLine } from '../types'

const ACCESS_LOG_RE
  = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+(\S+)\s+(\d{3})\s+(\d+)ms\b/i

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
