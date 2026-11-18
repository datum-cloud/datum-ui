/** A plain-language account of an error, with the technical text kept. */
export interface ErrorDescription {
  /** A plain headline. */
  title: string
  /** What the person can do next. */
  description?: string
  /** The raw technical text, shown under "Error details". */
  detail?: string
  requestId?: string
}

export interface DescribeOptions {
  /**
   * Product-area names by Kubernetes API group, e.g.
   * `{ 'dns.networking.miloapis.com': 'Networking/DNS' }`. A permission error
   * on a listed group names the area instead of the raw resource.
   */
  apiGroupLabels?: Record<string, string>
}

interface ErrorFacts {
  reason?: string
  status?: number
  /** The message written for people, used as the headline when no rule applies. */
  headline?: string
  /** The raw technical text, kept as `detail`. */
  raw?: string
  /** Every text worth searching for an RBAC denial, most technical first. */
  texts: string[]
  requestId?: string
  isNetworkError: boolean
}

type Advice = Pick<ErrorDescription, 'title' | 'description'>

const FALLBACK: Advice = {
  title: 'Something went wrong.',
  description: 'Try again. If it keeps happening, contact support.',
}

const NO_ACCESS = 'Ask an administrator of this project for access.'

const ADVICE_BY_REASON: Record<string, Advice> = {
  Unauthorized: { title: 'Your session has expired.', description: 'Sign in again to continue.' },
  NotFound: { title: 'This item no longer exists.', description: 'It may have been deleted. Refresh to see the latest.' },
  AlreadyExists: { title: 'An item with this name already exists.', description: 'Choose a different name.' },
  Conflict: { title: 'Someone else changed this item.', description: 'Refresh and try again.' },
  TooManyRequests: { title: 'Too many requests.', description: 'Wait a moment and try again.' },
  Timeout: { title: 'The service took too long to respond.', description: 'Try again in a moment.' },
  ServerTimeout: { title: 'The service took too long to respond.', description: 'Try again in a moment.' },
}

const REASON_BY_STATUS: Record<number, string> = {
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'NotFound',
  409: 'Conflict',
  422: 'Invalid',
  429: 'TooManyRequests',
  503: 'ServerTimeout',
  504: 'Timeout',
}

const ACTION_BY_VERB: Record<string, string> = {
  get: 'view',
  list: 'view',
  watch: 'view',
  create: 'create',
  update: 'change',
  patch: 'change',
  delete: 'delete',
  deletecollection: 'delete',
}

// The Kubernetes RBAC denial: `cannot <verb> resource "<resource>" in API group "<group>"`.
const RBAC_DENIAL = /cannot (\w+) resource ["']([^"']+)["'] in API group ["']([^"']*)["']/

/**
 * Turns an API or Kubernetes error into a plain headline and next step,
 * keeping the raw text as `detail`. Known Kubernetes errors get rewritten;
 * any other error keeps its own message as the title, since many are already
 * written for people.
 */
export function describeApiError(error: unknown, options: DescribeOptions = {}): ErrorDescription {
  const facts = readFacts(error)
  const own = facts.headline ?? facts.raw
  const advice = adviceFor(facts, options) ?? (own ? { title: own } : FALLBACK)
  return {
    ...advice,
    ...(facts.raw !== undefined && { detail: facts.raw }),
    ...(facts.requestId !== undefined && { requestId: facts.requestId }),
  }
}

function adviceFor(facts: ErrorFacts, options: DescribeOptions): Advice | undefined {
  if (facts.isNetworkError)
    return { title: 'Couldn\'t reach the server.', description: 'Check your connection and try again.' }
  const reason = facts.reason ?? (facts.status === undefined ? undefined : REASON_BY_STATUS[facts.status])
  if (reason === 'Forbidden')
    return forbiddenAdvice(facts, options)
  if (reason === 'Invalid')
    return facts.headline || facts.raw ? undefined : { title: 'Some values aren\'t valid.' }
  // A REST 409 often carries no Kubernetes reason; its text tells a name clash from an edit conflict.
  if (reason === 'Conflict' && facts.texts.some(text => /already exists/i.test(text)))
    return ADVICE_BY_REASON.AlreadyExists
  return reason === undefined ? undefined : ADVICE_BY_REASON[reason]
}

