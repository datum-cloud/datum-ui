import type { ReactNode } from 'react'
import type { DropEvent, DropzoneOptions, FileRejection } from 'react-dropzone'
import { Button } from '@repo/shadcn/ui/button'
import { UploadIcon } from 'lucide-react'
import { createContext, use } from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '../../../utils/cn'
import { Icon } from '../../icons/icon-wrapper'

interface DropzoneContextType {
  src?: File[]
  accept?: DropzoneOptions['accept']
  maxSize?: DropzoneOptions['maxSize']
  minSize?: DropzoneOptions['minSize']
  maxFiles?: DropzoneOptions['maxFiles']
}

function renderBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)}${units[unitIndex]}`
}

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined)

export type DropzoneProps = Omit<DropzoneOptions, 'onDrop'> & {
  src?: File[]
  className?: string
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void
  children?: ReactNode
}

export function Dropzone({
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  onDrop,
  onError,
  disabled,
  src,
  className,
  children,
  ...props
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onError,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      // Surface the first rejection (if any) without discarding accepted files:
      // a mixed drop should still deliver the valid files to the consumer.
      if (fileRejections.length > 0) {
        const message = fileRejections.at(0)?.errors.at(0)?.message
        onError?.(new Error(message))
      }

      onDrop?.(acceptedFiles, fileRejections, event)
    },
    ...props,
  })

  return (
    <DropzoneContext
      key={JSON.stringify(src)}
      value={{ src, accept, maxSize, minSize, maxFiles }}
    >
      <Button
        className={cn(
          'relative h-auto w-full flex-col overflow-hidden rounded-lg border border-dashed border-[#90969C99] bg-transparent p-9 text-base',
          isDragActive && 'ring-ring ring-1 outline-none',
          className,
        )}
        disabled={disabled}
        type="button"
        variant="outline"
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={disabled} />
        {children}
      </Button>
    </DropzoneContext>
  )
}

function useDropzoneContext() {
  const context = use(DropzoneContext)

  if (!context) {
    throw new Error('useDropzoneContext must be used within a Dropzone')
  }

  return context
}

export interface DropzoneContentProps {
  children?: ReactNode
  className?: string
  icon?: ReactNode
  label?: ReactNode | ((files: File[]) => ReactNode)
  description?: ReactNode
}

const maxLabelItems = 3

function defaultContentLabel(files: File[]) {
  if (files.length > maxLabelItems) {
    return `${new Intl.ListFormat('en').format(
      files.slice(0, maxLabelItems).map(file => file.name),
    )} and ${files.length - maxLabelItems} more`
  }
  return new Intl.ListFormat('en').format(files.map(file => file.name))
}

export function DropzoneContent({
  children,
  className,
  icon,
  label,
  description,
}: DropzoneContentProps) {
  const { src } = useDropzoneContext()

  // Treat an empty array as "no files": the empty state should show instead.
  if (!src || src.length === 0) {
    return null
  }

  if (children) {
    return children
  }

  const renderedLabel = typeof label === 'function' ? label(src) : label

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {icon ?? <Icon icon={UploadIcon} size={36} className="text-primary" />}
      <div className="my-2 w-full truncate text-sm font-medium text-wrap">
        {renderedLabel ?? defaultContentLabel(src)}
      </div>
      <div className="text-muted-foreground w-full text-xs text-wrap">
        {description ?? 'Drag and drop or click to replace'}
      </div>
    </div>
  )
}

export interface DropzoneEmptyStateProps {
  children?: ReactNode
  className?: string
  icon?: ReactNode
  label?: ReactNode
  description?: ReactNode
  /** Set to false to hide the auto-generated caption (accepts, size limits) */
  showCaption?: boolean
}

export function DropzoneEmptyState({
  children,
  className,
  icon,
  label,
  description,
  showCaption = false,
}: DropzoneEmptyStateProps) {
  const { src, accept, maxSize, minSize } = useDropzoneContext()

  // Treat an empty array as "no files": the empty state should still show.
  if (src && src.length > 0) {
    return null
  }

  if (children) {
    return children
  }

  let caption = ''

  if (showCaption) {
    let sizeClause = ''
    if (minSize && maxSize) {
      sizeClause = `between ${renderBytes(minSize)} and ${renderBytes(maxSize)}`
    }
    else if (minSize) {
      sizeClause = `at least ${renderBytes(minSize)}`
    }
    else if (maxSize) {
      sizeClause = `less than ${renderBytes(maxSize)}`
    }

    if (accept) {
      caption = `Accepts ${new Intl.ListFormat('en').format(Object.keys(accept))}`
      if (sizeClause) {
        caption += ` ${sizeClause}`
      }
    }
    else if (sizeClause) {
      // No accepted-types prefix: give the size clause a grammatical subject.
      caption = `File size must be ${sizeClause}`
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {icon ?? <Icon icon={UploadIcon} size={36} className="text-primary size-9 text-4xl" />}
      {label && <p className="my-2 w-full truncate text-sm font-medium text-wrap">{label}</p>}
      {description && (
        <div className="text-muted-foreground w-full truncate text-xs text-wrap">{description}</div>
      )}
      {caption && (
        <p className="text-muted-foreground text-xs text-wrap">
          {caption}
          .
        </p>
      )}
    </div>
  )
}
