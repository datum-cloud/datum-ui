import { describe, expect, it } from 'vitest'
import { logLineDisplay, parseLogLine, splitPathQuery } from '../utils/parse-log-line'

describe('splitPathQuery', () => {
  it('separates the pathname from decoded search params', () => {
    expect(splitPathQuery('/api/v1/checkout?session=9f2c1a&redirect=%2Fcart&flag')).toEqual({
      pathname: '/api/v1/checkout',
      search: 'session=9f2c1a&redirect=%2Fcart&flag',
      params: [['session', '9f2c1a'], ['redirect', '/cart'], ['flag', '']],
    })
  })

  it('keeps repeated keys and ignores fragments', () => {
    expect(splitPathQuery('/search?tag=a&tag=b#top').params).toEqual([['tag', 'a'], ['tag', 'b']])
  })

  it('returns no params for a bare path', () => {
    expect(splitPathQuery('/healthz')).toEqual({ pathname: '/healthz', search: '', params: [] })
  })
})

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

  it('parses Envoy OTEL attributes when the line body is empty', () => {
    expect(parseLogLine('', {
      method: 'GET',
      path: '/projects?_rsc=1qiq5',
      response_code: '304',
      duration: '47',
    })).toEqual({
      kind: 'http',
      method: 'GET',
      path: '/projects?_rsc=1qiq5',
      status: 304,
      durationMs: 47,
    })
  })

  it('prefers a CLF-shaped line over labels', () => {
    expect(parseLogLine('GET /healthz 200 12ms', {
      method: 'POST',
      path: '/',
      response_code: '500',
      duration: '1',
    })).toMatchObject({ kind: 'http', method: 'GET', path: '/healthz', status: 200, durationMs: 12 })
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

describe('logLineDisplay', () => {
  it('leaves message empty when the line is only fields already shown', () => {
    expect(logLineDisplay('GET /api/v1/checkout 301 393ms upstream=gateway-eu-west')).toMatchObject({
      path: '/api/v1/checkout',
      message: '',
    })
    expect(logLineDisplay('GET /healthz 200 12ms')).toMatchObject({
      path: '/healthz',
      message: '',
    })
  })

  it('keeps leftover prose in the message', () => {
    expect(logLineDisplay('GET /api/v1/checkout 503 2100ms connection reset')).toMatchObject({
      path: '/api/v1/checkout',
      message: 'connection reset',
    })
  })

  it('keeps unstructured lines in the message when there is no path', () => {
    expect(logLineDisplay('INFO: payment authorised service=payments-api')).toMatchObject({
      path: null,
      message: 'INFO: payment authorised service=payments-api',
    })
  })

  it('reads path from labels when the line is empty', () => {
    expect(logLineDisplay('', {
      method: 'GET',
      path: '/projects/demo-app',
      response_code: '200',
      duration: '413',
    })).toMatchObject({
      path: '/projects/demo-app',
      message: '',
      parsed: { kind: 'http', status: 200, durationMs: 413 },
    })
  })
})
