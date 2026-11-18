/// <reference types="@testing-library/jest-dom/vitest" />
import type { FileRejection } from 'react-dropzone'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Dropzone, DropzoneEmptyState, rejectionMessages } from '../dropzone'

describe('dropzone', () => {
  it('renders empty state when no files', () => {
    render(
      <Dropzone>
        <DropzoneEmptyState label="Drop files here" />
      </Dropzone>,
    )
    expect(screen.getByText('Drop files here')).toBeInTheDocument()
  })

  it('renders with custom description', () => {
    render(
      <Dropzone>
        <DropzoneEmptyState
          label="Upload a file"
          description="PNG, JPG up to 10MB"
        />
      </Dropzone>,
    )
    expect(screen.getByText('PNG, JPG up to 10MB')).toBeInTheDocument()
  })

  it('supports disabled state', () => {
    render(
      <Dropzone disabled>
        <DropzoneEmptyState label="Drop files here" />
      </Dropzone>,
    )
    // The hidden file input should be disabled
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(input).toBeDisabled()
  })
})

describe('dropzone rejection messages', () => {
  const MB = 1024 * 1024
  const file = (name: string, bytes: number, type = 'image/png') => new File(['x'.repeat(bytes)], name, { type })
  const rejection = (f: File, ...codes: string[]): FileRejection => ({
    file: f as FileRejection['file'],
    errors: codes.map(code => ({ code, message: `raw ${code}` })),
  })

  it('explains a file that is too large or too small', () => {
    const big = rejection(file('image.png', Math.round(4.2 * MB)), 'file-too-large')
    const small = rejection(file('tiny.png', 10), 'file-too-small')
    expect(rejectionMessages([big, small], { maxSize: MB, minSize: 1024 }).map(r => r.message)).toEqual([
      'image.png is 4.20MB; files must be under 1.00MB.',
      'tiny.png is 10.00B; files must be at least 1.00KB.',
    ])
  })

  it('names the accepted types for a wrong type, and leaves them out with no accept list', () => {
    const gif = rejection(file('a.gif', 10, 'image/gif'), 'file-invalid-type')
    expect(rejectionMessages([gif], { accept: { 'image/png': [], 'image/jpeg': [] } })[0]?.message)
      .toBe('a.gif isn\'t a supported file type. Use image/png and image/jpeg.')
    expect(rejectionMessages([gif], {})[0]?.message).toBe('a.gif isn\'t a supported file type.')
  })

  it('gives one entry per error and keeps react-dropzone\'s text for an unknown code', () => {
    const both = rejection(file('big.gif', 2 * MB, 'image/gif'), 'file-too-large', 'file-invalid-type')
    const odd = rejection(file('odd.png', 10), 'custom-check')
    const entries = rejectionMessages([both, odd], { maxSize: MB, accept: { 'image/png': [] } })
    expect(entries.map(e => e.code)).toEqual(['file-too-large', 'file-invalid-type', 'custom-check'])
    expect(entries[2]?.message).toBe('raw custom-check')
    expect(entries[0]?.file.name).toBe('big.gif')
  })

  it('words the file limit for one file and for several', () => {
    const one = rejection(file('a.png', 10), 'too-many-files')
    expect(rejectionMessages([one], { maxFiles: 1 })[0]?.message).toBe('You can add 1 file at a time.')
    expect(rejectionMessages([one], { maxFiles: 3 })[0]?.message).toBe('You can add up to 3 files at a time.')
  })

  it('reports every rejection to onReject and a merged message to onError', async () => {
    const onError = vi.fn()
    const onReject = vi.fn()
    const onDrop = vi.fn()
    const { container } = render(<Dropzone maxFiles={1} onError={onError} onReject={onReject} onDrop={onDrop} />)
    const input = container.querySelector('input[type="file"]')!
    fireEvent.change(input, { target: { files: [file('a.png', 10), file('b.png', 10), file('c.png', 10)] } })
    await waitFor(() => expect(onError).toHaveBeenCalled())
    const error = onError.mock.calls[0]![0] as Error
    expect(error).toBeInstanceOf(Error)
    expect(error.message.split('\n').filter(line => line === 'You can add 1 file at a time.')).toHaveLength(1)
    const reported = (onDrop.mock.calls[0]![1] as FileRejection[]).flatMap(r => r.errors)
    expect(reported.length).toBeGreaterThanOrEqual(2)
    expect(onReject.mock.calls[0]![0]).toHaveLength(reported.length)
    expect(error.cause).toEqual(onReject.mock.calls[0]![0])
  })
})
