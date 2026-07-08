import type { ReactNode } from 'react'
import type { UseOptionPickerReturn } from '../../base/option-picker'
import type { MultiSelectOption } from './multi-select-shared'
import { CheckIcon } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { OptionList } from '../../base/option-picker'

export interface MultiSelectOptionsProps {
  picker: UseOptionPickerReturn<MultiSelectOption>
  searchPlaceholder: string
  emptyContent: ReactNode
  header?: ReactNode
  footer?: ReactNode
  loading: boolean
  responsive: boolean
}

/**
 * Presentational popover command list for the multi-select: the searchable
 * option list with a checkbox affordance per row. Selection state and search
 * are owned by the `picker` engine.
 */
export function MultiSelectOptions({
  picker,
  searchPlaceholder,
  emptyContent,
  header,
  footer,
  loading,
  responsive,
}: MultiSelectOptionsProps) {
  return (
    <OptionList
      picker={picker}
      searchPlaceholder={searchPlaceholder}
      emptyContent={emptyContent}
      header={header}
      footer={footer}
      loading={loading}
      listClassName={cn(
        'min-h-[200px] max-h-[50svh]',
        !responsive && 'max-h-[250px]',
      )}
      renderOption={(opt, isSelected) => (
        <>
          <div
            className={cn(
              'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'opacity-50 [&_svg]:invisible',
            )}
          >
            <CheckIcon className="text-background size-4" />
          </div>
          {opt.icon && (
            <opt.icon className="text-muted-foreground mr-2 size-4" />
          )}
          <span>{opt.label}</span>
        </>
      )}
    />
  )
}

MultiSelectOptions.displayName = 'MultiSelectOptions'
