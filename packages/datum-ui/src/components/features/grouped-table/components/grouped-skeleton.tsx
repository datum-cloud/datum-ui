import { Skeleton } from '../../../base/skeleton'

export interface GroupedSkeletonProps {
  columns?: number
  groups?: number
  rowsPerGroup?: number
}

export function GroupedSkeleton({ columns = 4, groups = 2, rowsPerGroup = 3 }: GroupedSkeletonProps) {
  return (
    <div data-slot="gt-skeleton">
      {Array.from({ length: groups }, (_, g) => (
        <div key={g}>
          <div
            data-slot="gt-skeleton-band"
            className="flex items-center gap-2 bg-muted/40 px-3 py-2 [&:not(:first-child)]:border-t"
          >
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
          {Array.from({ length: rowsPerGroup }, (_, r) => (
            <div
              key={r}
              data-slot="gt-skeleton-row"
              className="flex items-center gap-3 px-3 py-2 [&:not(:last-child)]:border-b"
            >
              {Array.from({ length: columns }, (_, c) => (
                <Skeleton key={c} className="h-4 w-full" />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
