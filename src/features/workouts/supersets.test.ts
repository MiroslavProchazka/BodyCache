import { describe, it, expect } from 'vitest'
import { groupExercises, newSupersetKey, supersetLabel } from './supersets'

/** Minimal row: only the key matters; ids label the assertions. */
const row = (id: string, supersetGroup: string | null) => ({ id, supersetGroup })

describe('groupExercises', () => {
  it('renders all-standalone rows as one block each', () => {
    const blocks = groupExercises([row('a', null), row('b', null), row('c', null)])
    expect(blocks).toHaveLength(3)
    expect(blocks.every((b) => b.group === null && b.items.length === 1)).toBe(true)
  })

  it('folds a consecutive run sharing a key into one superset block', () => {
    const blocks = groupExercises([row('a', 'k1'), row('b', 'k1'), row('c', null)])
    expect(blocks).toHaveLength(2)
    expect(blocks[0]).toEqual({ group: 'k1', items: [row('a', 'k1'), row('b', 'k1')] })
    expect(blocks[1]).toEqual({ group: null, items: [row('c', null)] })
  })

  it('keeps two adjacent supersets distinct by key (no merge)', () => {
    const blocks = groupExercises([
      row('a', 'k1'),
      row('b', 'k1'),
      row('c', 'k2'),
      row('d', 'k2'),
    ])
    expect(blocks).toHaveLength(2)
    expect(blocks[0].group).toBe('k1')
    expect(blocks[1].group).toBe('k2')
  })

  it('splits a same-key run interrupted by a standalone', () => {
    const blocks = groupExercises([
      row('a', 'k1'),
      row('b', null),
      row('c', 'k1'),
      row('d', 'k1'),
    ])
    expect(blocks).toHaveLength(3)
    // a is now a length-1 run → standalone; c+d remain a superset.
    expect(blocks[0]).toEqual({ group: null, items: [row('a', 'k1')] })
    expect(blocks[1]).toEqual({ group: null, items: [row('b', null)] })
    expect(blocks[2]).toEqual({ group: 'k1', items: [row('c', 'k1'), row('d', 'k1')] })
  })

  it('collapses a length-1 run (inert key) to a standalone block', () => {
    const blocks = groupExercises([row('a', 'k1'), row('b', 'k2')])
    expect(blocks).toHaveLength(2)
    expect(blocks.every((b) => b.group === null && b.items.length === 1)).toBe(true)
  })

  it('returns no blocks for an empty list', () => {
    expect(groupExercises([])).toEqual([])
  })
})

describe('supersetLabel', () => {
  it('derives letter from superset index and number from member index', () => {
    expect(supersetLabel(0, 0)).toBe('A1')
    expect(supersetLabel(0, 1)).toBe('A2')
    expect(supersetLabel(1, 0)).toBe('B1')
    expect(supersetLabel(2, 2)).toBe('C3')
  })
})

describe('newSupersetKey', () => {
  it('returns a non-empty string', () => {
    expect(newSupersetKey().length).toBeGreaterThan(0)
  })
  it('returns distinct keys across calls', () => {
    expect(newSupersetKey()).not.toBe(newSupersetKey())
  })
})
