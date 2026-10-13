import type { UIMessage } from '@datum-cloud/datum-ui-assistant-core'
import { colors } from '@datum-cloud/datum-ui-tokens'
import { act, fireEvent, screen } from '@testing-library/react-native'
import { platformFonts } from '../../theme/fonts'
import { AssistantMessage } from '../assistant/assistant-message'
import { BRAIN_GLYPH } from '../assistant/brain-path'
import { AssistantComposer } from '../assistant/composer'
import { AssistantConfigProvider } from '../assistant/config'
import { ConversationRow } from '../assistant/conversation-row'
import { AssistantEmptyState } from '../assistant/empty-state'
import { LoadingDots } from '../assistant/loading-dots'
import { AssistantMarkdown } from '../assistant/markdown'
import { AssistantSuggestions } from '../assistant/suggestions'
import { ThinkingBlock } from '../assistant/thinking-block'
import { AssistantThread } from '../assistant/thread'
import { AssistantUserMessage } from '../assistant/user-message'
import { flat, renderIn, SCHEMES } from './helpers'

const webBrain = require('../../../test/brain-source.cjs').readWebBrain as () => { viewBox: string, d: string }

const user = (id: string, text: string): UIMessage => ({ id, role: 'user', parts: [{ type: 'text', text }] })
const reply = (id: string, parts: UIMessage['parts']): UIMessage => ({ id, role: 'assistant', parts })
const runningTool = { type: 'dynamic-tool', toolName: 'alb__alb_list', toolCallId: 't1', state: 'input-available', input: {} } as const

describe('brain glyph', () => {
  it('matches the web BrainGlyph path exactly', () => {
    const web = webBrain()
    expect(BRAIN_GLYPH.viewBox).toBe(web.viewBox)
    expect(BRAIN_GLYPH.d).toBe(web.d)
  })
})

