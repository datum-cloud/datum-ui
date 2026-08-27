/// <reference types="@testing-library/jest-dom/vitest" />
import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '../../data-table/core/features'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MotionGlobalConfig } from 'motion/react'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { GroupedTable } from '../grouped-table'

interface Row { name: string, value: number }
const columns: ColumnDef<DataTableFeatures, Row, unknown>[] = [
  { accessorKey: 'name', header: 'Resource', cell: info => info.getValue() as string, size: 160 },
  { accessorKey: 'value', header: 'Value', cell: info => String(info.getValue()) },
]
const groups = [
  { id: 'g1', title: 'Group One', meta: <span>2 items</span>, rows: [{ name: 'alpha', value: 1 }, { name: 'beta', value: 2 }] },
  { id: 'g2', title: 'Group Two', rows: [{ name: 'gamma', value: 3 }] },
]

describe('groupedTable', () => {
  beforeAll(() => {
    MotionGlobalConfig.skipAnimations = true
  })
  afterAll(() => {
    MotionGlobalConfig.skipAnimations = false
  })

  it('renders group titles, meta, and rows (all expanded by default)', () => {
    render(<GroupedTable columns={columns} groups={groups} />)
    expect(screen.getByText('Group One')).toBeInTheDocument()
    expect(screen.getByText('2 items')).toBeInTheDocument()
    expect(screen.getByText('alpha')).toBeVisible()
    expect(screen.getByText('gamma')).toBeVisible()
  })

  it('collapses a group when its header is clicked', () => {
    render(<GroupedTable columns={columns} groups={groups} />)
    fireEvent.click(screen.getByText('Group One'))
    expect(screen.getByText('Group One').closest('button')).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('alpha').closest('[data-slot="grouped-table-group-content"]')).toHaveAttribute('inert')
  })

  it('respects defaultExpanded=\'none\'', () => {
    render(<GroupedTable columns={columns} groups={groups} defaultExpanded="none" />)
    expect(screen.getByText('Group One').closest('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('renders the empty slot when there are no rows', () => {
    render(<GroupedTable columns={columns} groups={[]} empty={<div>No data</div>} />)
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('controlled mode reflects the expanded prop and defers toggles to the parent', () => {
    const onExpandedChange = vi.fn()
    render(
      <GroupedTable columns={columns} groups={groups} expanded={['g1']} onExpandedChange={onExpandedChange} />,
    )
    expect(screen.getByText('Group One').closest('button')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Group Two').closest('button')).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(screen.getByText('Group One'))
    // Controlled: it asks the parent to close g1 but does not self-update.
    expect(onExpandedChange).toHaveBeenCalledWith([])
    expect(screen.getByText('Group One').closest('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders a column header row', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} />)
    // The visible column headers live in the first (shared) header table; each
    // group table also carries an sr-only copy for screen-reader association.
    const headerTable = container.querySelector('table')!
    expect(within(headerTable).getByText('Resource')).toBeInTheDocument()
    expect(within(headerTable).getByText('Value')).toBeInTheDocument()
  })

  it('gives each group table its own (screen-reader-only) column headers', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} />)
    // Header table + one <thead> per group so cells associate with columns.
    const theads = container.querySelectorAll('thead')
    expect(theads.length).toBe(1 + groups.length)
    const groupThead = theads[1]!
    expect(groupThead.className).toContain('sr-only')
    expect(within(groupThead as HTMLElement).getByText('Resource')).toBeInTheDocument()
  })

  it('ignores group-header clicks while searching so stored expansion is preserved', () => {
    // Search forces every group open. Clicking a header must not flip the
    // underlying expansion state, otherwise groups collapse once search clears.
    const { rerender } = render(
      <GroupedTable columns={columns} groups={groups} enableSearch search="alpha" />,
    )
    fireEvent.click(screen.getByText('Group One'))
    rerender(<GroupedTable columns={columns} groups={groups} enableSearch search="" />)
    expect(screen.getByText('Group One').closest('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('aligns header and group tables on identical colgroup widths', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} />)
    const colgroups = container.querySelectorAll('colgroup')
    expect(colgroups.length).toBeGreaterThanOrEqual(2) // header table + at least one group table
    const widthsOf = (cg: Element) => Array.from(cg.querySelectorAll('col')).map(c => (c as HTMLElement).style.width)
    const first = widthsOf(colgroups[0]!)
    expect(first).toEqual(['160px', 'auto'])
    for (const cg of Array.from(colgroups))
      expect(widthsOf(cg)).toEqual(first)
  })

  it('wraps the table area in a horizontal-scroll track sized from columns', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} />)
    const scroll = container.querySelector('.overflow-x-auto')
    expect(scroll).toBeInTheDocument()
    // single shared track so header + group tables scroll together and stay aligned
    const track = scroll!.firstElementChild as HTMLElement
    expect(track.style.minWidth).toBe('280px') // 160px (name) + 120px flex floor (value)
  })

  it('renders selection checkboxes and toggles a row', () => {
    render(<GroupedTable columns={columns} groups={groups} enableRowSelection />)
    const checkboxes = screen.getAllByLabelText('Select row')
    expect(checkboxes.length).toBe(3)
    fireEvent.click(checkboxes[0]!)
    expect(checkboxes[0]!).toBeChecked()
  })

  it('sorts within a group, not across groups', () => {
    render(<GroupedTable columns={columns} groups={groups} enableSorting />)
    fireEvent.click(screen.getByRole('button', { name: /Sort by Resource/ }))
    const cells = screen.getAllByText(/^(alpha|beta|gamma)$/).map(el => el.textContent)
    expect(cells[cells.length - 1]).toBe('gamma') // group two stays last
  })

  it('renders row actions and fires a handler', () => {
    const onClick = vi.fn()
    render(<GroupedTable columns={columns} groups={groups} rowActions={() => [{ label: 'Edit', onClick }]} />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Open menu' })[0]!)
    fireEvent.click(screen.getByText('Edit'))
    expect(onClick).toHaveBeenCalled()
  })

  it('filters rows by search and hides non-matching groups', async () => {
    render(<GroupedTable columns={columns} groups={groups} enableSearch searchPlaceholder="Search" searchDebounceMs={0} />)
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'alpha' } })
    await waitFor(() => expect(screen.queryByText('gamma')).not.toBeInTheDocument())
    expect(screen.getByText('alpha')).toBeInTheDocument()
    expect(screen.getByText('Group One')).toBeInTheDocument()
    expect(screen.queryByText('Group Two')).not.toBeInTheDocument()
  })

  it('shows the empty slot when search matches nothing', async () => {
    render(<GroupedTable columns={columns} groups={groups} enableSearch searchPlaceholder="Search" searchDebounceMs={0} empty={<div>No results</div>} />)
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'zzzzz' } })
    await screen.findByText('No results')
  })

  it('renders skeleton when isLoading', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} isLoading />)
    expect(container.querySelector('[data-slot="gt-skeleton"]')).toBeInTheDocument()
  })

  it('controlled selection defers to parent', () => {
    const onRowSelectionChange = vi.fn()
    render(
      <GroupedTable
        columns={columns}
        groups={groups}
        enableRowSelection
        rowSelection={{}}
        onRowSelectionChange={onRowSelectionChange}
        getRowId={r => r.name}
      />,
    )
    fireEvent.click(screen.getAllByLabelText('Select row')[0]!)
    expect(onRowSelectionChange).toHaveBeenCalled()
    expect(screen.getAllByLabelText('Select row')[0]!).not.toBeChecked()
  })

  it('applies a string cellClassName to every data cell', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} cellClassName="custom-cell" />)
    // 3 rows (alpha, beta, gamma) x 2 columns
    expect(container.querySelectorAll('td.custom-cell')).toHaveLength(6)
  })

  it('applies groupHeaderClassName(group) to each group band', () => {
    render(<GroupedTable columns={columns} groups={groups} groupHeaderClassName={g => `band-${g.id}`} />)
    expect(screen.getByText('Group One').closest('button')).toHaveClass('band-g1')
    expect(screen.getByText('Group Two').closest('button')).toHaveClass('band-g2')
  })

  const manyGroups = [
    { id: 'compute', title: 'Compute', rows: [{ name: 'vcpu', value: 1 }] },
    { id: 'git', title: 'Git Assistant', rows: [{ name: 'tokens', value: 2 }] },
    { id: 'storage', title: 'Storage', rows: [{ name: 'bytes', value: 3 }] },
    { id: 'networking', title: 'Networking', rows: [
      { name: 'requests', value: 4 },
      { name: 'egress', value: 5 },
      { name: 'ingress', value: 6 },
      { name: 'connections', value: 7 },
    ] },
  ]

  function groupTriggers() {
    return screen.getAllByRole('button').filter(el => el.getAttribute('aria-expanded') != null)
  }

  it('keeps the last group\'s rows visible when every group starts expanded', () => {
    render(
      <div className="overflow-hidden rounded-xl border">
        <GroupedTable columns={columns} groups={manyGroups} />
      </div>,
    )
    expect(screen.getByText('Networking').closest('button')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('requests')).toBeVisible()
    expect(screen.getByText('egress')).toBeVisible()
    expect(screen.getByText('ingress')).toBeVisible()
    expect(screen.getByText('connections')).toBeVisible()
  })

  it('does not wrap group content in Radix CollapsibleContent', () => {
    const { container } = render(<GroupedTable columns={columns} groups={manyGroups} />)
    const contents = container.querySelectorAll('[data-slot="grouped-table-group-content"]')
    expect(contents).toHaveLength(manyGroups.length)
    for (const content of Array.from(contents)) {
      expect(content.tagName).toBe('DIV')
      expect(content).not.toHaveAttribute('data-state')
      expect(content).not.toHaveAttribute('hidden')
      expect(content.className).not.toMatch(/animate-collapsible/)
    }
  })

  it('does not put a border-b on group headers (open or closed)', () => {
    render(<GroupedTable columns={columns} groups={groups} defaultExpanded="none" />)
    for (const trigger of groupTriggers()) {
      expect(trigger.className.split(/\s+/)).not.toContain('border-b')
      expect(trigger.className).not.toContain('data-[state=closed]:border-b')
    }
  })

  it('draws a top border on every group after the first, including when open', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} />)
    const groupEls = container.querySelectorAll('[data-slot="grouped-table-group"]')
    expect(groupEls).toHaveLength(groups.length)
    expect(groupEls[0]!.className.split(/\s+/)).not.toContain('border-t')
    expect(groupEls[1]!.className.split(/\s+/)).toContain('border-t')
    expect(groupEls[1]!.className.split(/\s+/)).toContain('border-border')
    expect(screen.getByText('Group Two').closest('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('draws a header divider inside the group body, including one-row groups', () => {
    const { container } = render(<GroupedTable columns={columns} groups={manyGroups} />)
    const contents = container.querySelectorAll('[data-slot="grouped-table-group-content"]')
    expect(contents).toHaveLength(manyGroups.length)
    for (const content of Array.from(contents)) {
      const rule = content.querySelector('[data-slot="grouped-table-group-rule"]')
      expect(rule).toBeInTheDocument()
    }

    const oneRow = render(
      <GroupedTable
        columns={columns}
        groups={[{ id: 'compute', title: 'Compute', rows: [{ name: 'vcpu', value: 1 }] }]}
      />,
    )
    expect(oneRow.container.querySelector('[data-slot="grouped-table-group-rule"]')).toBeInTheDocument()
  })

  it('keeps a single top border on later groups when they are collapsed', () => {
    const { container } = render(<GroupedTable columns={columns} groups={groups} defaultExpanded="none" />)
    const groupEls = container.querySelectorAll('[data-slot="grouped-table-group"]')
    expect(groupEls[1]!.className.split(/\s+/)).toContain('border-t')
    expect(groupEls[1]!.className.split(/\s+/)).toContain('border-border')
    expect(groupTriggers()[1]!.className.split(/\s+/)).not.toContain('border-b')
    expect(screen.getByText('Group Two').closest('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('restores last-group rows after collapse and expand', () => {
    render(<GroupedTable columns={columns} groups={manyGroups} />)
    fireEvent.click(screen.getByText('Networking'))
    expect(screen.getByText('requests').closest('[data-slot="grouped-table-group-content"]')).toHaveAttribute('inert')
    fireEvent.click(screen.getByText('Networking'))
    expect(screen.getByText('Networking').closest('button')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('requests').closest('[data-slot="grouped-table-group-content"]')).not.toHaveAttribute('inert')
    expect(screen.getByText('requests')).toBeVisible()
    expect(screen.getByText('connections')).toBeVisible()
  })

  it('does not drop rows after TanStack\'s default page size of 10', () => {
    const extra = [
      ...manyGroups,
      { id: 'notes', title: 'Notes', rows: [{ name: 'notebooks', value: 8 }] },
      { id: 'platform', title: 'Platform Core', rows: [{ name: 'projects', value: 9 }, { name: 'orgs', value: 10 }] },
      { id: 'other', title: 'Other', rows: [{ name: 'misc-a', value: 11 }, { name: 'misc-b', value: 12 }] },
    ]
    render(
      <div className="overflow-hidden rounded-xl border">
        <GroupedTable columns={columns} groups={extra} />
      </div>,
    )
    expect(screen.getByText('notebooks')).toBeVisible()
    expect(screen.getByText('projects')).toBeVisible()
    expect(screen.getByText('orgs')).toBeVisible()
    expect(screen.getByText('misc-a')).toBeVisible()
    expect(screen.getByText('misc-b')).toBeVisible()
  })
})
