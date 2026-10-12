import { colors } from '@datum-cloud/datum-ui-tokens'
import { screen } from '@testing-library/react-native'
import { ALERT_TYPES } from '../../variants'
import { Alert } from '../alert'
import { flat, renderIn, SCHEMES } from './helpers'

describe.each(SCHEMES)('alert (%s)', (scheme) => {
  it.each(ALERT_TYPES)('renders the %s type', async (type) => {
    await renderIn(scheme, <Alert testID="alert" type={type} title={`${type} title`} description="Something happened" />)
    expect(screen.getByTestId('alert')).toBeOnTheScreen()
    expect(screen.getByText(`${type} title`)).toBeOnTheScreen()
    expect(flat(screen.getByText('Something happened').props.style).color).toBe(colors[scheme].mutedForeground)
  })

  it('maps success to the success tokens and accepts the web `variant` alias', async () => {
    await renderIn(scheme, <Alert testID="alert" variant="success" title="Done" />)
    expect(flat(screen.getByTestId('alert').props.style)).toMatchObject({
      backgroundColor: colors[scheme].success100,
      borderColor: colors[scheme].success300,
    })
    expect(flat(screen.getByText('Done').props.style).color).toBe(colors[scheme].success500)
  })
})
