import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { Form } from '../index'

const schema = z.object({ name: z.string().min(1) })

describe('form.Dialog auto-close (CR-005)', () => {
  // Uncontrolled submission: the dialog owns the submitting lifecycle, so it
  // must auto-close on a successful submit (documented contract).
  it('auto-closes on successful submit when NOT externally loading', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <ConformAdapter>
        <Form.Dialog
          title="Add"
          schema={schema}
          defaultValues={{ name: 'John' }}
          open
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        >
          <Form.Field name="name" label="Name">
            <Form.Input />
          </Form.Field>
        </Form.Dialog>
      </ConformAdapter>,
    )

    await user.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    // Auto-close requested via the controlled open handler.
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  // Externally controlled submission (fire-and-forget mutation): the parent owns
  // the lifecycle via `loading`. The dialog must stay open so a later failure
  // can still surface in-dialog instead of being torn down mid-flight.
  it('does NOT auto-close when submission is externally controlled via loading', async () => {
    const onOpenChange = vi.fn()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <ConformAdapter>
        <Form.Dialog
          title="Add"
          schema={schema}
          defaultValues={{ name: 'John' }}
          open
          loading
          onOpenChange={onOpenChange}
          onSubmit={onSubmit}
        >
          <Form.Field name="name" label="Name">
            <Form.Input />
          </Form.Field>
        </Form.Dialog>
      </ConformAdapter>,
    )

    // The submit button is disabled while externally loading, so drive the
    // submission through the form element directly.
    const form = document.querySelector('form')
    expect(form).not.toBeNull()
    fireEvent.submit(form!)

    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
    // No auto-close: the dialog remains open under external loading control.
    expect(onOpenChange).not.toHaveBeenCalledWith(false)
  })
})
