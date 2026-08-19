import type { LogEntry, LokiQueryRangeResponse, LokiStream } from '../types'

export function nsToDate(timestampNs: string): Date {
  try {
    const ms = BigInt(timestampNs) / 1_000_000n
    return new Date(Number(ms))
  }
  catch {
    return new Date(Number.NaN)
  }
}

function flattenStream(stream: LokiStream, streamIndex: number): LogEntry[] {
  const labels = stream.stream ?? {}
  const values = stream.values ?? []
  const entries: LogEntry[] = []

  for (const [valueIndex, pair] of values.entries()) {
    const timestampNs = pair[0]
    const line = pair[1]
    if (!timestampNs || line === undefined)
      continue

    const timestamp = nsToDate(timestampNs)
    if (Number.isNaN(timestamp.getTime()))
      continue

    entries.push({
      id: `${timestampNs}-${streamIndex}-${valueIndex}`,
      timestamp,
      timestampNs,
      line,
      labels: { ...labels },
    })
  }

  return entries
}

export function flattenLokiStreams(response: LokiQueryRangeResponse): LogEntry[] {
  if (response.status !== 'success' || response.data?.resultType !== 'streams' || !response.data.result)
    return []

  const entries = response.data.result.flatMap(flattenStream)
  entries.sort((a, b) => {
    try {
      const delta = BigInt(b.timestampNs) - BigInt(a.timestampNs)
      if (delta === 0n)
        return a.id < b.id ? 1 : -1
      return delta > 0n ? 1 : -1
    }
    catch {
      return a.timestampNs < b.timestampNs ? 1 : -1
    }
  })
  return entries
}
