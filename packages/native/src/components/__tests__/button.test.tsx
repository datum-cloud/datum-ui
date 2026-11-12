import { colors } from '@datum-cloud/datum-ui-tokens'
import { fireEvent, screen } from '@testing-library/react-native'
import { Text as RNText } from 'react-native'
import { BUTTON_SIZES, BUTTON_THEMES, BUTTON_TYPES } from '../../variants'
import { Button, getButtonColors } from '../button'
import { flat, renderIn, SCHEMES } from './helpers'

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy', Soft: 'soft', Rigid: 'rigid' },
  impactAsync: jest.fn(() => Promise.resolve()),
}))

describe.each(SCHEMES)('button (%s)', (scheme) => {
  it('renders a solid primary button with the token colours', async () => {
    await renderIn(scheme, <Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(flat(button.props.style)).toMatchObject({
      backgroundColor: colors[scheme].btnPrimary,
      borderColor: colors[scheme].btnPrimaryBorder,
      height: 36,
    })
    expect(flat(screen.getByText('Save').props.style).color).toBe(colors[scheme].btnPrimaryForeground)
  })

  it('renders every type × theme × size combination', async () => {
    const buttons = BUTTON_TYPES.flatMap(type => BUTTON_THEMES.flatMap(theme => BUTTON_SIZES.map(size => (
      <Button key={`${type}-${theme}-${size}`} type={type} theme={theme} size={size}>
        {`${type}-${theme}-${size}`}
      </Button>
    ))))
    await renderIn(scheme, <>{buttons}</>)
    expect(screen.getAllByRole('button')).toHaveLength(BUTTON_TYPES.length * BUTTON_THEMES.length * BUTTON_SIZES.length)
  })

  it('calls onPress and fires a light haptic', async () => {
    const onPress = jest.fn()
    await renderIn(scheme, <Button onPress={onPress}>Go</Button>)
    await fireEvent.press(screen.getByRole('button', { name: 'Go' }))
    expect(onPress).toHaveBeenCalledTimes(1)
    expect(jest.requireMock('expo-haptics').impactAsync).toHaveBeenCalledWith('light')
  })

  it('disables and shows a spinner while loading', async () => {
    const onPress = jest.fn()
    await renderIn(scheme, <Button loading onPress={onPress}>Wait</Button>)
    const button = screen.getByRole('button', { name: 'Wait' })
    expect(button).toBeDisabled()
    expect(flat(button.props.style).opacity).toBe(0.5)
    await fireEvent.press(button)
    expect(onPress).not.toHaveBeenCalled()
  })

  it('squares off icon-only buttons and passes the text colour to icon render functions', async () => {
    const ui = (
      <Button
        accessibilityLabel="Add"
        theme="outline"
        type="danger"
        icon={({ color }) => <RNText testID="icon">{color}</RNText>}
      />
    )
    await renderIn(scheme, ui)
    expect(flat(screen.getByRole('button', { name: 'Add' }).props.style)).toMatchObject({ width: 36, height: 36 })
    expect(screen.getByTestId('icon')).toHaveTextContent(colors[scheme].destructive)
  })
})

describe('button accessibility state', () => {
  it('keeps disabled and busy when the caller passes its own accessibilityState', async () => {
    await renderIn('light', <Button loading accessibilityState={{ selected: true }}>Wait</Button>)
    expect(screen.getByRole('button', { name: 'Wait' }).props.accessibilityState).toEqual({ selected: true, disabled: true, busy: true })
  })
})

describe('button touch target', () => {
  const MIN_TOUCH_TARGET = 44

  /** Total hit size along one axis: the visual size plus the slop on both sides. */
  function hitSize(visual: number, slop: { top?: number, bottom?: number, left?: number, right?: number }, axis: 'x' | 'y'): number {
    return axis === 'y'
      ? visual + (slop.top ?? 0) + (slop.bottom ?? 0)
      : visual + (slop.left ?? 0) + (slop.right ?? 0)
  }

  it.each(BUTTON_SIZES)('grows the %s size to at least 44pt tall', async (size) => {
    await renderIn('light', <Button size={size}>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    const height = (flat(button.props.style).height ?? flat(screen.getByText('Save').props.style).lineHeight) as number
    expect(hitSize(height, button.props.hitSlop ?? {}, 'y')).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
  })

  it.each(BUTTON_SIZES.filter(size => size !== 'link'))('grows an icon-only %s button to at least 44pt on both axes', async (size) => {
    await renderIn('light', <Button size={size} accessibilityLabel="Add" icon={<RNText>+</RNText>} />)
    const button = screen.getByRole('button', { name: 'Add' })
    const { width, height } = flat(button.props.style) as { width: number, height: number }
    expect(hitSize(width, button.props.hitSlop ?? {}, 'x')).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
    expect(hitSize(height, button.props.hitSlop ?? {}, 'y')).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET)
  })

  it('keeps the visual sizes', async () => {
    await renderIn('light', <Button size="xs" accessibilityLabel="Add" icon={<RNText>+</RNText>} />)
    expect(flat(screen.getByRole('button', { name: 'Add' }).props.style)).toMatchObject({ width: 28, height: 28 })
  })

  it('splits the missing height evenly above and below', async () => {
    await renderIn('light', <Button size="xs">Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' }).props.hitSlop).toEqual({ top: 8, bottom: 8, left: 0, right: 0 })
  })

  it('adds no slop to a size that already reaches 44pt', async () => {
    await renderIn('light', <Button size="large">Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' }).props.hitSlop).toBeUndefined()
  })

  it('lets the caller override the default hitSlop', async () => {
    const ui = (
      <>
        <Button hitSlop={2}>Tight</Button>
        <Button hitSlop={null}>None</Button>
      </>
    )
    await renderIn('light', ui)
    expect(screen.getByRole('button', { name: 'Tight' }).props.hitSlop).toBe(2)
    expect(screen.getByRole('button', { name: 'None' }).props.hitSlop).toBeNull()
  })
})

describe('getButtonColors', () => {
  it('uses the active token while pressed', () => {
    expect(getButtonColors(colors.light, 'light', 'danger', 'solid', true).background).toBe(colors.light.btnDangerActive)
  })

  it('switches quiet themes to the foreground colour in dark mode', () => {
    expect(getButtonColors(colors.dark, 'dark', 'primary', 'light').foreground).toBe(colors.dark.foreground)
    expect(getButtonColors(colors.light, 'light', 'primary', 'light').foreground).toBe(colors.light.primary)
  })

  it('fades outline borders to 60%', () => {
    expect(getButtonColors(colors.light, 'light', 'secondary', 'outline').border).toBe('rgba(56, 69, 85, 0.6)')
  })
})
