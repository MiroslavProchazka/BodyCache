import { describe, it, expect } from 'vitest'
import { RPE_VALUES, RPE_MIN, RPE_MAX, clampRpe, formatRpe } from './rpe'

describe('RPE_VALUES', () => {
  it('is the integers 1–10 in order', () => {
    expect(RPE_VALUES).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(RPE_VALUES[0]).toBe(RPE_MIN)
    expect(RPE_VALUES[RPE_VALUES.length - 1]).toBe(RPE_MAX)
  })
})

describe('clampRpe', () => {
  it('passes through valid values', () => {
    expect(clampRpe(1)).toBe(1)
    expect(clampRpe(8)).toBe(8)
    expect(clampRpe(10)).toBe(10)
  })

  it('clamps out-of-range numbers to the nearest bound', () => {
    expect(clampRpe(0)).toBe(RPE_MIN)
    expect(clampRpe(-3)).toBe(RPE_MIN)
    expect(clampRpe(11)).toBe(RPE_MAX)
    expect(clampRpe(100)).toBe(RPE_MAX)
  })

  it('rounds fractional values', () => {
    expect(clampRpe(7.4)).toBe(7)
    expect(clampRpe(7.5)).toBe(8)
  })

  it('treats null, undefined and non-finite as unset', () => {
    expect(clampRpe(null)).toBeNull()
    expect(clampRpe(undefined)).toBeNull()
    expect(clampRpe(NaN)).toBeNull()
    expect(clampRpe(Infinity)).toBeNull()
  })
})

describe('formatRpe', () => {
  it('labels an unset value', () => {
    expect(formatRpe(null)).toBe('RPE')
    expect(formatRpe(undefined)).toBe('RPE')
  })

  it('labels a set value', () => {
    expect(formatRpe(8)).toBe('RPE 8')
    expect(formatRpe(10)).toBe('RPE 10')
  })
})
