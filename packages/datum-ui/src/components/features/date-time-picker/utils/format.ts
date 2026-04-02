import { format } from 'date-fns'

/**
 * Format date for display
 */
export function formatDate(date: Date | undefined): string {
  if (!date)
    return ''
  return format(date, 'PP') // e.g., "Jan 15, 2024"
}

/**
 * Format time for display
 */
export function formatTime(time: string): string {
  if (!time)
    return ''
  return time // Already in HH:mm format
}

/**
 * Format full date-time for display
 */
export function formatDateTime(date: Date | undefined, time: string): string {
  if (!date || !time)
    return ''
  return `${formatDate(date)} ${time}`
}
