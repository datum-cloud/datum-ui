import { describe, expect, it } from 'vitest'
import { logUserAgent, parseUserAgent } from '../utils/user-agent'

const SAFARI_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.2 Safari/605.1.15'
const CHROME_WIN = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
const EDGE_MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.2739.42'
const FIREFOX_LINUX = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0'
const SAFARI_IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
const CHROME_IPAD = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/128.0.6613.98 Mobile/15E148 Safari/604.1'
const CHROME_ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
const CHROME_ANDROID_TABLET = 'Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
const IOS_WEBVIEW = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'

describe('parseUserAgent', () => {
  it('reads desktop browsers and hides the frozen desktop OS version', () => {
    expect(parseUserAgent(SAFARI_MAC)).toMatchObject({
      browser: 'Safari',
      browserVersion: '26',
      os: 'macOS',
      osVersion: undefined,
      device: 'desktop',
      summary: 'Safari 26 on macOS',
    })
    expect(parseUserAgent(CHROME_WIN)).toMatchObject({ browser: 'Chrome', browserVersion: '128', os: 'Windows', device: 'desktop', summary: 'Chrome 128 on Windows' })
    expect(parseUserAgent(FIREFOX_LINUX)).toMatchObject({ browser: 'Firefox', browserVersion: '130', os: 'Linux', device: 'desktop' })
  })

  it('prefers the fork over the engine it embeds', () => {
    expect(parseUserAgent(EDGE_MAC)).toMatchObject({ browser: 'Edge', browserVersion: '128', os: 'macOS' })
  })

  it('reads mobile platforms with their versions and device class', () => {
    expect(parseUserAgent(SAFARI_IPHONE)).toMatchObject({
      browser: 'Safari',
      browserVersion: '17',
      os: 'iOS',
      osVersion: '17.5.1',
      device: 'mobile',
      summary: 'Safari 17 on iOS 17.5.1',
    })
    expect(parseUserAgent(CHROME_IPAD)).toMatchObject({ browser: 'Chrome', os: 'iOS', osVersion: '17.0', device: 'tablet' })
    expect(parseUserAgent(CHROME_ANDROID)).toMatchObject({ browser: 'Chrome', os: 'Android', osVersion: '14', device: 'mobile' })
    expect(parseUserAgent(CHROME_ANDROID_TABLET)).toMatchObject({ device: 'tablet' })
  })

  it('does not invent a browser for an iOS web view without Version/', () => {
    expect(parseUserAgent(IOS_WEBVIEW)).toMatchObject({ browser: 'Safari', browserVersion: undefined, os: 'iOS', summary: 'Safari on iOS 17.5' })
  })

  it('treats command-line and SDK clients as tools without an OS', () => {
    expect(parseUserAgent('curl/8.7.1')).toMatchObject({ browser: 'curl', browserVersion: '8', device: 'bot', summary: 'curl 8' })
    expect(parseUserAgent('python-requests/2.32.3')).toMatchObject({ browser: 'Python Requests', device: 'bot', summary: 'Python Requests 2' })
    expect(parseUserAgent('Go-http-client/2.0')).toMatchObject({ browser: 'Go HTTP client', device: 'bot' })
  })

  it('names bots and probes', () => {
    expect(parseUserAgent('kube-probe/1.30')).toMatchObject({ device: 'bot', summary: 'kube-probe 1' })
    expect(parseUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')).toMatchObject({ device: 'bot', summary: 'Googlebot 2' })
    expect(parseUserAgent('Mozilla/5.0 (compatible; UptimeRobot/2.0; http://www.uptimerobot.com/)')).toMatchObject({ device: 'bot', browser: 'UptimeRobot' })
  })

  it('falls back to the raw string when nothing matches', () => {
    expect(parseUserAgent('SomethingElse/1.0')).toMatchObject({ device: 'unknown', summary: 'SomethingElse/1.0' })
    expect(parseUserAgent('   ')).toBeNull()
  })
})

describe('logUserAgent', () => {
  it('finds the header under the common label keys', () => {
    expect(logUserAgent({ user_agent: 'curl/8.7.1' })).toBe('curl/8.7.1')
    expect(logUserAgent({ http_user_agent: 'curl/8.7.1' })).toBe('curl/8.7.1')
    expect(logUserAgent({ 'http.user_agent': 'curl/8.7.1' })).toBe('curl/8.7.1')
    expect(logUserAgent({ user_agent: '  ' })).toBeUndefined()
    expect(logUserAgent({})).toBeUndefined()
  })
})
