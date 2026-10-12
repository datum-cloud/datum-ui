import { colors, withAlpha } from '@datum-cloud/datum-ui-tokens'
import { fireEvent, screen } from '@testing-library/react-native'
import { StyleSheet } from 'react-native'
import { Avatar, initials } from '../avatar'
import { Separator } from '../separator'
import { Skeleton } from '../skeleton'
import { Spinner } from '../spinner'
import { flat, renderIn, SCHEMES } from './helpers'

describe.each(SCHEMES)('skeleton (%s)', (scheme) => {
  it('renders a muted block with the requested size and radius', async () => {
    await renderIn(scheme, <Skeleton testID="sk" width={120} height={12} radius={8} />)
    const sk = screen.getByTestId('sk')
    expect(flat(sk.props.style)).toMatchObject({
      width: 120,
      height: 12,
      borderRadius: 8,
      backgroundColor: withAlpha(colors[scheme].mutedForeground, 0.1),
    })
    // the shimmer mounts once the block has a width
    await fireEvent(sk, 'layout', { nativeEvent: { layout: { width: 120, height: 12, x: 0, y: 0 } } })
    expect(screen.getByTestId('sk')).toBeOnTheScreen()
  })
})

describe.each(SCHEMES)('spinner (%s)', (scheme) => {
  it('uses the muted foreground by default', async () => {
    await renderIn(scheme, <Spinner testID="spin" />)
    expect(screen.getByTestId('spin').props.color).toBe(colors[scheme].mutedForeground)
  })
})

describe.each(SCHEMES)('separator (%s)', (scheme) => {
  it('draws a hairline in the border colour', async () => {
    await renderIn(scheme, <Separator testID="sep" />)
    expect(flat(screen.getByTestId('sep', { includeHiddenElements: true }).props.style)).toMatchObject({
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors[scheme].border,
    })
  })

  it('supports vertical orientation', async () => {
    await renderIn(scheme, <Separator testID="sep" orientation="vertical" />)
    expect(flat(screen.getByTestId('sep', { includeHiddenElements: true }).props.style).width).toBe(StyleSheet.hairlineWidth)
  })
})

describe.each(SCHEMES)('avatar (%s)', (scheme) => {
  it('falls back to initials on the muted background', async () => {
    await renderIn(scheme, <Avatar testID="av" name="Ada Lovelace" size="lg" />)
    expect(screen.getByText('AL')).toBeOnTheScreen()
    expect(flat(screen.getByTestId('av').props.style)).toMatchObject({
      width: 40,
      borderRadius: 20,
      backgroundColor: colors[scheme].muted,
    })
  })

  it('renders an image and drops back to initials if it fails', async () => {
    await renderIn(scheme, <Avatar name="Grace Hopper" src="https://example.com/a.png" />)
    expect(screen.queryByText('GH')).toBeNull()
    await fireEvent(screen.getByLabelText('Grace Hopper').children[0] as never, 'error')
    expect(screen.getByText('GH')).toBeOnTheScreen()
  })
})

describe('initials', () => {
  it.each([
    ['Ada Lovelace', 'AL'],
    ['ada', 'A'],
    ['ada.lovelace@example.com', 'AL'],
    ['Jean Paul Sartre', 'JS'],
    ['', '?'],
  ])('%s -> %s', (name, expected) => {
    expect(initials(name)).toBe(expected)
  })
})
