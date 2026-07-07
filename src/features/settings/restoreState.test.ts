import { describe, expect, it } from 'vitest'
import { isRestoreFlagActive, RESTORE_BANNER_MAX_AGE_MS } from './restoreState'

describe('isRestoreFlagActive', () => {
  const now = 1_000_000_000_000

  it('is inactive with no stamp', () => {
    expect(isRestoreFlagActive(null, now)).toBe(false)
  })

  it('is inactive for a non-finite stamp', () => {
    expect(isRestoreFlagActive(Number.NaN, now)).toBe(false)
  })

  it('is active immediately after a restore', () => {
    expect(isRestoreFlagActive(now, now)).toBe(true)
  })

  it('is active within the window', () => {
    expect(isRestoreFlagActive(now - RESTORE_BANNER_MAX_AGE_MS + 1, now)).toBe(true)
  })

  it('expires at the window edge', () => {
    expect(isRestoreFlagActive(now - RESTORE_BANNER_MAX_AGE_MS - 1, now)).toBe(false)
  })

  it('ignores a stamp from the future (clock skew)', () => {
    expect(isRestoreFlagActive(now + 5_000, now)).toBe(false)
  })
})
