import { CheckIcon, CopyIcon } from 'lucide-react'
import * as React from 'react'
import { Button, toast } from '../../..'
import { useCopyToClipboard } from '../../../../hooks/use-copy-to-clipboard'
import { cn } from '../../../../utils/cn'
import { useFieldContext } from '../context/field-context'

export interface FormCopyBoxProps {
  /** Display variant: 'default' shows Copy button, 'icon-only' shows icon */
  variant?: 'default' | 'icon-only'
  /** Custom className for the wrapper */
  className?: string
  /** Custom className for the content area */
  contentClassName?: string
  /** Custom className for the button */
  buttonClassName?: string
  /** Placeholder text when value is empty */
  placeholder?: string
}

/**
 * Form.CopyBox - Read-only field with copy-to-clipboard functionality
 *
 * Displays field value in a read-only box with a copy button.
 * Automatically gets value from Form.Field context.
 *
 * @example Basic usage
 * ```tsx
 * <Form.Field name="organizationId" label="Organization ID">
 *   <Form.CopyBox />
 * </Form.Field>
 * ```
 *
 * @example With icon-only button
 * ```tsx
 * <Form.Field name="apiKey" label="API Key">
 *   <Form.CopyBox variant="icon-only" />
 * </Form.Field>
 * ```
 *
 * @example With placeholder
 * ```tsx
 * <Form.Field name="webhookUrl" label="Webhook URL">
 *   <Form.CopyBox placeholder="Not configured" />
 * </Form.Field>
 * ```
 */
export function FormCopyBox({
  variant = 'default',
  className,
  contentClassName,
  buttonClassName,
  placeholder = '',
}: FormCopyBoxProps) {
  const { fieldState } = useFieldContext()
  const [copied, copy] = useCopyToClipboard()

  // Get the reactive value from field state
  const value = fieldState?.value != null ? String(fieldState.value) : ''
  const displayValue = value || placeholder

  const copyToClipboard = () => {
    if (!value)
      return

    // `copy` resolves `false` (never rejects) when the Clipboard API is
    // unavailable or the write is denied — only surface success when it actually
    // succeeded, otherwise we'd show a green toast for a copy that never happened.
    void copy(value).then((didCopy) => {
      if (didCopy) {
        toast.success('Copied to clipboard')
      }
    })
  }

  return (
    <div
      className={cn(
        'group border-input flex h-10 w-full overflow-hidden rounded-lg border bg-[#F6F6F580] text-xs focus-within:outline-hidden',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-full items-center overflow-hidden px-3 py-2 text-xs opacity-50',
          contentClassName,
        )}
      >
        <span className="truncate">{displayValue}</span>
      </div>
      <div className="flex items-center py-2 pr-3">
        {variant === 'icon-only'
          ? (
              <button
                type="button"
                aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
                title={copied ? 'Copied' : 'Copy'}
                className={cn(
                  'text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-sm transition-colors',
                  buttonClassName,
                )}
                onClick={copyToClipboard}
              >
                {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
              </button>
            )
          : (
              <Button
                type="quaternary"
                theme="outline"
                size="small"
                className={cn('h-7 w-fit gap-1 px-2 text-xs', buttonClassName)}
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-3!" />
                {copied ? 'Copied' : 'Copy'}
              </Button>
            )}
      </div>
    </div>
  )
}

FormCopyBox.displayName = 'Form.CopyBox'
