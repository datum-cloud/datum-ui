import type { Toast } from './types'
import { useEffect } from 'react'
/**
 * Sonner is a toast library for React.
 * Implementation based on github.com/epicweb-dev/epic-stack
 */
import { toast } from './toast'

export function useToast(toastData?: Toast | null) {
  useEffect(() => {
    if (!toastData) {
      return
    }

    // `toastData` is typically deserialized server/cookie data, so `type` may be
    // anything at runtime. Guard the dynamic dispatch instead of throwing inside
    // the timer for an unexpected variant.
    const showToast = toast[toastData.type]
    if (typeof showToast !== 'function') {
      console.error(`useToast: unknown toast type "${toastData.type}"`)
      return
    }

    const timer = setTimeout(() => {
      showToast(toastData.title ?? toastData.description ?? '', {
        id: toastData.id,
        description: toastData.title ? toastData.description : undefined,
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [toastData])
}