describe.each(SCHEMES)('assistant (%s)', (scheme) => {
  const c = colors[scheme]

  it('draws the user prompt as a right-aligned bg-border bubble', async () => {
    await renderIn(scheme, <AssistantUserMessage testID="bubble" text="What is wrong with web?" />)
    expect(screen.getByText('What is wrong with web?')).toBeOnTheScreen()
    expect(flat(screen.getByTestId('bubble').props.style)).toMatchObject({ backgroundColor: c.border, borderRadius: 16, borderBottomRightRadius: 4 })
  })

  it('renders an answer as markdown with the share action once settled', async () => {
    const onShare = jest.fn()
    const msg = reply('a', [{ type: 'text', text: 'All **healthy** and `ok`.', state: 'done' }])
    await renderIn(scheme, <AssistantMessage msg={msg} isLastMessage status="ready" onShare={onShare} />)
    expect(screen.getByText('healthy')).toBeOnTheScreen()
    expect(flat(screen.getByText('ok').props.style)).toMatchObject({ fontFamily: 'Menlo', color: c.foreground })
    await fireEvent.press(screen.getByLabelText('Share message'))
    expect(onShare).toHaveBeenCalledWith(msg)
    expect(screen.queryByLabelText('Copy message')).toBeNull()
  })

  it('copies with feedback when the host supplies a clipboard', async () => {
    const onCopy = jest.fn()
    const msg = reply('a', [{ type: 'text', text: 'Copy me', state: 'done' }])
    await renderIn(scheme, <AssistantMessage msg={msg} isLastMessage status="ready" onCopy={onCopy} />)
    await fireEvent.press(screen.getByLabelText('Copy message'))
    expect(onCopy).toHaveBeenCalledWith(msg)
    expect(screen.getByLabelText('Copied')).toBeOnTheScreen()
  })

  it('shows the working line with the tool label while a tool runs, and no actions', async () => {
    const msg = reply('a', [runningTool])
    const ui = (
      <AssistantConfigProvider config={{ toolLabels: { alb__alb_list: 'Looking at your load balancers…' } }}>
        <AssistantMessage msg={msg} isLastMessage status="streaming" onShare={jest.fn()} />
      </AssistantConfigProvider>
    )
    await renderIn(scheme, ui)
    expect(screen.getByText('Looking at your load balancers…')).toBeOnTheScreen()
    expect(screen.queryByLabelText('Share message')).toBeNull()
    expect(screen.queryByTestId('assistant-loading')).toBeNull()
  })

  it('falls back to "Working…" for an unlabelled tool, and dots before anything arrives', async () => {
    await renderIn(scheme, <AssistantMessage msg={reply('a', [{ ...runningTool, toolName: 'mystery' }])} isLastMessage status="streaming" />)
    expect(screen.getByText('Working…')).toBeOnTheScreen()
    await renderIn(scheme, <AssistantMessage msg={reply('b', [])} isLastMessage status="streaming" />)
    expect(screen.getByTestId('assistant-loading')).toBeOnTheScreen()
  })

  it('routes link taps through the host', async () => {
    const onLinkPress = jest.fn()
    const ui = (
      <AssistantConfigProvider config={{ onLinkPress }}>
        <AssistantMarkdown text="Open [web](/project/p/alb/web) now." />
      </AssistantConfigProvider>
    )
    await renderIn(scheme, ui)
    await fireEvent.press(screen.getByRole('link'))
    expect(onLinkPress).toHaveBeenCalledWith('/project/p/alb/web')
  })

  it('closes an unterminated code block while streaming and renders it mono', async () => {
    await renderIn(scheme, <AssistantMarkdown streaming throttleMs={0} text={'Run:\n```sh\nkubectl get httpproxies'} />)
    expect(flat(screen.getByText('kubectl get httpproxies').props.style)).toMatchObject({ fontFamily: 'Menlo' })
    expect(screen.queryByText(/```/)).toBeNull()
  })

  it('renders tables with fixed-width columns', async () => {
    await renderIn(scheme, <AssistantMarkdown text={'| Name | Ready |\n| --- | --- |\n| web | 2/2 |'} />)
    expect(screen.getByText('web')).toBeOnTheScreen()
    expect(screen.getByText('2/2')).toBeOnTheScreen()
  })

  it('composer sends trimmed text, and turns into Stop while busy', async () => {
    const onSend = jest.fn()
    const onStop = jest.fn()
    const view = await renderIn(scheme, <AssistantComposer testID="c" value="  hi  " onChangeText={jest.fn()} onSend={onSend} onStop={onStop} />)
    expect(flat(screen.getByTestId('c').props.style)).toMatchObject({ backgroundColor: c.card, borderRadius: 16 })
    await fireEvent.press(screen.getByLabelText('Send message'))
    expect(onSend).toHaveBeenCalledWith('hi')
    await view.rerender(<AssistantComposer testID="c" value="" onChangeText={jest.fn()} onSend={onSend} onStop={onStop} busy />)
    await fireEvent.press(screen.getByLabelText('Stop generating'))
    expect(onStop).toHaveBeenCalled()
  })

  it('composer does not send empty text', async () => {
    const onSend = jest.fn()
    await renderIn(scheme, <AssistantComposer value="   " onChangeText={jest.fn()} onSend={onSend} />)
    await fireEvent.press(screen.getByLabelText('Send message'))
    expect(onSend).not.toHaveBeenCalled()
  })

  it('suggestion rows use sidebar-accent and send their text', async () => {
    const onSuggestion = jest.fn()
    await renderIn(scheme, <AssistantSuggestions suggestions={['Summarize my load balancers']} onSuggestion={onSuggestion} />)
    await fireEvent.press(screen.getByText('Summarize my load balancers'))
    expect(onSuggestion).toHaveBeenCalledWith('Summarize my load balancers')
  })

  it('empty state greets in Canela with the configured suggestions', async () => {
    const ui = (
      <AssistantConfigProvider config={{ suggestions: ['What resources do I have in this project?'] }}>
        <AssistantEmptyState name="Matt" onSuggestion={jest.fn()} />
      </AssistantConfigProvider>
    )
    await renderIn(scheme, ui)
    expect(flat(screen.getByText('Hey there, Matt').props.style)).toMatchObject({ fontFamily: platformFonts.title, color: c.foreground })
    expect(screen.getByText('What resources do I have in this project?')).toBeOnTheScreen()
  })

  it('thinking block shows its label and expands to the reasoning', async () => {
    await renderIn(scheme, <ThinkingBlock text="Considering the ALBs" />)
    expect(screen.getByText('Thought')).toBeOnTheScreen()
    await fireEvent.press(screen.getByRole('button'))
    expect(screen.getByText('Considering the ALBs')).toBeOnTheScreen()
  })

  it('loading dots announce themselves', async () => {
    await renderIn(scheme, <LoadingDots testID="dots" />)
    expect(screen.getByTestId('dots').props.accessibilityLabel).toBe('Thinking')
  })

  it('conversation row shows the title and relative time', async () => {
    const onPress = jest.fn()
    const now = Date.UTC(2026, 9, 12, 12)
    await renderIn(scheme, <ConversationRow chat={{ id: 'c', title: 'DFW quota', updatedAt: now - 5 * 60_000 }} now={now} onPress={onPress} />)
    expect(screen.getByText('5m ago')).toBeOnTheScreen()
    await fireEvent.press(screen.getByText('DFW quota'))
    expect(onPress).toHaveBeenCalled()
  })

  it('thread renders prompts, replies, a custom prompt format and the footer', async () => {
    const messages = [user('u1', '@HTTPProxy/web Is it healthy?'), reply('a1', [{ type: 'text', text: 'Yes, all good.', state: 'done' }])]
    await act(async () => {
      const ui = (
        <AssistantThread
          messages={messages}
          status="ready"
          formatUserMessage={() => ({ text: 'Is it healthy?' })}
          footer={<AssistantUserMessage text="footer here" />}
        />
      )
      await renderIn(scheme, ui)
    })
    expect(screen.getByText('Is it healthy?')).toBeOnTheScreen()
    expect(screen.getByText('Yes, all good.')).toBeOnTheScreen()
    expect(screen.getByText('footer here')).toBeOnTheScreen()
  })
})
