import type { MultiSelectOption, MultiSelectVariant } from './multi-select-shared'
import { CheckIcon, ChevronDown, WandSparkles } from 'lucide-react'
import * as React from 'react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../base/hooks'
import { useOptionPicker } from '../../base/option-picker'
import { ResponsivePopover } from '../../base/responsive-popover'
import { Separator } from '../../base/separator'
import { LoaderOverlay } from '../loader-overlay'
import { MultiSelectOptions } from './multi-select-options'
import { SelectedBadgeList } from './selected-badge-list'

export type { MultiSelectOption } from './multi-select-shared'

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: MultiSelectOption[]

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void

  /** Visual variant applied to the selected-value badges. */
  variant?: MultiSelectVariant

  /** The default selected values when the component mounts. */
  defaultValue?: string[]

  /** The controlled selected values. When provided, component becomes controlled. */
  value?: string[]

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Set to -1 for unlimited items.
   * Optional, defaults to 3.
   */
  maxCount?: number | -1

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string

  /**
   * Additional class names to apply custom styles to the box container.
   * Optional, can be used to add custom styles to the box wrapper.
   */
  boxClassName?: string

  /**
   * Custom actions to be displayed in the multi-select popover.
   * Each action should have a label and an onClick handler.
   * Optional array of custom actions.
   */
  actions?: Array<{
    /** The label text to display for the action */
    label: string
    /** Click handler for the action */
    onClick: () => void
    /** Optional icon component to display alongside the action */
    icon?: React.ComponentType<{ className?: string }>
    /** Optional class name for custom styling */
    className?: string
  }>

  /**
   * Callback function triggered when a selected badge is clicked.
   * Receives the value of the clicked badge as a parameter.
   * Optional, can be used to handle badge click interactions.
   */
  onBadgeClick?: (option: MultiSelectOption) => void

  badgeClassName?: string

  /**
   * Determines if badges should be clickable.
   * When true, badges will have hover and click interactions.
   * Optional, defaults to false.
   */
  clickableBadges?: boolean

  /**
   * Controls the visibility of the close (X) button in the popover.
   * When false, the close button will be hidden.
   * Optional, defaults to true.
   */
  showCloseButton?: boolean

  /**
   * Determines if the clear button should be shown in the popover.
   * When false, the clear button will be hidden.
   * Optional, defaults to true.
   */
  showClearButton?: boolean

  /**
   * Controls whether to show the "Select All" option in the popover.
   * When true, a "Select All" option will be displayed at the top of the options list.
   * Optional, defaults to false.
   */
  showSelectAll?: boolean

  /**
   * Controls whether the component is loading.
   * When true, the component will show a loading indicator.
   * Optional, defaults to false.
   */
  isLoading?: boolean

  /**
   * The content to display when no options are found.
   * Optional, defaults to "No options found.".
   */
  emptyContent?: string

  /**
   * Whether to use responsive mode (mobile sheet on small screens).
   * Optional, defaults to true.
   */
  responsive?: boolean

  /**
   * Title shown in the mobile sheet header.
   * Optional, defaults to placeholder ?? 'Select options'.
   */
  sheetTitle?: string
}

const EMPTY_ARRAY: string[] = []

