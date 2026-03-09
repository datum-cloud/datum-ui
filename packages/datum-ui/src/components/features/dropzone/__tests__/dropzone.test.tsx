/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Dropzone, DropzoneEmptyState } from '../dropzone'

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
