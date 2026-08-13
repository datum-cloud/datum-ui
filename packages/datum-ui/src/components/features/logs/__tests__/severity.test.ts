import { describe, expect, it } from 'vitest'
import { httpStatusBadgeType, severityBadgeType } from '../utils/severity'

describe('severityBadgeType', () => {
  it('maps known severities', () => {
    expect(severityBadgeType('ERROR')).toBe('danger')
    expect(severityBadgeType('WARN')).toBe('warning')
    expect(severityBadgeType('INFO')).toBe('info')
    expect(severityBadgeType('DEBUG')).toBe('muted')
    expect(severityBadgeType('nope')).toBe('muted')
  })
})

describe('httpStatusBadgeType', () => {
  it('maps status classes', () => {
    expect(httpStatusBadgeType(201)).toBe('success')
    expect(httpStatusBadgeType(301)).toBe('info')
    expect(httpStatusBadgeType(404)).toBe('warning')
    expect(httpStatusBadgeType(500)).toBe('danger')
  })
})
