import { describe, expect, it } from 'vitest'
import { EXERCISE_TYPES } from '@/evolu/schema'
import {
  SET_FIELDS,
  DEFAULT_VALUES,
  PREFILL_KEYS,
  type SetFieldKey,
} from './setFields'

describe('SET_FIELDS', () => {
  it('defines at least one stepper for every exercise type', () => {
    for (const type of EXERCISE_TYPES) {
      expect(SET_FIELDS[type].length).toBeGreaterThan(0)
    }
  })

  it('marks integer-only fields and weight fields consistently', () => {
    const all = Object.values(SET_FIELDS).flat()
    // Weight fields step by a half-plate (2.5) and are flagged isWeight.
    for (const f of all.filter((f) => f.isWeight)) {
      expect(f.step).toBe(2.5)
    }
    // Reps and seconds are whole numbers.
    for (const f of all.filter((f) => f.key === 'reps' || f.key === 'durationSec')) {
      expect(f.integer).toBe(true)
    }
  })
})

describe('DEFAULT_VALUES / PREFILL_KEYS', () => {
  it('has a default for every field key used across types', () => {
    const used = new Set<SetFieldKey>(
      Object.values(SET_FIELDS).flatMap((defs) => defs.map((d) => d.key)),
    )
    for (const key of used) {
      expect(DEFAULT_VALUES[key]).toBeTypeOf('number')
    }
  })

  it('prefills exactly the keys that have defaults', () => {
    expect([...PREFILL_KEYS].sort()).toEqual(
      (Object.keys(DEFAULT_VALUES) as SetFieldKey[]).sort(),
    )
  })
})
