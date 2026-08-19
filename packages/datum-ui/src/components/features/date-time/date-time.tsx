'use client'

import type { ReactNode } from 'react'
import type { DateTimeProps, FormatterOptions } from './types'
import { cn } from '../../../utils/cn'
import { Tooltip } from '../../base/tooltip'
import {
  formatAbsoluteDate,
  formatCombinedDate,
  formatRelativeDate,
  formatTimezoneDate,
  formatUTCDate,
  getBrowserTimezone,
  getTimestamp,
  getTimezoneAbbreviation,
  parseDate,
} from './formatters'

/**
 * Date display with the shared Datum hover tooltip (UTC, local zone, relative, epoch).
 */
export function DateTime({
  date,
  variant = 'detailed',
  format,
  addSuffix,
  tooltip = 'auto',
  timezone,
  disableTimezone = false,
  className,
  separator = ' ',
  timestamp,
  children,
}: DateTimeProps) {
  if (!date) {
    return null
  }

  const parsedDate = parseDate(date)

  if (!parsedDate) {
    return null
  }

  const timeZone = timezone ?? getBrowserTimezone()
  const formatterOptions: FormatterOptions = {
    timezone: timeZone,
    disableTimezone,
    format,
    addSuffix,
  }

  const shouldShowTooltip = tooltip !== false && !disableTimezone
  const textClass = cn('text-sm', shouldShowTooltip && 'cursor-pointer', className)
  const trigger = children ?? (
    <time dateTime={parsedDate.toISOString()} className={textClass}>
      {formatTriggerContent(parsedDate, variant, formatterOptions, separator)}
    </time>
  )

  if (!shouldShowTooltip) {
    return trigger
  }

  const showDetailedTooltip = variant === 'detailed' || tooltip === 'detailed'

  return (
    <Tooltip
      message={getTooltipContent(
        parsedDate,
        variant,
        tooltip,
        formatterOptions,
        timeZone,
        timestamp,
      )}
      contentClassName={showDetailedTooltip ? 'min-w-64 text-left' : undefined}
    >
      {trigger}
    </Tooltip>
  )
}

function formatTriggerContent(
  date: Date,
  variant: DateTimeProps['variant'],
  options: FormatterOptions,
  separator: string,
): string {
  switch (variant) {
    case 'relative':
      return formatRelativeDate(date, options)
    case 'both':
      return formatCombinedDate(date, options, separator)
    case 'detailed':
    case 'absolute':
    default:
      return formatAbsoluteDate(date, options)
  }
}

function getTooltipContent(
  date: Date,
  variant: DateTimeProps['variant'],
  tooltip: DateTimeProps['tooltip'],
  options: FormatterOptions,
  timeZone: string,
  timestamp?: string,
): ReactNode {
  if (variant === 'detailed' || tooltip === 'detailed') {
    const rows = [
      { label: 'UTC', value: formatUTCDate(date) },
      { label: timeZone.replaceAll('_', ' '), value: formatTimezoneDate(date, timeZone) },
      { label: 'Relative', value: formatRelativeDate(date, options) },
      { label: 'Timestamp', value: timestamp ?? getTimestamp(date) },
    ]

    return (
      <div className="space-y-2 text-xs">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <span className="font-medium">{row.label}</span>
            <span className="mx-1 flex-1 border-b border-dotted border-current/50" />
            <span className="text-right">{row.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (tooltip === 'timezone') {
    return (
      <p>
        {`${timeZone.replaceAll('_', ' ')} (${getTimezoneAbbreviation(date, timeZone)})`}
      </p>
    )
  }

  if (tooltip === 'alternate') {
    if (variant === 'relative') {
      return formatAbsoluteDate(date, options)
    }
    if (variant === 'absolute' || variant === 'both') {
      return formatRelativeDate(date, options)
    }
  }

  if (tooltip === 'auto' || tooltip === true) {
    switch (variant) {
      case 'relative':
        return formatAbsoluteDate(date, options)
      case 'both':
      case 'absolute':
      default:
        return (
          <p>
            {`${timeZone.replaceAll('_', ' ')} (${getTimezoneAbbreviation(date, timeZone)})`}
          </p>
        )
    }
  }

  return null
}
