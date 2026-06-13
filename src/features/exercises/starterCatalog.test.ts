import { describe, expect, it } from 'vitest'
import { BODY_PARTS, EQUIPMENT, EXERCISE_TYPES } from '@/evolu/schema'
import {
  groupStarterCatalog,
  normalizeExerciseName,
  STARTER_CATALOG,
} from './starterCatalog'

describe('STARTER_CATALOG', () => {
  it('only uses valid enum values for every facet', () => {
    for (const e of STARTER_CATALOG) {
      expect(EXERCISE_TYPES, e.name).toContain(e.type)
      expect(BODY_PARTS, e.name).toContain(e.bodyPart)
      expect(EQUIPMENT, e.name).toContain(e.equipment)
    }
  })

  it('has non-empty, trimmed names', () => {
    for (const e of STARTER_CATALOG) {
      expect(e.name.length).toBeGreaterThan(0)
      expect(e.name).toBe(e.name.trim())
    }
  })

  it('has no duplicate names (case/space-insensitive)', () => {
    const keys = STARTER_CATALOG.map((e) => normalizeExerciseName(e.name))
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('normalizeExerciseName', () => {
  it('lowercases, trims and collapses whitespace', () => {
    expect(normalizeExerciseName('  Lat   Pulldown ')).toBe('lat pulldown')
    expect(normalizeExerciseName('Lat Pulldown')).toBe(
      normalizeExerciseName('lat   pulldown'),
    )
  })
})

describe('groupStarterCatalog', () => {
  it('partitions the catalog without dropping or duplicating entries', () => {
    const groups = groupStarterCatalog()
    const total = groups.reduce((n, g) => n + g.items.length, 0)
    expect(total).toBe(STARTER_CATALOG.length)
    for (const g of groups) {
      expect(g.items.length).toBeGreaterThan(0)
      for (const e of g.items) expect(e.bodyPart).toBe(g.bodyPart)
    }
  })

  it('orders groups by the BODY_PARTS enum', () => {
    const groups = groupStarterCatalog()
    const order = groups.map((g) => g.bodyPart)
    const expected = BODY_PARTS.filter((p) => order.includes(p))
    expect(order).toEqual(expected)
  })
})
