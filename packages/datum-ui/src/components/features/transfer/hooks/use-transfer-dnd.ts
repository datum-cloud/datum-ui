import type { DragEndEvent } from '@dnd-kit/core'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

export interface UseTransferDndProps {
  /**
   * Current order of items (keys)
   */
  items: string[]

  /**
   * Called when items are reordered
   */
  onReorder: (items: string[]) => void

  /**
   * Disable drag and drop
   */
  disabled?: boolean
}

export interface UseTransferDndReturn {
  sensors: ReturnType<typeof useSensors>
  handleDragEnd: (event: DragEndEvent) => void
  DndContext: typeof DndContext
  SortableContext: typeof SortableContext
  verticalListSortingStrategy: typeof verticalListSortingStrategy
}

export function useTransferDnd({
  items,
  onReorder,
  disabled = false,
}: UseTransferDndProps): UseTransferDndReturn {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    if (disabled)
      return

    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(String(active.id))
      const newIndex = items.indexOf(String(over.id))

      const reordered = arrayMove(items, oldIndex, newIndex)
      onReorder(reordered)
    }
  }

  return {
    sensors,
    handleDragEnd,
    DndContext,
    SortableContext,
    verticalListSortingStrategy,
  }
}
