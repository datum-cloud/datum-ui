import { describe, expect, it } from 'vitest'
import { parseLogLine } from '../utils/parse-log-line'

describe('parseLogLine', () => {
  it('parses envoy access logs', () => {
    expect(parseLogLine('GET /api/v1/checkout 301 393ms upstream=gateway-eu-west')).toEqual({
      kind: 'http',
      method: 'GET',
      path: '/api/v1/checkout',
      status: 301,
      durationMs: 393,
    })
  })

  it('leaves compute and WAF lines as text', () => {
    expect(parseLogLine('INFO: payment authorised service=payments-api')).toEqual({
      kind: 'text',
      line: 'INFO: payment authorised service=payments-api',
    })
    expect(parseLogLine('blocked request matched rule-942100-sqli client=1.1.1.1 gateway=gateway-eu-west')).toEqual({
      kind: 'text',
      line: 'blocked request matched rule-942100-sqli client=1.1.1.1 gateway=gateway-eu-west',
    })
  })
})
