import { colors } from '@datum-cloud/datum-ui-tokens'
import { screen } from '@testing-library/react-native'
import { Badge } from '../badge'
import { Card, CardContent, CardDescription, CardField, CardFooter, CardHeader, CardTitle } from '../card'
import { flat, renderIn, SCHEMES } from './helpers'

describe.each(SCHEMES)('card (%s)', (scheme) => {
  it('renders all slots with card colours', async () => {
    const ui = (
      <Card testID="card">
        <CardHeader action={<Badge>Live</Badge>}>
          <CardTitle>Proxy</CardTitle>
          <CardDescription>edge.example.com</CardDescription>
        </CardHeader>
        <CardContent>
          <CardDescription>Body</CardDescription>
        </CardContent>
        <CardFooter>
          <CardDescription>Footer</CardDescription>
        </CardFooter>
      </Card>
    )
    await renderIn(scheme, ui)
    expect(flat(screen.getByTestId('card').props.style)).toMatchObject({
      backgroundColor: colors[scheme].card,
      borderColor: colors[scheme].cardBorder,
      borderRadius: 10,
      paddingVertical: 24,
    })
    expect(screen.getByRole('header', { name: 'Proxy' })).toBeOnTheScreen()
    expect(flat(screen.getByText('edge.example.com').props.style).color).toBe(colors[scheme].mutedForeground)
    expect(screen.getByText('Live')).toBeOnTheScreen()
    expect(screen.getByText('Footer')).toBeOnTheScreen()
  })

  it('renders CardField rows and drops the divider on the last one', async () => {
    const ui = (
      <Card sectioned size="sm">
        <CardHeader bordered><CardTitle>Details</CardTitle></CardHeader>
        <CardContent padding="none">
          <CardField testID="f1" label="Name" value="api" />
          <CardField testID="f2" label="Status"><Badge type="success">Ready</Badge></CardField>
        </CardContent>
      </Card>
    )
    await renderIn(scheme, ui)
    expect(screen.getByText('api')).toBeOnTheScreen()
    expect(screen.getByText('Ready')).toBeOnTheScreen()
    expect(flat(screen.getByTestId('f1').props.style)).toMatchObject({
      borderBottomWidth: 1,
      borderBottomColor: colors[scheme].cardBorder,
      marginHorizontal: 16,
    })
    expect(flat(screen.getByTestId('f2').props.style).borderBottomWidth).toBeUndefined()
  })
})
