import { X } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../../utils/cn'

export interface TransferItemProps {
  itemKey: string
  label: string
  onClick: () => void
  disabled?: boolean
  panelType: 'source' | 'target'
}

export const TransferItem: React.FC<TransferItemProps> = ({
  label,
  onClick,
  disabled = false,
  panelType,
}) => {
  return (
    <div
      className={cn(
        'group flex items-center gap-2 rounded p-2',
        'hover:bg-accent transition-colors',
        panelType === 'source' && 'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
      role={panelType === 'source' && !disabled ? 'button' : undefined}
      tabIndex={panelType === 'source' && !disabled ? 0 : undefined}
      onClick={panelType === 'source' && !disabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!disabled && panelType === 'source' && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{label}</div>
      </div>

      {panelType === 'target' && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          className="h-6 w-6 p-0 rounded opacity-0 group-hover:opacity-100 hover:bg-muted transition-opacity inline-flex items-center justify-center"
          onClick={onClick}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
