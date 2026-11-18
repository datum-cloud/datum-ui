/// <reference types="@testing-library/jest-dom/vitest" />
import type { ErrorDescription } from '../describe-api-error'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { describeApiError } from '../describe-api-error'
import { ErrorContent } from '../error-content'
import { ErrorDescriptionProvider, useDescribeError } from '../error-description-context'

const copy = vi.fn()
vi.mock('../../../../hooks/use-copy-to-clipboard', () => ({ useCopyToClipboard: () => [false, copy] }))

const RBAC = 'forbidden: User \'a@b.c\' cannot patch resource "dnsrecordsets" in API group "dns.networking.miloapis.com" in the namespace "default"'
const status = (reason: string, code: number, message = 'raw text') => ({ kind: 'Status', reason, code, message })

describe('describeApiError', () => {
  it.each<[string, unknown, string, string | undefined]>([
    ['Unauthorized', status('Unauthorized', 401), 'Your session has expired.', 'Sign in again to continue.'],
    ['NotFound', status('NotFound', 404), 'This item no longer exists.', 'It may have been deleted. Refresh to see the latest.'],
    ['AlreadyExists', status('AlreadyExists', 409), 'An item with this name already exists.', 'Choose a different name.'],
    ['Conflict', status('Conflict', 409), 'Someone else changed this item.', 'Refresh and try again.'],
    ['TooManyRequests', status('TooManyRequests', 429), 'Too many requests.', 'Wait a moment and try again.'],
    ['Timeout', status('Timeout', 504), 'The service took too long to respond.', 'Try again in a moment.'],
    ['ServerTimeout', status('ServerTimeout', 503), 'The service took too long to respond.', 'Try again in a moment.'],
    ['503 by status only', { status: 503, message: 'down' }, 'The service took too long to respond.', 'Try again in a moment.'],
    ['RBAC Forbidden', status('Forbidden', 403, RBAC), 'You don\'t have permission to change dnsrecordsets.', 'Ask an administrator of this project for access.'],
  ])('describes %s', (_name, error, title, description) => {
    const described = describeApiError(error)
    expect(described.title).toBe(title)
    expect(described.description).toBe(description)
  })

  it('keeps the raw text as detail', () => {
    expect(describeApiError(status('Forbidden', 403, RBAC)).detail).toBe(RBAC)
  })

  it('keeps the message of an Invalid error as its title', () => {
    expect(describeApiError(status('Invalid', 422, 'spec.name: Required value'))).toEqual({ title: 'spec.name: Required value', detail: 'spec.name: Required value' })
  })

  it('uses a plain title for an Invalid error with no message', () => {
    expect(describeApiError({ kind: 'Status', reason: 'Invalid', code: 422 }).title).toBe('Some values aren\'t valid.')
  })

  it('names the product area when the API group has a label', () => {
    const labels = { apiGroupLabels: { 'dns.networking.miloapis.com': 'Networking/DNS' } }
    expect(describeApiError(status('Forbidden', 403, RBAC), labels).title).toBe('Permission denied for changes to Networking/DNS.')
    expect(describeApiError(status('Forbidden', 403, RBAC.replace('patch', 'get')), labels).title).toBe('Permission denied to view Networking/DNS.')
  })

  it('reads single-quoted resources and maps every verb', () => {
    const message = (verb: string) => `User 'x' cannot ${verb} resource 'domains' in API group 'networking.datumapis.com'`
    expect(describeApiError(status('Forbidden', 403, message('list'))).title).toBe('You don\'t have permission to view domains.')
    expect(describeApiError(status('Forbidden', 403, message('create'))).title).toBe('You don\'t have permission to create domains.')
    expect(describeApiError(status('Forbidden', 403, message('deletecollection'))).title).toBe('You don\'t have permission to delete domains.')
  })

  it('keeps the message of a 403 that is not an RBAC denial', () => {
    expect(describeApiError({ status: 403, message: 'Your organization is suspended.' }).title).toBe('Your organization is suspended.')
  })

  it('keeps the message of an error it does not recognise', () => {
    const described = describeApiError(new Error('Project is not ready: quota exceeded'))
    expect(described.title).toBe('Project is not ready: quota exceeded')
    expect(described.description).toBeUndefined()
  })

  it('reads cloud-portal\'s AppError fields', () => {
    const appError = { status: 403, code: 'INTERNAL_ERROR', k8sReason: 'Forbidden', message: 'You don\'t have permission to do this.', originalMessage: RBAC, requestId: 'req-1' }
    expect(describeApiError(appError)).toEqual<ErrorDescription>({
      title: 'You don\'t have permission to change dnsrecordsets.',
      description: 'Ask an administrator of this project for access.',
      detail: RBAC,
      requestId: 'req-1',
    })
  })

  it('keeps the message written for people as the title and the original as detail', () => {
    const appError = { status: 403, message: 'You don\'t have permission to do this.', originalMessage: 'Forbidden' }
    expect(describeApiError(appError)).toEqual<ErrorDescription>({
      title: 'You don\'t have permission to do this.',
      detail: 'Forbidden',
    })
  })

  it('does not put a raw non-RBAC denial in the title', () => {
    const raw = 'User "jane@example.com" cannot get path "/apis/foo"'
    const described = describeApiError({ status: 403, message: 'You don\'t have permission to do this.', originalMessage: raw })
    expect(described.title).toBe('You don\'t have permission to do this.')
    expect(described.detail).toBe(raw)
  })

  it('gives a 403 with no text a permission headline', () => {
    expect(describeApiError({ status: 403 })).toEqual<ErrorDescription>({
      title: 'You don\'t have permission to do this.',
      description: 'Ask an administrator of this project for access.',
    })
  })

  it('reads an RBAC denial and its raw text from the cause of a wrapper', () => {
    const wrapped = new Error('Failed to delete record', { cause: status('Forbidden', 403, RBAC) })
    const described = describeApiError(wrapped)
    expect(described.title).toBe('You don\'t have permission to change dnsrecordsets.')
    expect(described.detail).toBe(RBAC)
  })

  it('recognises a network failure wrapped by an app error', () => {
    const appError = { status: 500, message: 'Failed to fetch', cause: new TypeError('Failed to fetch') }
    expect(describeApiError(appError).title).toBe('Couldn\'t reach the server.')
  })

  it('recognises Safari\'s network failure and not a code bug that mentions fetch', () => {
    expect(describeApiError(new TypeError('Load failed')).title).toBe('Couldn\'t reach the server.')
    const bug = 'Cannot read properties of undefined (reading \'fetch\')'
    expect(describeApiError(new TypeError(bug)).title).toBe(bug)
  })

  it('reads a 409 whose text says already exists as a name clash', () => {
    expect(describeApiError({ status: 409, message: 'project "web" already exists' }).title).toBe('An item with this name already exists.')
  })

  it('reads a request id from an x-request-id header', () => {
    expect(describeApiError({ status: 404, message: 'gone', headers: { 'x-request-id': 'req-2' } }).requestId).toBe('req-2')
  })

  it('looks one level into cause', () => {
    const wrapped = new Error('wrapped', { cause: status('NotFound', 404, 'x not found') })
    expect(describeApiError(wrapped).title).toBe('This item no longer exists.')
  })

  it('describes a network failure', () => {
    expect(describeApiError(new TypeError('Failed to fetch')).title).toBe('Couldn\'t reach the server.')
  })

  it('handles a string, an empty object and undefined', () => {
    expect(describeApiError('plain string').title).toBe('plain string')
    for (const value of [{}, undefined]) {
      expect(describeApiError(value)).toEqual<ErrorDescription>({
        title: 'Something went wrong.',
        description: 'Try again. If it keeps happening, contact support.',
      })
    }
  })
})