function forbiddenAdvice(facts: ErrorFacts, { apiGroupLabels }: DescribeOptions): Advice | undefined {
  const match = facts.texts.map(text => text.match(RBAC_DENIAL)).find(Boolean)
  if (!match) {
    // A policy denial written for people keeps its own words; with none, say what happened.
    return facts.headline || facts.raw
      ? undefined
      : { title: 'You don\'t have permission to do this.', description: NO_ACCESS }
  }
  const [, verb = '', resource = '', group = ''] = match
  const action = ACTION_BY_VERB[verb.toLowerCase()] ?? verb
  const label = apiGroupLabels?.[group]
  if (label) {
    const title = action === 'view'
      ? `Permission denied to view ${label}.`
      : `Permission denied for changes to ${label}.`
    return { title, description: NO_ACCESS }
  }
  return { title: `You don't have permission to ${action} ${resource}.`, description: NO_ACCESS }
}

function readFacts(error: unknown): ErrorFacts {
  if (typeof error === 'string') {
    const text = error || undefined
    return { headline: text, raw: text, texts: text ? [text] : [], isNetworkError: false }
  }
  const own = asRecord(error)
  const cause = asRecord(own?.cause)
  const reason = reasonOf(own)
  const status = statusOf(own)
  // Look one level into `cause` for the reason and status only when the error itself says nothing.
  const fallback = reason === undefined && status === undefined ? cause : undefined
  const headline = stringField(own, 'message') ?? stringField(own, 'body') ?? stringField(own, 'originalMessage')
  const causeText = textOf(cause)
  // The technical text: an explicit original, else a wrapped cause that says more than the wrapper.
  const raw = stringField(own, 'originalMessage')
    ?? (causeText !== undefined && causeText !== headline ? causeText : undefined)
    ?? headline
  return {
    reason: reason ?? reasonOf(fallback),
    status: status ?? statusOf(fallback),
    headline,
    raw,
    texts: [raw, headline, causeText].filter((text): text is string => text !== undefined),
    requestId: requestIdOf(own) ?? requestIdOf(cause),
    isNetworkError: isNetworkFailure(error) || isNetworkFailure(own?.cause),
  }
}

// What browsers throw from fetch when the request never reached the server
// (Chrome, Safari, Firefox). Matched exactly, so a code bug that merely
// mentions "fetch" is not mistaken for one.
const NETWORK_FAILURE = /^(?:Failed to fetch|Load failed|NetworkError when attempting to fetch resource\.?)$/

function isNetworkFailure(value: unknown): boolean {
  return value instanceof TypeError && NETWORK_FAILURE.test(value.message)
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : undefined
}

function stringField(source: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = source?.[key]
  return typeof value === 'string' && value !== '' ? value : undefined
}

function reasonOf(source: Record<string, unknown> | undefined): string | undefined {
  return stringField(source, 'reason') ?? stringField(source, 'k8sReason') ?? stringField(asRecord(source?.details), 'reason')
}

function statusOf(source: Record<string, unknown> | undefined): number | undefined {
  for (const key of ['status', 'statusCode', 'code']) {
    const value = source?.[key]
    if (typeof value === 'number')
      return value
  }
  return undefined
}

function textOf(source: Record<string, unknown> | undefined): string | undefined {
  return stringField(source, 'originalMessage') ?? stringField(source, 'message') ?? stringField(source, 'body')
}

function requestIdOf(source: Record<string, unknown> | undefined): string | undefined {
  return stringField(source, 'requestId') ?? stringField(asRecord(source?.headers), 'x-request-id')
}
