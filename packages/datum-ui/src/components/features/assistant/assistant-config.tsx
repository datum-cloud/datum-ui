'use client'

import type { ReactNode } from 'react'
import type { AssistantConfig, LinkRenderProps } from './types'
import { createContext, useContext } from 'react'

/**
 * Framework-agnostic link renderer: internal routes (`/…`) render as a plain
 * same-tab anchor, everything else opens in a new tab. Hosts override
 * `renderLink` to add routing (e.g. a router `<Link>`) or icons (e.g. a Sentry
 * glyph) — see the host config.
 */
export function defaultRenderLink({ href, children }: LinkRenderProps): ReactNode {
  if (href?.startsWith('/')) {
    return (
      <a href={href} className="underline">
        {children}
      </a>
    )
  }
  return (
    <a href={href} className="underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

/**
 * Neutral fallback so leaf components render without a host having wired a full
 * config. Host apps override via `<AssistantConfigProvider config={…}>`.
 */
export const DEFAULT_ASSISTANT_CONFIG: AssistantConfig = {
  greeting: name => `Hey there${name ? `, ${name}` : ''}`,
  suggestions: [],
  showReasoning: true,
  modelSelector: false,
  toolLabels: {},
  renderLink: defaultRenderLink,
}

const AssistantConfigContext = createContext<AssistantConfig>(DEFAULT_ASSISTANT_CONFIG)

export function AssistantConfigProvider({
  config,
  children,
}: {
  config?: Partial<AssistantConfig>
  children: ReactNode
}) {
  const value = config ? { ...DEFAULT_ASSISTANT_CONFIG, ...config } : DEFAULT_ASSISTANT_CONFIG
  return (
    <AssistantConfigContext.Provider value={value}>{children}</AssistantConfigContext.Provider>
  )
}

export function useAssistantConfig(): AssistantConfig {
  return useContext(AssistantConfigContext)
}
