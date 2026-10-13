import { colors, typography } from '@datum-cloud/datum-ui-tokens'
import { screen } from '@testing-library/react-native'
import { platformFonts } from '../../theme/fonts'
import { Text, Title } from '../text'
import { flat, renderIn, SCHEMES } from './helpers'

describe.each(SCHEMES)('text (%s)', (scheme) => {
  it('defaults to the sm step, regular weight and foreground colour', async () => {
    await renderIn(scheme, <Text>Hello</Text>)
    const style = flat(screen.getByText('Hello').props.style)
    expect(style).toMatchObject({
      fontSize: typography.sizes.sm.fontSize,
      lineHeight: typography.sizes.sm.lineHeight,
      fontFamily: platformFonts.sans.regular,
      color: colors[scheme].foreground,
    })
  })

  it('applies size, weight, tone and mono', async () => {
    const ui = (
      <>
        <Text size="lg" weight="semibold" tone="muted">Muted</Text>
        <Text mono tone="destructive">Mono</Text>
      </>
    )
    await renderIn(scheme, ui)
    expect(flat(screen.getByText('Muted').props.style)).toMatchObject({
      fontSize: typography.sizes.lg.fontSize,
      fontFamily: platformFonts.sans.semibold,
      color: colors[scheme].mutedForeground,
    })
    expect(flat(screen.getByText('Mono').props.style)).toMatchObject({
      fontFamily: platformFonts.mono,
      color: colors[scheme].destructive,
    })
  })

  it('lets nested text inherit unless it sets a prop', async () => {
    const ui = (
      <Text tone="primary">
        Outer
        <Text weight="medium">inner</Text>
      </Text>
    )
    await renderIn(scheme, ui)
    const inner = flat(screen.getByText('inner').props.style)
    expect(inner.color).toBeUndefined()
    expect(inner.fontFamily).toBe(platformFonts.sans.medium)
  })
})

describe.each(SCHEMES)('title (%s)', (scheme) => {
  it('uses Canela for levels 1–3 and Alliance semibold below', async () => {
    const ui = (
      <>
        <Title level={1}>Display</Title>
        <Title level={5}>Section</Title>
      </>
    )
    await renderIn(scheme, ui)
    const display = screen.getByRole('header', { name: 'Display' })
    expect(flat(display.props.style)).toMatchObject({
      fontFamily: platformFonts.title,
      fontSize: typography.sizes['4xl'].fontSize,
      color: colors[scheme].foreground,
    })
    expect(flat(screen.getByText('Section').props.style)).toMatchObject({
      fontFamily: platformFonts.sans.semibold,
      fontSize: typography.sizes.lg.fontSize,
    })
  })
})
