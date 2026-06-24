import { describe, expect, it } from 'vitest'
import { repeatSetToSetInput, type RepeatSetSource } from './sessionToSession'

const doneSet = (over: Partial<RepeatSetSource> = {}): RepeatSetSource => ({
  orderIndex: 0,
  weightKg: null,
  reps: null,
  addedWeightKg: null,
  assistanceWeightKg: null,
  durationSec: null,
  distanceMeters: null,
  inclinePercent: null,
  speedKmh: null,
  resistanceLevel: null,
  rpe: null,
  setType: null,
  ...over,
})

describe('repeatSetToSetInput', () => {
  it('copies the performed metrics but leaves the set incomplete', () => {
    const input = repeatSetToSetInput(doneSet({ weightKg: 80, reps: 8 }), 1)
    expect(input).toMatchObject({
      orderIndex: 1,
      completedAt: null,
      weightKg: 80,
      reps: 8,
    })
  })

  it('renumbers the set with the passed order index, not the source order', () => {
    const input = repeatSetToSetInput(doneSet({ orderIndex: 7, reps: 5 }), 0)
    expect(input.orderIndex).toBe(0)
  })

  it('carries every metric column verbatim (e.g. cardio + rpe fields)', () => {
    const input = repeatSetToSetInput(
      doneSet({
        durationSec: 600,
        distanceMeters: 2000,
        inclinePercent: 3,
        speedKmh: 12,
        resistanceLevel: 8,
        rpe: 9,
      }),
      0,
    )
    expect(input).toMatchObject({
      durationSec: 600,
      distanceMeters: 2000,
      inclinePercent: 3,
      speedKmh: 12,
      resistanceLevel: 8,
      rpe: 9,
    })
  })

  it('narrows a valid set type and drops an unknown one', () => {
    expect(repeatSetToSetInput(doneSet({ setType: 'warmup' }), 0).setType).toBe('warmup')
    expect(repeatSetToSetInput(doneSet({ setType: 'bogus' }), 0).setType).toBeNull()
  })

  it('preserves nulls for metrics the set never recorded', () => {
    const input = repeatSetToSetInput(doneSet(), 0)
    expect(input.weightKg).toBeNull()
    expect(input.reps).toBeNull()
    expect(input.assistanceWeightKg).toBeNull()
  })
})
