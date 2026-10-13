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
