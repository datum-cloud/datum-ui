export type UserAgentDevice = 'desktop' | 'mobile' | 'tablet' | 'bot' | 'unknown'

export interface ParsedUserAgent {
  /** Browser or client name, e.g. "Chrome", "Safari", "curl". */
  browser?: string
  /** Major version of the browser or client, e.g. "128". */
  browserVersion?: string
  /** Operating system, e.g. "macOS", "iOS", "Android", "Windows". */
  os?: string
  /** OS version where it is meaningful (iOS, Android). Desktop OS versions are frozen or ambiguous in UA strings. */
  osVersion?: string
  device: UserAgentDevice
  /** Human summary such as "Chrome 128 on macOS" or "curl 8.7". */
  summary: string
  raw: string
}

/** Label keys, in order, that may carry the client's User-Agent header. */
const USER_AGENT_LABEL_KEYS = ['user_agent', 'http_user_agent', 'useragent', 'ua', 'http.user_agent'] as const

/** The User-Agent header from an entry's labels, if any. */
export function logUserAgent(labels: Record<string, string>): string | undefined {
  for (const key of USER_AGENT_LABEL_KEYS) {
    const value = labels[key]?.trim()
    if (value)
      return value
  }
  return undefined
}

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|uptime|pingdom|kube-probe|prometheus|blackbox|healthcheck|health-check|datadog|newrelic|statuscake/i

interface ClientRule {
  name: string
  re: RegExp
  /** Marks command-line and SDK clients, which have no OS worth showing. */
  tool?: boolean
}

/** Order matters: forks embed the names of what they fork. */
const CLIENT_RULES: readonly ClientRule[] = [
  { name: 'curl', re: /\bcurl\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Wget', re: /\bWget\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Python Requests', re: /\bpython-requests\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Python urllib', re: /\bPython-urllib\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Go HTTP client', re: /\bGo-http-client\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'okhttp', re: /\bokhttp\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'axios', re: /\baxios\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'node-fetch', re: /\bnode-fetch\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Node.js', re: /\bnode\/v?(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Postman', re: /\bPostmanRuntime\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Insomnia', re: /\binsomnia\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Java', re: /\bJava\/(\d+(?:\.\d+)*)/i, tool: true },
  { name: 'Edge', re: /\bEdgA?\/(\d+(?:\.\d+)*)/ },
  { name: 'Edge', re: /\bEdgiOS\/(\d+(?:\.\d+)*)/ },
  { name: 'Opera', re: /\bOPR\/(\d+(?:\.\d+)*)/ },
  { name: 'Opera', re: /\bOpera\/(\d+(?:\.\d+)*)/ },
  { name: 'Samsung Internet', re: /\bSamsungBrowser\/(\d+(?:\.\d+)*)/ },
  { name: 'Brave', re: /\bBrave\/(\d+(?:\.\d+)*)/ },
  { name: 'Vivaldi', re: /\bVivaldi\/(\d+(?:\.\d+)*)/ },
  { name: 'Firefox', re: /\b(?:Firefox|FxiOS)\/(\d+(?:\.\d+)*)/ },
  { name: 'Chrome', re: /\b(?:Chrome|CriOS|HeadlessChrome)\/(\d+(?:\.\d+)*)/ },
]

