import { useCallback, useEffect, useRef, useState } from 'react'

interface CopyOptions {
  withToast?: boolean
  toastMessage?: string
}

type CopyFn = (text: string, options?: CopyOptions) => Promise<boolean>

export function useCopyToClipboard(): [boolean, CopyFn] {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const copy: CopyFn = useCallback(async (text, options) => {
    if (!navigator?.clipboard) {
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)

      if (options?.withToast) {
        // The clipboard write has already succeeded at this point, so the toast
        // is a best-effort side effect. Isolate it in its own try/catch: if the
        // lazily-imported sonner-based toast feature fails to load (optional
        // `sonner` peer absent) or `toast.success` throws, that must NOT undo
        // the successful copy by falling into the outer catch.
        try {
          const { toast } = await import('../components/features/toast')
          toast.success(options.toastMessage ?? 'Copied to clipboard')
        }
        catch (toastError) {
          console.warn('useCopyToClipboard: copy succeeded but toast failed', toastError)
        }
      }

      // Clear any in-flight reset so a rapid second copy keeps its indicator for
      // the full duration instead of being reset by the previous timer.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false)
      }, 2000)

      return true
    }
    catch {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsCopied(false)
      return false
    }
  }, [])

  return [isCopied, copy]
}
