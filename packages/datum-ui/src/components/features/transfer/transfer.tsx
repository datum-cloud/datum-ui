import type { TransferProps } from './types'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { TransferPanel } from './components/transfer-panel'
import { useTransferState } from './hooks/use-transfer-state'

export function Transfer<T,>({
  items,
  value,
  onChange,
  itemKey,
  itemLabel,
  itemGroup,
  searchable = true,
  searchPlaceholder = 'Search...',
  sourceTitle = 'Available',
  targetTitle = 'Selected',
  enableSelectAll = true,
  disabled = false,
  className,
}: TransferProps<T>) {
  // State management
  const state = useTransferState({
    items,
    value,
    itemKey,
    itemLabel,
    itemGroup,
  })

  // Select item (move to target)
  const handleSelect = (key: string) => {
    if (value.includes(key))
      return
    onChange([...value, key])
  }

  // Deselect item (remove from target)
  const handleDeselect = (key: string) => {
    onChange(value.filter(k => k !== key))
  }

  // Select all filtered items
  const handleSelectAll = () => {
    const sourceKeys = state.filteredSourceItems.map(item => item.key)
    const existing = new Set(value)
    const newKeys = sourceKeys.filter(k => !existing.has(k))
    onChange([...value, ...newKeys])
  }

  // Clear all selected items
  const handleClearAll = () => {
    onChange([])
  }

  return (
    <div className={cn('flex h-[400px]', className)}>
      {/* Source Panel */}
      <div className="flex-1 border-r">
        <TransferPanel
          title={sourceTitle}
          items={state.filteredSourceItems}
          groups={state.sourceGroups}
          searchable={searchable}
          searchValue={state.sourceSearch}
          onSearchChange={state.setSourceSearch}
          searchPlaceholder={searchPlaceholder}
          onItemClick={handleSelect}
          onSelectAll={handleSelectAll}
          enableSelectAll={enableSelectAll}
          disabled={disabled}
          panelType="source"
        />
      </div>

      {/* Target Panel */}
      <div className="flex-1">
        <TransferPanel
          title={targetTitle}
          items={state.targetItems}
          groups={state.targetGroups}
          searchable={false}
          searchValue=""
          onSearchChange={() => {}}
          onItemClick={handleDeselect}
          onSelectAll={handleClearAll}
          enableSelectAll={enableSelectAll}
          disabled={disabled}
          panelType="target"
        />
      </div>
    </div>
  )
}

Transfer.displayName = 'Transfer'