/** Safari carries its version under `Version/`; WebKit views on iOS have neither. */
function detectSafari(ua: string): { version?: string } | undefined {
  if (!/\bSafari\//.test(ua) && !/\bAppleWebKit\//.test(ua))
    return undefined
  const version = /\bVersion\/(\d+(?:\.\d+)*)/.exec(ua)
  if (version && /\bSafari\//.test(ua))
    return { version: majorVersion(version[1]) }
  if (/\b(?:iPhone|iPad|iPod)\b/.test(ua))
    return {}
  return undefined
}

function majorVersion(version: string | undefined): string | undefined {
  if (!version)
    return undefined
  return version.split('.')[0]
}

function detectOs(ua: string): { os?: string, osVersion?: string } {
  let match: RegExpExecArray | null

  // iOS before macOS: iPad UAs can request the desktop site and mention Macintosh.
  if (/\b(?:iPhone|iPad|iPod)\b/i.test(ua)) {
    match = /\bOS (\d+)[._](\d+)(?:[._](\d+))?/.exec(ua)
    if (!match)
      return { os: 'iOS' }
    const patch = match[3] && match[3] !== '0' ? `.${match[3]}` : ''
    return { os: 'iOS', osVersion: `${match[1]}.${match[2]}${patch}` }
  }

  match = /\bAndroid[ /](\d+(?:\.\d+)?)/i.exec(ua)
  if (match)
    return { os: 'Android', osVersion: match[1] }
  if (/\bAndroid\b/i.test(ua))
    return { os: 'Android' }

  if (/\bWindows Phone\b/i.test(ua))
    return { os: 'Windows Phone' }
  if (/\bWindows\b/i.test(ua))
    return { os: 'Windows' }
  if (/\bCrOS\b/.test(ua))
    return { os: 'ChromeOS' }
  if (/\bMac OS X\b|\bMacintosh\b/i.test(ua))
    return { os: 'macOS' }
  if (/\bLinux\b|\bX11\b/i.test(ua))
    return { os: 'Linux' }
  if (/\bFreeBSD\b/i.test(ua))
    return { os: 'FreeBSD' }
  return {}
}

function detectDevice(ua: string, os: string | undefined, bot: boolean, tool: boolean): UserAgentDevice {
  if (bot || tool)
    return 'bot'
  if (/\biPad\b|\bTablet\b|\bKindle\b|\bSilk\b/i.test(ua))
    return 'tablet'
  if (os === 'Android' && !/\bMobile\b/i.test(ua))
    return 'tablet'
  if (/\bMobile\b|\biPhone\b|\biPod\b|\bWindows Phone\b/i.test(ua))
    return 'mobile'
  if (os === 'iOS')
    return 'mobile'
  if (os === 'Windows' || os === 'macOS' || os === 'Linux' || os === 'ChromeOS' || os === 'FreeBSD')
    return 'desktop'
  return 'unknown'
}

function botClient(ua: string): { name: string, version?: string } | undefined {
  // "Googlebot/2.1", "kube-probe/1.30", "UptimeRobot/2.0", "Mozilla/5.0 (compatible; Bingbot/2.0; +http…)"
  const match = /([\w.-]*(?:bot|crawl|spider|probe|monitor|uptime|check)[\w.-]*)(?:\/(\d+(?:\.\d+)*))?/i.exec(ua)
  if (!match?.[1])
    return undefined
  return { name: match[1], version: majorVersion(match[2]) }
}

/**
 * Parse a User-Agent header into browser, OS and device type. Deliberately
 * small: it recognises the mainstream browsers, mobile platforms, common
 * command-line / SDK clients, and anything that calls itself a bot. Returns
 * `null` for an empty string; unrecognised strings still return `summary`
 * as the raw value with `device: 'unknown'`.
 */
export function parseUserAgent(raw: string): ParsedUserAgent | null {
  const ua = raw.trim()
  if (!ua)
    return null

  let browser: string | undefined
  let browserVersion: string | undefined
  let tool = false
  for (const rule of CLIENT_RULES) {
    const match = rule.re.exec(ua)
    if (match) {
      browser = rule.name
      browserVersion = majorVersion(match[1])
      tool = Boolean(rule.tool)
      break
    }
  }
  if (!browser) {
    const safari = detectSafari(ua)
    if (safari) {
      browser = 'Safari'
      browserVersion = safari.version
    }
  }

  const { os, osVersion } = tool ? {} : detectOs(ua)
  const bot = !tool && BOT_RE.test(ua)
  const device = detectDevice(ua, os, bot, tool)

  if (bot && !browser) {
    const named = botClient(ua)
    browser = named?.name
    browserVersion = named?.version
  }

  const client = browser
    ? browserVersion ? `${browser} ${browserVersion}` : browser
    : undefined
  const platform = os
    ? osVersion ? `${os} ${osVersion}` : os
    : undefined

  let summary: string
  if (client && platform)
    summary = `${client} on ${platform}`
  else if (client)
    summary = client
  else if (platform)
    summary = platform
  else
    summary = ua

  return { browser, browserVersion, os, osVersion, device, summary, raw: ua }
}
