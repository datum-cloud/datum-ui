type HapticsModule = typeof import('expo-haptics')

let haptics: HapticsModule | null | undefined

/** expo-haptics is an optional peer: load it lazily and tolerate its absence. */
function loadHaptics(): HapticsModule | null {
  if (haptics !== undefined)
    return haptics
  try {
    // Metro treats a require() inside try/catch as an optional dependency.
    haptics = require('expo-haptics') as HapticsModule
  }
  catch {
    haptics = null
  }
  return haptics
}

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid'

/** Fire an impact haptic if expo-haptics is installed; otherwise do nothing. */
export function impactHaptic(style: HapticStyle = 'light'): void {
  const h = loadHaptics()
  if (!h)
    return
  const map = {
    light: h.ImpactFeedbackStyle.Light,
    medium: h.ImpactFeedbackStyle.Medium,
    heavy: h.ImpactFeedbackStyle.Heavy,
    soft: h.ImpactFeedbackStyle.Soft,
    rigid: h.ImpactFeedbackStyle.Rigid,
  }
  h.impactAsync(map[style]).catch(() => {})
}
