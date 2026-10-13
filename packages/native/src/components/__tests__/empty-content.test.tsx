import { colors } from '@datum-cloud/datum-ui-tokens'
import { screen } from '@testing-library/react-native'
import { Button } from '../button'
import { EmptyContent } from '../empty-content'
import { flat, renderIn, SCHEMES } from './helpers'

describe.each(SCHEMES)('emptyContent (%s)', (scheme) => {
  it('renders title, description, image and action', async () => {
    const ui = (
      <EmptyContent
        testID="empty"
        title="No proxies yet"
        description="Create one to route traffic."
        image={{ uri: 'https://example.com/scene.png' }}
        action={<Button size="xs" type="secondary">Create</Button>}
      />
    )
    await renderIn(scheme, ui)
    expect(screen.getByRole('header', { name: 'No proxies yet' })).toBeOnTheScreen()
    expect(screen.getByText('Create one to route traffic.')).toBeOnTheScreen()
    expect(screen.getByRole('button', { name: 'Create' })).toBeOnTheScreen()
    expect(flat(screen.getByTestId('empty').props.style).borderColor).toBe(colors[scheme].border)
  })

  it('can drop the frame and decorations', async () => {
    await renderIn(scheme, <EmptyContent testID="empty" title="Nothing here" variant="minimal" decorations={false} />)
    expect(flat(screen.getByTestId('empty').props.style).borderWidth).toBeUndefined()
  })
})
