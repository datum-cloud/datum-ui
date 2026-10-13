import type { UIMessage } from 'ai'
import * as ai from 'ai'
import { describe, expect, it } from 'vitest'
import {
  assistantErrorMessage,
  chatFileName,
  chatToMarkdown,
  DEFAULT_ASSISTANT_CONFIG,
  deriveTitle,
  deriveTurns,
  formatRelativeTime,
  thinkingLabel,
} from '../src/format'
import { repairStreamingMarkdown } from '../src/markdown'
import * as parts from '../src/parts'

const user = (id: string, text: string): UIMessage => ({ id, role: 'user', parts: [{ type: 'text', text }] })
const assistant = (id: string, p: UIMessage['parts']): UIMessage => ({ id, role: 'assistant', parts: p })

describe('part guards match ai@7', () => {
  const samples = [
    { type: 'text', text: 'x' },
    { type: 'reasoning', text: 'x' },
    { type: 'dynamic-tool', toolName: 'alb__alb_list', toolCallId: '1', state: 'input-available', input: {} },
    { type: 'tool-getWeather', toolCallId: '2', state: 'input-available', input: {} },
    { type: 'tool-multi-part-name', toolCallId: '3', state: 'output-available', input: {}, output: {} },
    { type: 'step-start' },
    { type: 'source-url', sourceId: 's', url: 'https://x' },
  ] as UIMessage['parts']
  it.each(['isTextUIPart', 'isReasoningUIPart', 'isToolUIPart', 'isDynamicToolUIPart'] as const)('%s', (name) => {
    for (const part of samples)
      expect(parts[name](part)).toBe((ai[name] as (p: unknown) => boolean)(part))
  })
  it('getToolName', () => {
    for (const part of samples.filter(p => ai.isToolUIPart(p)))
      expect(parts.getToolName(part as never)).toBe(ai.getToolName(part as never))
  })
})

describe('message derivations', () => {
  const tool = { type: 'dynamic-tool', toolName: 'alb__alb_list', toolCallId: '1', state: 'input-available', input: {} } as const
  it('messageText joins text parts with a blank line', () => {
    expect(parts.messageText(assistant('a', [{ type: 'text', text: 'one' }, tool, { type: 'text', text: 'two' }]))).toBe('one\n\ntwo')
  })
  it('activeToolPart finds a running tool only', () => {
    expect(parts.activeToolPart(assistant('a', [tool]))).toBe(tool)
    expect(parts.activeToolPart(assistant('a', [{ ...tool, state: 'output-available', output: {} }]))).toBeUndefined()
  })
  it('showInitialLoading: streaming, no text and no tool yet', () => {
    expect(parts.showInitialLoading({ msg: assistant('a', []), isLastMessage: true, status: 'streaming' })).toBe(true)
    expect(parts.showInitialLoading({ msg: assistant('a', []), isLastMessage: true, status: 'ready' })).toBe(false)
    expect(parts.showInitialLoading({ msg: assistant('a', [tool]), isLastMessage: true, status: 'streaming' })).toBe(false)
    expect(parts.showInitialLoading({ msg: assistant('a', [{ type: 'text', text: 'x' }]), isLastMessage: true, status: 'streaming' })).toBe(false)
  })
  it('showToolIndicator and toolLabel', () => {
    expect(parts.showToolIndicator({ msg: assistant('a', [tool]), isLastMessage: true })).toBe(true)
    expect(parts.showToolIndicator({ msg: assistant('a', [tool]), isLastMessage: false })).toBe(false)
    expect(parts.toolLabel(tool, { alb__alb_list: 'Looking…' })).toBe('Looking…')
    expect(parts.toolLabel(tool, {})).toBe('Working…')
  })
})

describe('format helpers', () => {
  it('formatRelativeTime', () => {
    const now = Date.UTC(2026, 9, 12, 12)
    expect(formatRelativeTime(now - 30_000, now)).toBe('just now')
    expect(formatRelativeTime(now - 5 * 60_000, now)).toBe('5m ago')
    expect(formatRelativeTime(now - 3 * 3600_000, now)).toBe('3h ago')
    expect(formatRelativeTime(now - 26 * 3600_000, now)).toBe('Yesterday')
    expect(formatRelativeTime(now - 4 * 86400_000, now)).toBe('4d ago')
    expect(formatRelativeTime(now - 30 * 86400_000, now)).toBe(new Date(now - 30 * 86400_000).toLocaleDateString())
  })
  it('thinkingLabel', () => {
    expect(thinkingLabel(true, null)).toBe('Thinking…')
    expect(thinkingLabel(false, null)).toBe('Thought')
    expect(thinkingLabel(false, 0)).toBe('Thought for less than 1 second')
    expect(thinkingLabel(false, 4)).toBe('Thought for 4s')
  })
  it('assistantErrorMessage', () => {
    expect(assistantErrorMessage(new Error('HTTP 429'))).toMatch(/rate limit/)
    expect(assistantErrorMessage(new Error('Too Many Requests'))).toMatch(/rate limit/)
    expect(assistantErrorMessage(new Error('503'))).toBe('AI assistant is not configured.')
    expect(assistantErrorMessage(new Error('boom'))).toBe('Something went wrong — boom')
  })
  it('deriveTurns and deriveTitle', () => {
    const msgs = [user('u1', 'First question here'), assistant('a1', []), user('u2', 'Second')]
    expect(deriveTurns(msgs)).toEqual([{ id: 'u1', text: 'First question here' }, { id: 'u2', text: 'Second' }])
    expect(deriveTitle(msgs)).toBe('First question here')
    expect(deriveTitle([user('u', 'x'.repeat(50))])).toBe(`${'x'.repeat(42)}…`)
    expect(deriveTitle([])).toBe('New chat')
  })
  it('chatToMarkdown and chatFileName', () => {
    expect(chatToMarkdown({ title: 'T', messages: [user('u', 'Q'), assistant('a', [{ type: 'text', text: 'A' }])] }))
      .toBe('# T\n\n## You\n\nQ\n\n---\n\n## Assistant\n\nA\n')
    expect(chatFileName('My chat: DFW!')).toBe('my-chat-dfw-.md')
  })
  it('the default config data', () => {
    expect(DEFAULT_ASSISTANT_CONFIG.greeting()).toBe('Hey there')
    expect(DEFAULT_ASSISTANT_CONFIG.greeting('Jacob')).toBe('Hey there, Jacob')
    expect(DEFAULT_ASSISTANT_CONFIG).toMatchObject({ suggestions: [], showReasoning: true, modelSelector: false, toolLabels: {} })
  })
})

describe('repairStreamingMarkdown', () => {
  it.each([
    ['open fence', '```ts\nconst a = 1', '```ts\nconst a = 1\n```'],
    ['closed fence', '```\nx\n```\nafter', '```\nx\n```\nafter'],
    ['tilde fence', '~~~\nx', '~~~\nx\n~~~'],
    ['inline code', 'run `kubectl get', 'run `kubectl get`'],
    ['bold', 'this is **impor', 'this is **impor**'],
    ['strike', 'was ~~wro', 'was ~~wro~~'],
    ['link url', 'see [the docs](https://exa', 'see [the docs](https://exa)'],
    ['dangling opener', 'and then **', 'and then '],
    ['balanced', 'all **done** and `ok`', 'all **done** and `ok`'],
    ['code ignores emphasis', 'use `a**b`', 'use `a**b`'],
    ['only last line', '**a**\nplain', '**a**\nplain'],
  ])('%s', (_name, input, output) => {
    expect(repairStreamingMarkdown(input)).toBe(output)
  })
})
