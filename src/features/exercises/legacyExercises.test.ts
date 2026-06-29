import { describe, expect, it } from 'vitest'
import type { ExerciseRow } from '@/evolu/rows'
import { legacyExercises } from './legacyExercises'

/** Build a loose exercise row, cast to the branded Evolu row type. */
const ex = (over: Record<string, unknown>): ExerciseRow =>
  ({
    id: 'e1',
    name: 'Exercise',
    type: 'strength',
    bodyPart: 'chest',
    equipment: 'machine',
    notes: null,
    primaryPhotoId: null,
    ...over,
  }) as unknown as ExerciseRow

describe('legacyExercises', () => {
  it('keeps only exercises without a primary photo', () => {
    const rows = [
      ex({ id: 'a', name: 'Ab Crunch Machine', primaryPhotoId: null }),
      ex({ id: 'b', name: 'Ab Crunch (Machine)', primaryPhotoId: 'photo1' }),
      ex({ id: 'c', name: 'Air Bike', primaryPhotoId: null }),
    ]
    expect(legacyExercises(rows).map((e) => e.id)).toEqual(['a', 'c'])
  })

  it('returns nothing when every exercise has a photo', () => {
    const rows = [ex({ id: 'a', primaryPhotoId: 'p1' }), ex({ id: 'b', primaryPhotoId: 'p2' })]
    expect(legacyExercises(rows)).toHaveLength(0)
  })

  it('returns an empty list for no rows', () => {
    expect(legacyExercises([])).toEqual([])
  })
})
