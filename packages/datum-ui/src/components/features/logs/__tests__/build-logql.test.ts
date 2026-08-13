import { describe, expect, it } from 'vitest'
import { buildLogQL } from '../utils/build-logql'

describe('buildLogQL', () => {
  it('defaults to a catch-all service matcher', () => {
    expect(buildLogQL()).toBe('{service_name=~".+"}')
    expect(buildLogQL({ matchers: {} })).toBe('{service_name=~".+"}')
    expect(buildLogQL({ matchers: { severity: [] } })).toBe('{service_name=~".+"}')
  })

  it('emits exact matchers for a single value', () => {
    expect(buildLogQL({
      matchers: { severity: ['ERROR'] },
    })).toBe('{severity="ERROR"}')
  })

  it('joins multiple values with a regex matcher', () => {
    expect(buildLogQL({
      matchers: { severity: ['ERROR', 'WARN'] },
    })).toBe('{severity=~"ERROR|WARN"}')
  })

  it('combines labels and a line filter', () => {
    expect(buildLogQL({
      matchers: {
        severity: ['ERROR'],
        service_name: ['envoy-gateway'],
      },
      lineContains: 'timeout',
    })).toBe('{severity="ERROR", service_name="envoy-gateway"} |= "timeout"')
  })

  it('escapes quotes in line filters', () => {
    expect(buildLogQL({
      matchers: { service_name: ['api'] },
      lineContains: 'say "hello"',
    })).toBe('{service_name="api"} |= "say \\"hello\\""')
  })
})
