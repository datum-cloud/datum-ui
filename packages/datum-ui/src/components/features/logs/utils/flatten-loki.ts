import type { LogEntry, LokiQueryRangeResponse, LokiStream } from '../types'

function hashString(input: string): string {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash) + input.charCodeAt(i)
    hash |= 0
  }
  return (hash >>> 0).toString(36)
}

function stableLabels(labels: Record<string, string>): string {
  return Object.keys(labels)
    .sort()
    .map(key => `${key}=${labels[key] ?? ''}`)
    .join(',')
}

export function nsToDate(timestampNs: string): Date {
  try {
    const ms = BigInt(timestampNs) / 1_000_000n
    return new Date(Number(ms))
  }
  catch {
    return new Date(Number.NaN)
  }
}

function entryId(timestampNs: string, labels: Record<string, string>, line: string): string {
  return `${timestampNs}-${hashString(`${stableLabels(labels)}|${line}`)}`
}

function flattenStream(stream: LokiStream): LogEntry[] {
  const labels = stream.stream ?? {}
  const values = stream.values ?? []
  const entries: LogEntry[] = []

  for (const pair of values) {
    const timestampNs = pair[0]
    const line = pair[1]
    if (!timestampNs || line === undefined)
      continue

    const timestamp = nsToDate(timestampNs)
    if (Number.isNaN(timestamp.getTime()))
      continue

    entries.push({
      id: entryId(timestampNs, labels, line),
      timestamp,
      timestampNs,
      line,
      labels,
    })
  }

  return entries
}

export function flattenLokiStreams(response: LokiQueryRangeResponse): LogEntry[] {
  if (response.status !== 'success' || !response.data?.result)
    return []

  const entries = response.data.result.flatMap(flattenStream)
  entries.sort((a, b) => {
    if (a.timestampNs === b.timestampNs)
      return a.id < b.id ? 1 : -1
    return a.timestampNs < b.timestampNs ? 1 : -1
  })
  return entries
}
