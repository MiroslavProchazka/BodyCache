import { describe, expect, it } from 'vitest'
import {
  dayKey,
  isSameDay,
  formatShortDate,
  monthKey,
  formatMonth,
  formatRelativeDay,
} from './dates'

// Construct dates via local-time components so the assertions are
// timezone-independent (the helpers read getFullYear/getMonth/getDate).

describe('dayKey', () => {
  it('formats a local YYYY-MM-DD key, zero-padded', () => {
    expect(dayKey(new Date(2026, 5, 12))).toBe('2026-06-12') // June = month index 5
    expect(dayKey(new Date(2026, 0, 3))).toBe('2026-01-03')
  })
})

describe('isSameDay', () => {
  it('is true within a day regardless of time, false across days', () => {
    expect(isSameDay(new Date(2026, 5, 12, 6), new Date(2026, 5, 12, 23))).toBe(true)
    expect(isSameDay(new Date(2026, 5, 12), new Date(2026, 5, 13))).toBe(false)
  })
})

describe('monthKey', () => {
  it('formats a local YYYY-MM key', () => {
    expect(monthKey(new Date(2026, 5, 12))).toBe('2026-06')
    expect(monthKey(new Date(2025, 11, 31))).toBe('2025-12')
  })
})

describe('formatMonth', () => {
  const june = new Date(2026, 5, 1)

  it('omits the year within the current year', () => {
    expect(formatMonth(june, new Date(2026, 0, 1))).not.toMatch(/\d{4}/)
  })

  it('includes the year for a different year', () => {
    expect(formatMonth(june, new Date(2027, 0, 1))).toMatch(/2026/)
  })
})

describe('formatRelativeDay', () => {
  it('labels today and yesterday', () => {
    expect(formatRelativeDay(new Date())).toBe('Today')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    expect(formatRelativeDay(yesterday)).toBe('Yesterday')
  })

  it('falls back to the short date for older days', () => {
    const old = new Date()
    old.setDate(old.getDate() - 8)
    const label = formatRelativeDay(old)
    expect(label).not.toBe('Today')
    expect(label).not.toBe('Yesterday')
    expect(label).toBe(formatShortDate(old))
  })
})
