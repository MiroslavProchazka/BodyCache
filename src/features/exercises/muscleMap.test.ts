import { describe, expect, it } from 'vitest'
import { bodyFor, MUSCLE_LABELS } from './muscleMap'

describe('bodyFor', () => {
  it('maps simple parts directly', () => {
    expect(bodyFor({ bodyPart: 'chest', name: 'Bench Press' })).toEqual({
      muscle: 'chest',
      view: 'front',
      label: 'Chest',
      secondaries: ['shoulders', 'triceps'],
      secondaryLabel: 'Front delts · triceps',
    })
    expect(bodyFor({ bodyPart: 'shoulders', name: 'Overhead Press' }).muscle).toBe('shoulders')
    expect(bodyFor({ bodyPart: 'core', name: 'Crunch' })).toEqual({
      muscle: 'abs',
      view: 'front',
      label: 'Core',
      secondaries: [],
      secondaryLabel: '',
    })
    expect(bodyFor({ bodyPart: 'back', name: 'Lat Pulldown' })).toEqual({
      muscle: 'back',
      view: 'back',
      label: 'Back & lats',
      secondaries: ['biceps'],
      secondaryLabel: 'Biceps · forearms',
    })
  })

  it('exposes secondary muscles + label for compound movements', () => {
    expect(bodyFor({ bodyPart: 'shoulders', name: 'Overhead Press' }).secondaries).toEqual([
      'triceps',
    ])
    expect(bodyFor({ bodyPart: 'legs', name: 'Leg Press' }).secondaries).toEqual(['glutes'])
    expect(bodyFor({ bodyPart: 'legs', name: 'Seated Leg Curl' })).toMatchObject({
      muscle: 'hamstrings',
      secondaries: ['glutes', 'calves'],
      secondaryLabel: 'Glutes · calves',
    })
  })

  it('refines Arms by name → triceps vs biceps', () => {
    expect(bodyFor({ bodyPart: 'arms', name: 'Triceps Pushdown' }).muscle).toBe('triceps')
    expect(bodyFor({ bodyPart: 'arms', name: 'Skull Crusher' }).muscle).toBe('triceps')
    expect(bodyFor({ bodyPart: 'arms', name: 'Bench Dip' }).muscle).toBe('triceps')
    expect(bodyFor({ bodyPart: 'arms', name: 'Barbell Curl' }).muscle).toBe('biceps')
    // Biceps work the forearms as a secondary cue but no dimmed map muscle.
    expect(bodyFor({ bodyPart: 'arms', name: 'Barbell Curl' }).secondaryLabel).toBe('Forearms')
  })

  it('refines Legs by name → calves / hamstrings / glutes / quads', () => {
    expect(bodyFor({ bodyPart: 'legs', name: 'Standing Calf Raise' }).muscle).toBe('calves')
    expect(bodyFor({ bodyPart: 'legs', name: 'Seated Leg Curl' }).muscle).toBe('hamstrings')
    expect(bodyFor({ bodyPart: 'legs', name: 'Hip Thrust' }).muscle).toBe('glutes')
    expect(bodyFor({ bodyPart: 'legs', name: 'Leg Press' }).muscle).toBe('quads')
  })

  it('falls back to no highlight for cardio / full body / unset', () => {
    expect(bodyFor({ bodyPart: 'cardio', name: 'Treadmill' }).muscle).toBe('')
    expect(bodyFor({ bodyPart: 'full_body', name: 'Burpee' })).toEqual({
      muscle: '',
      view: 'front',
      label: 'Full body',
      secondaries: [],
      secondaryLabel: '',
    })
    expect(bodyFor({ bodyPart: null, name: 'Something' }).muscle).toBe('')
  })
})

describe('MUSCLE_LABELS', () => {
  it('labels every muscle key', () => {
    expect(MUSCLE_LABELS.abs).toBe('Core')
    expect(MUSCLE_LABELS.back).toBe('Back')
    expect(Object.keys(MUSCLE_LABELS)).toHaveLength(10)
  })
})
