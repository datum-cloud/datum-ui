import { colors } from '@datum-cloud/datum-ui-tokens'
import { screen } from '@testing-library/react-native'
import { BADGE_THEMES, BADGE_TYPES } from '../../variants'
import { Badge, getBadgeColors } from '../badge'
import { StatusBadge } from '../status-badge'
import { flat, renderIn, SCHEMES } from './helpers'

describe.each(SCHEMES)('badge (%s)', (scheme) => {
  it('defaults to muted solid', async () => {
    await renderIn(scheme, <Badge testID="badge">Draft</Badge>)
    const expected = getBadgeColors(colors[scheme], scheme, 'muted', 'solid')
    expect(flat(screen.getByTestId('badge').props.style).backgroundColor).toBe(expected.background)
    expect(flat(screen.getByText('Draft').props.style).color).toBe(expected.foreground)
  })

  it('renders every type × theme', async () => {
    const badges = BADGE_TYPES.flatMap(type => BADGE_THEMES.map(theme => (
      <Badge key={`${type}-${theme}`} type={type} theme={theme}>{`${type}-${theme}`}</Badge>
    )))
    await renderIn(scheme, <>{badges}</>)
    expect(screen.getAllByText(/-(?:solid|outline|light)$/)).toHaveLength(BADGE_TYPES.length * BADGE_THEMES.length)
  })

  it('maps solid fills to the badge tokens', () => {
    expect(getBadgeColors(colors[scheme], scheme, 'danger', 'solid')).toEqual({
      background: colors[scheme].badgeDanger,
      border: 'transparent',
      foreground: colors[scheme].badgeDangerForeground,
    })
  })
})

describe.each(SCHEMES)('statusBadge (%s)', (scheme) => {
  it.each([
    ['success', 'Success', 'success'],
    ['error', 'Error', 'danger'],
    ['pending', 'Pending', 'warning'],
    ['unknown', 'Unknown', 'muted'],
  ] as const)('%s renders the %s label with %s colours', async (status, label, type) => {
    await renderIn(scheme, <StatusBadge status={status} testID="status" />)
    expect(screen.getByText(label)).toBeOnTheScreen()
    const expected = getBadgeColors(colors[scheme], scheme, type, 'light')
    expect(flat(screen.getByTestId('status').props.style).borderRadius).toBe(4)
    expect(expected.foreground).toBeTruthy()
  })

  it('accepts a custom label and updates when the status changes', async () => {
    const { rerender } = await renderIn(scheme, <StatusBadge status="pending" label="Provisioning" />)
    expect(screen.getByLabelText('Provisioning')).toBeOnTheScreen()
    await rerender(<StatusBadge status="success" label="Ready" />)
    expect(screen.getByLabelText('Ready')).toBeOnTheScreen()
  })
})
