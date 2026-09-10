export const LOGS_DETAIL_MIN_WIDTH = 400

export function clampLogsDetailWidth(width: number, maxWidth: number): number {
  const max = maxWidth > LOGS_DETAIL_MIN_WIDTH ? maxWidth : LOGS_DETAIL_MIN_WIDTH
  return Math.min(Math.max(Math.round(width), LOGS_DETAIL_MIN_WIDTH), max)
}

export function logsDetailMaxWidth(node: HTMLElement | null): number {
  const parentWidth = node?.offsetParent instanceof HTMLElement
    ? node.offsetParent.clientWidth
    : 0
  if (parentWidth > LOGS_DETAIL_MIN_WIDTH)
    return parentWidth
  return typeof window === 'undefined' ? LOGS_DETAIL_MIN_WIDTH : window.innerWidth
}
