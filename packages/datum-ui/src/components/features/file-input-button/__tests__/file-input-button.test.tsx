/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FileInputButton } from '../file-input-button'

describe('fileInputButton', () => {
  it('renders a button', () => {
    render(<FileInputButton>Upload</FileInputButton>)
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument()
  })

  it('renders with custom button props', () => {
    render(
      <FileInputButton data-testid="upload-btn">
        Choose File
      </FileInputButton>,
    )
    expect(screen.getByTestId('upload-btn')).toBeInTheDocument()
    expect(screen.getByText('Choose File')).toBeInTheDocument()
  })

  it('supports disabled state', () => {
    render(<FileInputButton disabled>Upload</FileInputButton>)
    expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled()
  })
})
