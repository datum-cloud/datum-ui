/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CardSaveBar } from '../card-save-bar'

describe('cardSaveBar', () => {
  it('reports no changes and disables Save when nothing is dirty', () => {
    render(<CardSaveBar changeCount={0} onCancel={() => {}} onSave={() => {}} />)
    expect(screen.getByRole('status')).toHaveTextContent('No unsaved changes')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
  })

  it('pluralises the change count and enables Save', () => {
    render(<CardSaveBar changeCount={2} onCancel={() => {}} onSave={() => {}} />)
    expect(screen.getByRole('status')).toHaveTextContent('2 unsaved changes')
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  })

  it('blocks Save and explains while there are validation errors', () => {
    render(<CardSaveBar changeCount={1} errorCount={1} onCancel={() => {}} onSave={() => {}} />)
    expect(screen.getByText('1 unsaved change')).toBeInTheDocument()
    expect(screen.getByText('1 error must be fixed before saving')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  })

  it('disables both buttons while saving', () => {
    render(<CardSaveBar changeCount={1} saving onCancel={() => {}} onSave={() => {}} />)
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /Save changes/ })).toBeDisabled()
  })

  it('fires the callbacks', async () => {
    const onCancel = vi.fn()
    const onSave = vi.fn()
    render(<CardSaveBar changeCount={1} onCancel={onCancel} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it('accepts custom labels and a custom status', () => {
    render(
      <CardSaveBar
        changeCount={1}
        cancelLabel="Discard"
        saveLabel="Apply"
        onCancel={() => {}}
        onSave={() => {}}
      >
        Display name changed
      </CardSaveBar>,
    )
    expect(screen.getByRole('status')).toHaveTextContent('Display name changed')
    expect(screen.getByRole('button', { name: 'Discard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
  })

  it('renders as a bordered card footer with xs buttons', () => {
    render(<CardSaveBar changeCount={0} onCancel={() => {}} onSave={() => {}} />)
    const bar = screen.getByRole('status')
    expect(bar).toHaveAttribute('data-slot', 'card-save-bar')
    expect(bar).toHaveClass('border-t')
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass('h-7')
  })
})
