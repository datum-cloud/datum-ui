import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../../themes'
import { CodeEditorTabs } from '../code-editor-tabs'

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
        data-testid={`monaco-editor-${language}`}
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
        {value}
      </div>
    )
  },
}))

// Mock toast
vi.mock('../../toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    message: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('codeEditorTabs', () => {
  it('renders with YAML tab active by default', () => {
    renderWithTheme(<CodeEditorTabs value="name: test" />)
    expect(screen.getByRole('tab', { name: /yaml/i })).toHaveAttribute('data-state', 'active')
  })

  it('renders with JSON tab active when format is json', () => {
    renderWithTheme(<CodeEditorTabs value='{"name":"test"}' format="json" />)
    expect(screen.getByRole('tab', { name: /json/i })).toHaveAttribute('data-state', 'active')
  })

  it('switches tabs when clicking tab triggers', async () => {
    const user = userEvent.setup()
    renderWithTheme(<CodeEditorTabs value="name: test" />)

    const jsonTab = screen.getByRole('tab', { name: /json/i })
    await user.click(jsonTab)

    await waitFor(() => {
      expect(jsonTab).toHaveAttribute('data-state', 'active')
    })
  })

  it('converts YAML to JSON when switching tabs', async () => {
    const user = userEvent.setup()
    const yaml = 'name: test\nage: 30'
    renderWithTheme(<CodeEditorTabs value={yaml} />)

    const jsonTab = screen.getByRole('tab', { name: /json/i })
    await user.click(jsonTab)

    await waitFor(() => {
      // Check that JSON content is displayed
      expect(screen.getByText(/"name":/)).toBeInTheDocument()
    })
  })

  it('calls onChange with correct format when value changes', async () => {
    const handleChange = vi.fn()
    renderWithTheme(<CodeEditorTabs value="name: test" onChange={handleChange} />)

    // Click the YAML editor to trigger a change
    const yamlEditor = screen.getByTestId('monaco-editor-yaml')
    await userEvent.click(yamlEditor)

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(expect.any(String), 'yaml')
    })
  })

  it('calls onFormatChange when tab switches', async () => {
    const user = userEvent.setup()
    const handleFormatChange = vi.fn()
    renderWithTheme(<CodeEditorTabs value="name: test" onFormatChange={handleFormatChange} />)

    const jsonTab = screen.getByRole('tab', { name: /json/i })
    await user.click(jsonTab)

    await waitFor(() => {
      expect(handleFormatChange).toHaveBeenCalledWith('json')
    })
  })

  it('renders hidden inputs for form integration', () => {
    const name = 'config'
    const value = 'name: test'
    const { container } = renderWithTheme(<CodeEditorTabs value={value} name={name} />)

    const inputs = container.querySelectorAll('input[type="hidden"]') as NodeListOf<HTMLInputElement>

    // Find the content input (should have the YAML value)
    const contentInput = Array.from(inputs).find(input => input.name === name)
    expect(contentInput).toBeInTheDocument()
    expect(contentInput?.value).toBe(value)

    // Find the format input
    const formatInput = Array.from(inputs).find(input => input.name === `${name}-format`)
    expect(formatInput).toBeInTheDocument()
    expect(formatInput?.value).toBe('yaml')
  })
})
