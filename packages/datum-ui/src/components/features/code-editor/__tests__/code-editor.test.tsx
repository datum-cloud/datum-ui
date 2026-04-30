import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../../themes'
import { CodeEditor } from '../code-editor'

// Mock @monaco-editor/react
vi.mock('@monaco-editor/react', () => ({
  default: ({
    value,
    onChange,
    onMount,
    options,
    theme,
    language,
    height,
  }: any) => {
    // Simulate Monaco editor mounting
    if (onMount) {
      const mockEditor = {
        getAction: (_action: string) => ({
          run: vi.fn(),
        }),
      }
      setTimeout(onMount, 0, mockEditor)
    }

    return (
      <div
        data-testid="monaco-editor"
        data-value={value}
        data-language={language}
        data-theme={theme}
        data-readonly={options?.readOnly}
        data-height={height}
        onClick={() => {
          // Simulate user typing to trigger onChange
          if (onChange) {
            onChange(`${value} updated`)
          }
        }}
      >
        Monaco Editor Mock
      </div>
    )
  },
}))

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('codeEditor', () => {
  it('renders without crashing', () => {
    renderWithTheme(<CodeEditor value="" language="json" />)
  })

  it('displays the initial value', async () => {
    const value = '{"name": "test"}'
    const { container } = renderWithTheme(
      <CodeEditor value={value} language="json" />,
    )

    // Check hidden input has the correct value
    const hiddenInput = container.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement
    expect(hiddenInput).toBeInTheDocument()
    expect(hiddenInput.value).toBe(value)
  })

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn()
    renderWithTheme(
      <CodeEditor value="" onChange={handleChange} language="json" />,
    )

    // Click the mocked Monaco editor to trigger onChange
    const editor = screen.getByTestId('monaco-editor')
    await userEvent.click(editor)

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    })
  })

  it('displays error message when error prop is provided', () => {
    const error = 'Invalid JSON'
    renderWithTheme(<CodeEditor value="" language="json" error={error} />)
    expect(screen.getByText(error)).toBeInTheDocument()
  })

  it('renders in read-only mode when readOnly is true', () => {
    renderWithTheme(<CodeEditor value="test" language="json" readOnly />)

    // Verify Monaco editor receives readOnly option
    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('data-readonly', 'true')
  })

  it('renders hidden input for form integration', () => {
    const name = 'test-editor'
    const value = '{"test": true}'
    const { container } = renderWithTheme(
      <CodeEditor value={value} language="json" name={name} />,
    )

    const input = container.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'hidden')
    expect(input).toHaveAttribute('name', name)
    expect(input.value).toBe(value)
  })

  it('passes correct props to Monaco Editor', () => {
    const value = '{"test": true}'
    const language = 'json'
    renderWithTheme(<CodeEditor value={value} language={language} />)

    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('data-value', value)
    expect(editor).toHaveAttribute('data-language', language)
  })

  it('uses correct theme based on ThemeProvider', () => {
    renderWithTheme(<CodeEditor value="" language="json" />)

    const editor = screen.getByTestId('monaco-editor')
    // Default theme should be 'light' (since ThemeProvider defaults to light)
    expect(editor).toHaveAttribute('data-theme', 'light')
  })

  it('sets custom id on hidden input', () => {
    const id = 'custom-editor-id'
    const { container } = renderWithTheme(
      <CodeEditor value="" language="json" id={id} />,
    )

    const input = container.querySelector(
      'input[type="hidden"]',
    ) as HTMLInputElement
    expect(input).toHaveAttribute('id', id)
  })

  it('applies custom className', () => {
    const className = 'custom-class'
    const { container } = renderWithTheme(
      <CodeEditor value="" language="json" className={className} />,
    )

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass(className)
  })

  it('uses custom minHeight', () => {
    const minHeight = '400px'
    renderWithTheme(
      <CodeEditor value="" language="json" minHeight={minHeight} />,
    )

    const editor = screen.getByTestId('monaco-editor')
    expect(editor).toHaveAttribute('data-height', minHeight)
  })
})
