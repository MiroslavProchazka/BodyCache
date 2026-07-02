import { describe, expect, it } from 'vitest'
import type { ExerciseRow } from '@/evolu/rows'
import { matchesExerciseFilter } from './exerciseFilter'

const ex = (over: Record<string, unknown>): ExerciseRow =>
  ({
    id: 'id',
    name: 'Bench Press',
    type: 'strength',
    bodyPart: 'chest',
    equipment: 'barbell',
    primaryPhotoId: null,
    notes: null,
    ...over,
  }) as ExerciseRow

describe('matchesExerciseFilter', () => {
  it('matches everything with no search and no part', () => {
    expect(matchesExerciseFilter(ex({}), '', null)).toBe(true)
  })

  it('filters by body part', () => {
    expect(matchesExerciseFilter(ex({ bodyPart: 'legs' }), '', 'legs')).toBe(true)
    expect(matchesExerciseFilter(ex({ bodyPart: 'chest' }), '', 'legs')).toBe(false)
  })

  it('matches name case- and whitespace-insensitively', () => {
    expect(matchesExerciseFilter(ex({ name: 'Bench Press' }), '  BENCH ', null)).toBe(true)
    expect(matchesExerciseFilter(ex({ name: 'Squat' }), 'bench', null)).toBe(false)
  })

  it('matches on body part or equipment too', () => {
    expect(matchesExerciseFilter(ex({ equipment: 'barbell' }), 'barbell', null)).toBe(true)
    expect(matchesExerciseFilter(ex({ bodyPart: 'chest' }), 'chest', null)).toBe(true)
  })

  it('requires both part and search to match', () => {
    const row = ex({ name: 'Leg Press', bodyPart: 'legs' })
    expect(matchesExerciseFilter(row, 'leg', 'legs')).toBe(true)
    expect(matchesExerciseFilter(row, 'leg', 'chest')).toBe(false)
    expect(matchesExerciseFilter(row, 'bench', 'legs')).toBe(false)
  })

  it('tolerates null name/equipment fields', () => {
    const row = ex({ name: null as unknown as string, equipment: null })
    expect(matchesExerciseFilter(row, 'chest', null)).toBe(true)
    expect(matchesExerciseFilter(row, 'bench', null)).toBe(false)
  })
})
