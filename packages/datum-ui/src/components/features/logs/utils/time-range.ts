import type { LogTimeRange } from '../types'

const THIRTY_MINUTES_MS = 30 * 60 * 1000

export function lastThirtyMinutes(now = new Date()): LogTimeRange {
  return {
    from: new Date(now.getTime() - THIRTY_MINUTES_MS).toISOString(),
    to: now.toISOString(),
  }
}

export function filtersAreActive(filters: Record<string, string[]>): boolean {
  return Object.values(filters).some(values => values.length > 0)
}
