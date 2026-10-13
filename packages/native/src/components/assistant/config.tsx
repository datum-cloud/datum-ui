import type { AssistantConfig, LinkRenderProps } from '@datum-cloud/datum-ui-assistant-core'
import type { ReactNode } from 'react'
import { DEFAULT_ASSISTANT_CONFIG } from '@datum-cloud/datum-ui-assistant-core'
import { createContext, use, useMemo } from 'react'
import { Linking } from 'react-native'

/**
 * The React Native assistant config: the shared {@link AssistantConfig} with
 * React nodes, plus `onLinkPress`, which is how a native host routes a link
 * in an answer (in-app screen vs. browser). `renderLink` stays available for
 * hosts that want to draw links themselves.
 */
export interface NativeAssistantConfig extends Omit<AssistantConfig<ReactNode>, 'renderLink'> {
  renderLink?: (props: LinkRenderProps<ReactNode>) => ReactNode
  /** Called when a link in an answer is tapped. Defaults to opening it with `Linking`. */
  onLinkPress: (href: string) => void
}

export function defaultOnLinkPress(href: string): void {
  Linking.openURL(href).catch(() => {})
}

export const DEFAULT_NATIVE_ASSISTANT_CONFIG: NativeAssistantConfig = {
  ...DEFAULT_ASSISTANT_CONFIG,
  onLinkPress: defaultOnLinkPress,
}

const AssistantConfigContext = createContext<NativeAssistantConfig>(DEFAULT_NATIVE_ASSISTANT_CONFIG)

export interface AssistantConfigProviderProps {
  config?: Partial<NativeAssistantConfig>
  children?: ReactNode
}

/** Supplies host config (suggestions, tool labels, link routing) to the assistant components. */
export function AssistantConfigProvider({ config, children }: AssistantConfigProviderProps) {
  const value = useMemo(
    () => (config ? { ...DEFAULT_NATIVE_ASSISTANT_CONFIG, ...config } : DEFAULT_NATIVE_ASSISTANT_CONFIG),
    [config],
  )
  return <AssistantConfigContext value={value}>{children}</AssistantConfigContext>
}

export function useAssistantConfig(): NativeAssistantConfig {
  return use(AssistantConfigContext)
}
