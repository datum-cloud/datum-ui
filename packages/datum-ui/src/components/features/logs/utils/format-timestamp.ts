import { format, formatDistance } from 'date-fns'

export function formatLogTimestamp(date: Date): string {
  return format(date, 'MMM dd HH:mm:ss.SS').toUpperCase()
}

export function formatRelativeTimestamp(date: Date, now = new Date()): string {
  return formatDistance(date, now, { includeSeconds: true, addSuffix: true })
}

export function formatUtcTimestamp(date: Date): string {
  return `${date.toISOString().replace('T', ' ').replace('Z', '')} UTC`
}

export function formatLocalTimestamp(date: Date): string {
  const offsetMin = -date.getTimezoneOffset()
  const sign = offsetMin >= 0 ? '+' : '-'
  const abs = Math.abs(offsetMin)
  const hours = String(Math.floor(abs / 60)).padStart(2, '0')
  const minutes = String(abs % 60).padStart(2, '0')
  return `${format(date, 'yyyy-MM-dd HH:mm:ss.SSS')} GMT${sign}${hours}:${minutes}`
}