function Show({ error }: { error: unknown }) {
  const describe = useDescribeError()
  return <p>{describe(error).title}</p>
}

describe('errorDescriptionProvider', () => {
  it('falls back to describeApiError with no provider', () => {
    render(<Show error={status('NotFound', 404)} />)
    expect(screen.getByText('This item no longer exists.')).toBeInTheDocument()
  })

  it('passes apiGroupLabels to the default translator', () => {
    render(
      <ErrorDescriptionProvider apiGroupLabels={{ 'dns.networking.miloapis.com': 'Networking/DNS' }}>
        <Show error={status('Forbidden', 403, RBAC)} />
      </ErrorDescriptionProvider>,
    )
    expect(screen.getByText('Permission denied for changes to Networking/DNS.')).toBeInTheDocument()
  })

  it('lets describe start from the base description', () => {
    render(
      <ErrorDescriptionProvider
        apiGroupLabels={{ 'dns.networking.miloapis.com': 'Networking/DNS' }}
        describe={(_error, base) => ({ ...base, title: `Custom: ${base.title}` })}
      >
        <Show error={status('Forbidden', 403, RBAC)} />
      </ErrorDescriptionProvider>,
    )
    expect(screen.getByText('Custom: Permission denied for changes to Networking/DNS.')).toBeInTheDocument()
  })
})

describe('errorContent', () => {
  it('shows the translated title and description with the raw text in closed details', () => {
    const { container } = render(<ErrorContent error={status('Forbidden', 403, RBAC)} />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('You don\'t have permission to change dnsrecordsets.')).toBeInTheDocument()
    expect(screen.getByText('Ask an administrator of this project for access.')).toBeInTheDocument()
    const details = container.querySelector('details')
    expect(details).not.toBeNull()
    expect(details).not.toHaveAttribute('open')
    expect(details?.querySelector('summary')).toHaveTextContent('Error details')
    expect(details).toHaveTextContent(RBAC)
  })

  it('lets title and description props replace the translated ones', () => {
    render(<ErrorContent error={status('NotFound', 404)} title="Gone" description="Pick another" />)
    expect(screen.getByText('Gone')).toBeInTheDocument()
    expect(screen.getByText('Pick another')).toBeInTheDocument()
    expect(screen.queryByText('This item no longer exists.')).toBeNull()
  })

  it('shows the request id inside the details', () => {
    const { container } = render(<ErrorContent error={{ status: 404, message: 'gone', requestId: 'req-9' }} />)
    expect(container.querySelector('details')).toHaveTextContent('req-9')
  })

  it('copies the raw text', () => {
    render(<ErrorContent error={status('Forbidden', 403, RBAC)} />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy error details' }))
    expect(copy).toHaveBeenCalledWith(RBAC)
  })

  it('runs an action', () => {
    const onClick = vi.fn()
    render(<ErrorContent error={status('NotFound', 404)} actions={[{ label: 'Retry', onClick }]} />)
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onClick).toHaveBeenCalled()
  })

  it('shows no details when they would repeat the headline', () => {
    const { container } = render(<ErrorContent error={new Error('Project is not ready')} />)
    expect(screen.getByRole('heading', { name: 'Project is not ready' })).toBeInTheDocument()
    expect(container.querySelector('details')).toBeNull()
  })

  it('shows no details when there is no raw text', () => {
    const { container } = render(<ErrorContent error={{}} />)
    expect(container.querySelector('details')).toBeNull()
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
  })
})
