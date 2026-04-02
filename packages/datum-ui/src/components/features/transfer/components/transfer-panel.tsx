import type { TransferItem as TransferItemType } from '../types'
import * as React from 'react'
import { Button } from '../../../base/button'
import { TransferGroup } from './transfer-group'
import { TransferItem } from './transfer-item'
import { TransferSearch } from './transfer-search'

export interface TransferPanelProps {
  title: string
  items: TransferItemType[]
  groups: string[]
  searchable: boolean
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onItemClick: (key: string) => void
  onSelectAll: () => void
  enableSelectAll: boolean
  disabled?: boolean
  panelType: 'source' | 'target'
}

export const TransferPanel: React.FC<TransferPanelProps> = ({
  title,
  items,
  groups,
  searchable,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onItemClick,
  onSelectAll,
  enableSelectAll,
  disabled = false,
  panelType,
}) => {
  // Group items
  const groupedItems = React.useMemo(() => {
    if (groups.length === 0) {
      return { '': items }
    }

    const grouped: Record<string, TransferItemType[]> = {}
    groups.forEach((group) => {
      grouped[group] = items.filter(item => item.group === group)
    })

    return grouped
  }, [items, groups])

  const renderItems = (groupItems: TransferItemType[]) => {
    return groupItems.map(item => (
      <TransferItem
        key={item.key}
        itemKey={item.key}
        label={item.label}
        onClick={() => onItemClick(item.key)}
        disabled={disabled}
        panelType={panelType}
      />
    ))
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b p-3">
        <div className="flex min-h-[2.25rem] items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {title}
            {' '}
            (
            {items.length}
            )
          </span>
          {enableSelectAll && items.length > 0 && (
            <Button
              htmlType="button"
              type="quaternary"
              theme="borderless"
              size="small"
              onClick={onSelectAll}
              disabled={disabled}
            >
              {panelType === 'source' ? 'Select All' : 'Clear All'}
            </Button>
          )}
        </div>

        {/* Search */}
        {searchable && (
          <TransferSearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            disabled={disabled}
          />
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-2">
        {items.length === 0
          ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                {panelType === 'source' ? 'No items' : 'No items selected'}
              </div>
            )
          : groups.length === 0
            ? (
                <div className="space-y-1">
                  {renderItems(items)}
                </div>
              )
            : (
                Object.entries(groupedItems).map(([group, groupItems]) =>
                  groupItems.length > 0 && (
                    <TransferGroup key={group} title={group}>
                      {renderItems(groupItems)}
                    </TransferGroup>
                  ),
                )
              )}
      </div>
    </div>
  )
}
