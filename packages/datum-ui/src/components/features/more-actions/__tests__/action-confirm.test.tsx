import type { ActionItem } from '../types'
/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTableRowActions } from '../../data-table/components/row-actions'
import { MoreActions } from '../more-actions'

interface Project {
  name: string
}

const project: Project = { name: 'Apollo' }

function deleteAction(overrides?: Partial<ActionItem<Project>>): ActionItem<Project> {
  return {
    key: 'delete',
    label: 'Delete',
    variant: 'destructive',
    onClick: vi.fn(),
    confirm: {
      title: row => `Delete ${row.name}?`,
      description: 'This cannot be undone.',
      confirmLabel: 'Delete project',
    },
    ...overrides,
  }
}

/** Render MoreActions, open the menu and click the Delete item. */
async function openAndClickDelete(action: ActionItem<Project>, onRowClick?: () => void) {
  const user = userEvent.setup()
  render(
    <div onClick={onRowClick}>
      <MoreActions row={project} actions={[action]} />
    </div>,
  )
  await user.click(screen.getByRole('button', { name: 'Actions' }))
  await user.click(await screen.findByRole('button', { name: 'Delete' }))
  return user
}

function deferred() {
  let resolve!: () => void
  let reject!: (reason: Error) => void
  const promise = new Promise<void>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('action confirm', () => {
  it('runs an action without confirm on the first click', async () => {
    const onClick = vi.fn()
    await openAndClickDelete(deleteAction({ onClick, confirm: undefined }))

    expect(onClick).toHaveBeenCalledExactlyOnceWith(project)
    expect(screen.queryByRole('dialog', { name: /Delete Apollo/ })).not.toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument())
  })

  it('opens a dialog instead of running an action that has confirm', async () => {
    const onClick = vi.fn()
    await openAndClickDelete(deleteAction({ onClick }))

    const dialog = await screen.findByRole('dialog', { name: 'Delete Apollo?' })
    expect(within(dialog).getByText('This cannot be undone.')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('runs the action only after Confirm, then closes the dialog and the menu', async () => {
    const onClick = vi.fn()
    const user = await openAndClickDelete(deleteAction({ onClick }))

    await user.click(await screen.findByRole('button', { name: 'Delete project' }))

    expect(onClick).toHaveBeenCalledExactlyOnceWith(project)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus())
  })

  it('styles the confirm button as destructive only for a destructive action', async () => {
    const user = await openAndClickDelete(deleteAction({ variant: 'default', confirm: { title: 'Archive?' } }))

    const confirmButton = await screen.findByRole('button', { name: 'Confirm' })
    expect(confirmButton.className).not.toContain('btn-danger')

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
  })

  it('uses the danger button for a destructive action', async () => {
    await openAndClickDelete(deleteAction())

    expect((await screen.findByRole('button', { name: 'Delete project' })).className).toContain('btn-danger')
  })

  it('does not run the action on Cancel and returns focus to the item', async () => {
    const onClick = vi.fn()
    const user = await openAndClickDelete(deleteAction({ onClick }))

    await user.click(await screen.findByRole('button', { name: 'Cancel' }))

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Delete Apollo?' })).not.toBeInTheDocument())
    expect(onClick).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus())
  })

  it('does not run the action on Escape and returns focus to the item', async () => {
    const onClick = vi.fn()
    const user = await openAndClickDelete(deleteAction({ onClick }))
    await screen.findByRole('dialog', { name: 'Delete Apollo?' })

    await user.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Delete Apollo?' })).not.toBeInTheDocument())
    expect(onClick).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus())
  })

  it('disables both buttons while a promise is pending and closes when it resolves', async () => {
    const { promise, resolve } = deferred()
    const onClick = vi.fn(() => promise)
    const user = await openAndClickDelete(deleteAction({ onClick }))

    await user.click(await screen.findByRole('button', { name: 'Delete project' }))

    expect(screen.getByRole('button', { name: 'Delete project' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()

    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog', { name: 'Delete Apollo?' })).toBeInTheDocument()

    resolve()
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('keeps the dialog open and re-enables the buttons when the promise rejects', async () => {
    const { promise, reject } = deferred()
    const onClick = vi.fn(() => promise)
    const user = await openAndClickDelete(deleteAction({ onClick }))

    await user.click(await screen.findByRole('button', { name: 'Delete project' }))
    reject(new Error('nope'))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Delete project' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
    expect(screen.getByRole('dialog', { name: 'Delete Apollo?' })).toBeInTheDocument()
  })

  it('keeps clicks inside the dialog away from a clickable ancestor', async () => {
    const onRowClick = vi.fn()
    const user = await openAndClickDelete(deleteAction(), onRowClick)
    onRowClick.mockClear()

    await user.click(await screen.findByText('This cannot be undone.'))
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onRowClick).not.toHaveBeenCalled()
  })

  it('confirms data-table row actions too', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <DataTableRowActions
        row={{ original: project } as any}
        actions={[deleteAction({ onClick })]}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(await screen.findByRole('button', { name: 'Delete' }))
    expect(onClick).not.toHaveBeenCalled()

    await user.click(await screen.findByRole('button', { name: 'Delete project' }))
    expect(onClick).toHaveBeenCalledExactlyOnceWith(project)
  })
})
