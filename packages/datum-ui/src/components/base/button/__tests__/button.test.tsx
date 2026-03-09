/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../button'

describe('button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('defaults to type="button" (htmlType prop maps to native type)', () => {
    render(<Button>Default</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('sets htmlType to submit when specified', () => {
    render(<Button htmlType="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    )

    await user.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('renders spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    const button = screen.getByRole('button')
    const spinner = button.querySelector('[aria-hidden="true"]')
    expect(spinner).toBeInTheDocument()
  })

  it('renders icon on the left by default', () => {
    const icon = <span data-testid="icon">I</span>
    render(<Button icon={icon}>Text</Button>)

    const button = screen.getByRole('button')
    const html = button.innerHTML
    const iconPos = html.indexOf('data-testid="icon"')
    const textPos = html.indexOf('Text')
    expect(iconPos).toBeLessThan(textPos)
  })

  it('renders icon on the right when iconPosition is right', () => {
    const icon = <span data-testid="icon">I</span>
    render(
      <Button icon={icon} iconPosition="right">
        Text
      </Button>,
    )

    const button = screen.getByRole('button')
    const html = button.innerHTML
    const iconPos = html.indexOf('data-testid="icon"')
    const textPos = html.indexOf('Text')
    expect(iconPos).toBeGreaterThan(textPos)
  })

  it('icon-only button (icon set, no children) gets px-0 class', () => {
    const icon = <span data-testid="icon">I</span>
    render(<Button icon={icon} />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('px-0')
  })

  it('merges custom className', () => {
    render(<Button className="my-custom">Styled</Button>)
    expect(screen.getByRole('button')).toHaveClass('my-custom')
  })

  describe('type x theme variant combinations', () => {
    const types = [
      'primary',
      'secondary',
      'tertiary',
      'quaternary',
      'warning',
      'danger',
      'success',
    ] as const
    const themes = ['solid', 'light', 'outline', 'borderless'] as const

    it.each(
      types.flatMap(type => themes.map(theme => ({ type, theme }))),
    )('renders type=$type theme=$theme without error', ({ type, theme }) => {
      render(
        <Button type={type} theme={theme}>
          {type}
          -
          {theme}
        </Button>,
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  it('renders block variant with w-full class', () => {
    render(<Button block>Block</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})