export function MultiSelect({
  options,
  onValueChange,
  variant,
  defaultValue = EMPTY_ARRAY,
  value,
  placeholder = 'Select options',
  animation = 0,
  maxCount = 3,
  modalPopover = false,
  className,
  boxClassName,
  actions,
  onBadgeClick,
  badgeClassName,
  clickableBadges = false,
  showCloseButton = true,
  showClearButton = true,
  showSelectAll = false,
  disabled = false,
  id,
  name,
  isLoading = false,
  emptyContent = 'No results found.',
  responsive = true,
  sheetTitle,
  asChild: _asChild,
  onClick: onTriggerClick,
  ...rest
}: MultiSelectProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [isAnimating, setIsAnimating] = React.useState(false)

  // Single source of truth for the selection. Uncontrolled by default; the
  // `value` prop takes over when provided. The option-picker engine is driven
  // as a *controlled* view of this state, so there is exactly one owner and
  // Select-All / clear / "+N more" can never desync from the list checkmarks.
  const [selectedValues, setSelectedValues] = useControllableState<string[]>(
    value,
    defaultValue,
    onValueChange,
  )

  const picker = useOptionPicker({
    multiple: true,
    options,
    value: selectedValues,
    onValueChange: setSelectedValues,
    open: isPopoverOpen,
    onOpenChange: setIsPopoverOpen,
  })

  const selection = picker.selection
  const selectedOptions = picker.selectedOptions
  const hasSelection = selection.length > 0

  const handleClear = () => setSelectedValues(EMPTY_ARRAY)

  const clearExtraOptions = () => {
    setSelectedValues(prev => (maxCount === -1 ? prev : prev.slice(0, maxCount)))
  }

  const allSelected = options.length > 0 && selection.length === options.length

  const toggleAll = () => {
    if (allSelected)
      setSelectedValues(EMPTY_ARRAY)
    else
      setSelectedValues(options.map(o => o.value))
  }

  // ---- Slots ----

  const header = showSelectAll
    ? (
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm"
          onClick={toggleAll}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ')
              toggleAll()
          }}
        >
          <div
            className={cn(
              'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
              allSelected
                ? 'bg-primary text-primary-foreground'
                : 'opacity-50 [&_svg]:invisible',
            )}
          >
            <CheckIcon className="size-4" />
          </div>
          <span>(Select All)</span>
        </div>
      )
    : undefined

  const showFooter
    = (showClearButton && hasSelection)
      || showCloseButton
      || (actions && actions.length > 0)

  const footer = showFooter
    ? (
        <>
          <Separator />
          <div className="flex items-center justify-between px-1 py-1">
            {actions && actions.length > 0 && (
              <div className="flex items-center gap-1">
                {actions.map(action => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      'flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-sm',
                      action.className,
                    )}
                  >
                    {action.icon && <action.icon className="text-muted-foreground mr-1 size-4" />}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-1 items-center justify-between">
              {showClearButton && hasSelection && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 cursor-pointer rounded px-2 py-1 text-sm"
                >
                  Clear
                </button>
              )}
              {showClearButton && hasSelection && showCloseButton && (
                <Separator orientation="vertical" className="flex h-full min-h-6" />
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={() => setIsPopoverOpen(false)}
                  className="max-w-full flex-1 cursor-pointer rounded px-2 py-1 text-sm"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </>
      )
    : undefined

  // ---- Trigger ----

  const triggerJSX = (
    <button
      {...rest}
      type="button"
      disabled={disabled || isLoading}
      data-slot="multi-select-trigger"
      onClick={(event) => {
        onTriggerClick?.(event)
        setIsPopoverOpen(prev => !prev)
      }}
      className={cn(
        'text-input-foreground placeholder:text-input-placeholder',
        'border-input-border bg-input-background/50 relative flex min-h-10 w-full items-center justify-between rounded-lg border px-2 py-1 text-left text-sm transition-all',
        'focus-visible:border-input-focus-border focus-visible:shadow-(--input-focus-shadow)',
        'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-hidden',
        (disabled || isLoading) && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      {hasSelection && !isLoading && options.length > 0
        ? (
            <SelectedBadgeList
              selectedOptions={selectedOptions}
              maxCount={maxCount}
              variant={variant}
              badgeClassName={badgeClassName}
              clickableBadges={clickableBadges}
              isAnimating={isAnimating}
              animation={animation}
              onRemove={picker.toggle}
              onClearExtra={clearExtraOptions}
              onClearAll={handleClear}
              onBadgeClick={onBadgeClick}
            />
          )
        : (
            <div className="flex w-full items-center justify-between px-2">
              <span className="text-muted-foreground text-sm">{placeholder}</span>
              <ChevronDown className="text-muted-foreground mx-1 h-4" aria-hidden="true" />
            </div>
          )}

      {isLoading && <LoaderOverlay className="rounded-lg" />}
    </button>
  )

  return (
    <>
      <ResponsivePopover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        responsive={responsive}
        sheetTitle={sheetTitle ?? placeholder ?? 'Select options'}
        trigger={triggerJSX}
        align="start"
        contentClassName={cn('popover-content-width-full min-w-[300px] p-0', boxClassName)}
        modal={modalPopover}
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <MultiSelectOptions
          picker={picker}
          searchPlaceholder={`Search ${(placeholder ?? 'options').toLowerCase()}...`}
          emptyContent={emptyContent}
          header={header}
          footer={footer}
          loading={isLoading}
          responsive={responsive}
        />
      </ResponsivePopover>
      {animation > 0 && hasSelection && (
        <WandSparkles
          className={cn(
            'bg-background text-foreground my-2 h-3 w-3 cursor-pointer',
            isAnimating ? '' : 'text-muted-foreground',
          )}
          onClick={() => setIsAnimating(!isAnimating)}
        />
      )}
      {/* Hidden input for form submission. Kept out of the tab order and hidden
          from assistive tech — it exists solely to carry values on submit. */}
      <select
        name={name}
        id={id}
        multiple
        value={selection}
        defaultValue={undefined}
        className="absolute top-0 left-0 h-0 w-0"
        tabIndex={-1}
        aria-hidden="true"
        onChange={() => undefined}
      >
        <option value=""></option>
        {options.map((option, idx) => (
          <option key={`${option.value}-${idx}`} value={option.value} />
        ))}
      </select>
    </>
  )
}

MultiSelect.displayName = 'MultiSelect'
