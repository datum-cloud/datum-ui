import { Button } from '@repo/shadcn/ui/button'
import { cn } from '../../../../utils/cn'
import { usePickerContext } from './context'

interface PickerPresetsProps {
  className?: string
}

export function PickerPresets({ className }: PickerPresetsProps) {
  const { presets, state, actions, timezone } = usePickerContext()

  if (presets.length === 0)
    return null

  return (
    <div className={cn('border-border hidden flex-col gap-1 border-r p-2 md:flex', className)}>
      {presets.map((preset) => {
        const isSelected = state.selectedPresetKey === preset.key
        return (
          <Button
            key={preset.key}
            type="button"
            variant={isSelected ? 'default' : 'ghost'}
            size="sm"
            className="justify-start font-normal"
            onClick={() => {
              const range = preset.getRange(timezone)
              actions.selectPreset(range, preset.key)
            }}
          >
            <span>{preset.label}</span>
            {preset.shortcut && (
              <kbd className="bg-muted ml-auto hidden rounded border px-1.5 font-mono text-[10px] sm:inline-flex">
                {preset.shortcut}
              </kbd>
            )}
          </Button>
        )
      })}
    </div>
  )
}

PickerPresets.displayName = 'Picker.Presets'
