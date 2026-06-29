import { describe, expect, it } from 'vitest'
import { byOrderIndex, nextOrderIndex, planSetToSetInput, type PlanSetSource } from './planToSession'

const planSet = (over: Partial<PlanSetSource> = {}): PlanSetSource => ({
  orderIndex: 0,
  weightKg: null,
  reps: null,
  addedWeightKg: null,
  durationSec: null,
  distanceMeters: null,
  setType: null,
  ...over,
})

describe('planSetToSetInput', () => {
  it('copies target metrics and leaves the set incomplete', () => {
    const input = planSetToSetInput(planSet({ weightKg: 60, reps: 8 }), 2)
    expect(input).toMatchObject({
      orderIndex: 2,
      completedAt: null,
      weightKg: 60,
      reps: 8,
    })
  })

  it('renumbers the set with the passed order index, not the plan order', () => {
    const input = planSetToSetInput(planSet({ orderIndex: 9, reps: 5 }), 0)
    expect(input.orderIndex).toBe(0)
  })

  it('narrows a valid set type and drops an unknown one', () => {
    expect(planSetToSetInput(planSet({ setType: 'warmup' }), 0).setType).toBe('warmup')
    expect(planSetToSetInput(planSet({ setType: 'bogus' }), 0).setType).toBeNull()
  })

  it('preserves nulls for metrics the plan did not set', () => {
    const input = planSetToSetInput(planSet(), 0)
    expect(input.weightKg).toBeNull()
    expect(input.reps).toBeNull()
    expect(input.distanceMeters).toBeNull()
  })
})

describe('byOrderIndex', () => {
  it('sorts ascending and treats null as 0 without mutating the input', () => {
    const rows = [{ orderIndex: 2 }, { orderIndex: null }, { orderIndex: 1 }]
    const sorted = byOrderIndex(rows)
    expect(sorted.map((r) => r.orderIndex)).toEqual([null, 1, 2])
    // original array untouched
    expect(rows.map((r) => r.orderIndex)).toEqual([2, null, 1])
  })
})

describe('nextOrderIndex', () => {
  it('is 0 for an empty list', () => {
    expect(nextOrderIndex([])).toBe(0)
  })

  it('is one past the max, not the row count (survives a removed middle row)', () => {
    // Rows 0 and 2 remain after index 1 was removed; count (2) would collide
    // with the existing 2, so we must use max+1 = 3.
    expect(nextOrderIndex([{ orderIndex: 0 }, { orderIndex: 2 }])).toBe(3)
  })

  it('treats null order as 0', () => {
    expect(nextOrderIndex([{ orderIndex: null }])).toBe(1)
  })
})
