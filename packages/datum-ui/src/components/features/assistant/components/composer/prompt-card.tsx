'use client'

import type { Editor } from '@tiptap/react'
import type { EffortId } from '../../types'
import { EditorContent } from '@tiptap/react'
import { ArrowUp, Mic, MicOff, RotateCw, Square } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../../../../utils/cn'
import { Tooltip } from '../../../../base/tooltip'
import { useAssistantConfig } from '../../assistant-config'
import { Equalizer } from './equalizer'
import { ModelSelector } from './model-selector'

interface PromptCardProps {
  editor: Editor | null
  isReady: boolean
  canRetry: boolean
  onSend: () => void
  onStop: () => void
  onRetry: () => void
  modelId: string
  effortId: EffortId
  onModelChange: (id: string) => void
  onEffortChange: (id: EffortId) => void
  speechSupported?: boolean
  isListening?: boolean
  frequencyData?: number[]
  onMicToggle?: () => void
  className?: string
}

export function PromptCard({
  editor,
  isReady,
  canRetry,
  onSend,
  onStop,
  onRetry,
  modelId,
  effortId,
  onModelChange,
  onEffortChange,
  speechSupported,
  isListening,
  frequencyData,
  onMicToggle,
  className,
}: PromptCardProps) {
  const { modelSelector } = useAssistantConfig()

  return (
    <div
      className={cn(
        'bg-card border-primary/30 rounded-2xl border p-3 shadow-sm transition-shadow',
        className,
      )}
    >
      <EditorContent editor={editor} className="max-h-52 min-h-9 overflow-y-auto px-1 py-1" />

      <div className="mt-1 flex items-center justify-end gap-2">
        <div className="flex items-center gap-1">
          {modelSelector && (
            <ModelSelector
              modelId={modelId}
              effortId={effortId}
              onModelChange={onModelChange}
              onEffortChange={onEffortChange}
            />
          )}

          {speechSupported && (
            <Tooltip message={isListening ? 'Stop dictating' : 'Dictate'} side="top">
              <button
                type="button"
                onClick={onMicToggle}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                className={cn(
                  'hover:bg-accent shrink-0 rounded-full p-1.5 transition-colors',
                  isListening
                    ? 'text-destructive hover:text-destructive/80'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {isListening
                  ? (
                      frequencyData
                        ? (
                            <Equalizer frequencyData={frequencyData} />
                          )
                        : (
                            <MicOff className="size-4" />
                          )
                    )
                  : (
                      <Mic className="size-4" />
                    )}
              </button>
            </Tooltip>
          )}

          <AnimatePresence>
            {canRetry && (
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Tooltip message="Retry last message" side="top">
                  <button
                    type="button"
                    onClick={onRetry}
                    aria-label="Retry last message"
                    className="text-muted-foreground hover:text-foreground hover:bg-accent shrink-0 rounded-full p-1.5 transition-colors"
                  >
                    <RotateCw className="size-4" />
                  </button>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          {isReady
            ? (
                <Tooltip message="Send message" side="top">
                  <button
                    type="button"
                    onClick={onSend}
                    aria-label="Send message"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full p-1.5 transition-colors"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                </Tooltip>
              )
            : (
                <Tooltip message="Stop generating" side="top">
                  <button
                    type="button"
                    onClick={onStop}
                    aria-label="Stop generating"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full p-1.5 transition-colors"
                  >
                    <Square className="size-4 fill-current" />
                  </button>
                </Tooltip>
              )}
        </div>
      </div>
    </div>
  )
}
