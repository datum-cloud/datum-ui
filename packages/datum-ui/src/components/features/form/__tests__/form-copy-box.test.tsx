/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { ConformAdapter } from '../adapters/conform'
import { RHFAdapter } from '../adapters/rhf'
import { Form } from '../index'

const adapters = [
  { name: 'Conform', Adapter: ConformAdapter },
  { name: 'RHF', Adapter: RHFAdapter },
]

const schema = z.object({ organizationId: z.string() })

describe.each(adapters)('form.CopyBox ($name adapter)', ({ Adapter }) => {
  function renderCopyBox() {
    render(
      <Adapter>
        <Form.Root schema={schema} onSubmit={vi.fn()} defaultValues={{ organizationId: 'org-123' }}>
          <Form.Field name="organizationId" label="Organization ID">
            <Form.CopyBox />
          </Form.Field>
        </Form.Root>
      </Adapter>,
    )
    // The Conform adapter also mirrors the value into a hidden <option>.
    const content = screen.getByText('org-123', { selector: 'span' }).parentElement as HTMLElement
    const box = content.parentElement as HTMLElement
    return { box, content }
  }

  it('uses the themed muted surface instead of a fixed light colour', () => {
    const { box } = renderCopyBox()

    expect(box).toHaveClass('bg-muted')
    expect(box.className).not.toMatch(/bg-\[#/)
  })

  it('mutes the value with a foreground token rather than opacity', () => {
    const { content } = renderCopyBox()

    expect(content).toHaveClass('text-foreground/70')
    expect(content.className).not.toMatch(/\bopacity-/)
  })
})
