import { describe, expect, it } from 'vitest'
import { clampLogsDetailWidth, LOGS_DETAIL_MIN_WIDTH } from '../utils/detail-width'

describe('clampLogsDetailWidth', () => {
  it('does not shrink below the default panel width', () => {
    expect(clampLogsDetailWidth(320, 1200)).toBe(LOGS_DETAIL_MIN_WIDTH)
  })

  it('allows growing up to the parent width', () => {
    expect(clampLogsDetailWidth(640, 1200)).toBe(640)
    expect(clampLogsDetailWidth(2000, 1200)).toBe(1200)
  })
})
