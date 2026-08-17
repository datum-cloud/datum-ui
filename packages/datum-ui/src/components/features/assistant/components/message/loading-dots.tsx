import { cn } from '../../../../../utils/cn'

/** Three bouncing dots — the assistant's "thinking" indicator. */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex gap-1', className)}>
      <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]" />
      <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]" />
      <span className="bg-muted-foreground/50 h-1.5 w-1.5 animate-bounce rounded-full" />
    </div>
  )
}
