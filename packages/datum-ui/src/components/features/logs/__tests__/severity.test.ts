import { describe, expect, it } from 'vitest'
import { httpStatusBadgeType, httpStatusTextClass, severityBadgeType } from '../utils/severity'

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

describe('httpStatusTextClass', () => {
  it('colors only the status number by class', () => {
    expect(httpStatusTextClass(201)).toContain('--color-badge-success')
    expect(httpStatusTextClass(301)).toContain('--color-badge-info')
    expect(httpStatusTextClass(404)).toContain('--color-badge-warning')
    expect(httpStatusTextClass(500)).toContain('--color-badge-danger')
  })
})
