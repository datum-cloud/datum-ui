'use client'

import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useAssistantConfig } from '../context'
import { BrainGlyph } from './brain-glyph'

interface EmptyStateProps {
  name?: string
  isReady: boolean
  onSuggestion: (text: string) => void
  /** The shared prompt card. */
  children: ReactNode
}

export function EmptyState({ name, isReady, onSuggestion, children }: EmptyStateProps) {
  const { greeting, suggestions } = useAssistantConfig()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <BrainGlyph className="mb-4 size-16" />
        <h1 className="text-foreground font-title text-3xl leading-[34px] font-normal tracking-[-1.2px]">
          {greeting(name)}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {children}
      </motion.div>

      <div className="mt-4 flex flex-col gap-1">
        {suggestions.map((suggestion, i) => (
          <motion.button
            key={suggestion}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 + 0.05 * i }}
            disabled={!isReady}
            onClick={() => onSuggestion(suggestion)}
            className="group bg-sidebar-accent text-foreground flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-[filter] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{suggestion}</span>
            <ArrowRight className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}
