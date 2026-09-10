import { describe, expect, it } from 'vitest'
import { logRequestHost } from '../utils/host'

describe('logRequestHost', () => {
  it('lets an explicit host label override everything', () => {
    expect(logRequestHost({
      host: 'override.example.com',
      requested_server_name: 'app.example.com',
      authority: 'www.example.com',
    })).toBe('override.example.com')
  })

  it('prefers the name the client used over origin authority', () => {
    expect(logRequestHost({
      authority: 'www.example.com',
      requested_server_name: 'app.example.com',
      x_forwarded_host: 'app.example.com',
    })).toBe('app.example.com')
  })

  it('falls back through Envoy host labels', () => {
    expect(logRequestHost({ authority: 'origin.internal' })).toBe('origin.internal')
    expect(logRequestHost({ resource_name: 'gateway-eu-west' })).toBe('gateway-eu-west')
    expect(logRequestHost({ host: '  ' })).toBeUndefined()
    expect(logRequestHost({})).toBeUndefined()
  })
})
