import { describe, expect, it } from 'vitest'
import { bodyFor } from './muscleMap'

describe('bodyFor', () => {
  it('maps simple parts directly', () => {
    expect(bodyFor({ bodyPart: 'chest', name: 'Bench Press' })).toEqual({
      muscle: 'chest',
      view: 'front',
      label: 'Chest',
    })
    expect(bodyFor({ bodyPart: 'shoulders', name: 'Overhead Press' }).muscle).toBe('shoulders')
    expect(bodyFor({ bodyPart: 'core', name: 'Crunch' })).toEqual({
      muscle: 'abs',
      view: 'front',
      label: 'Core',
    })
    expect(bodyFor({ bodyPart: 'back', name: 'Lat Pulldown' })).toEqual({
      muscle: 'back',
      view: 'back',
      label: 'Back & lats',
    })
  })

  it('refines Arms by name → triceps vs biceps', () => {
    expect(bodyFor({ bodyPart: 'arms', name: 'Triceps Pushdown' }).muscle).toBe('triceps')
    expect(bodyFor({ bodyPart: 'arms', name: 'Skull Crusher' }).muscle).toBe('triceps')
    expect(bodyFor({ bodyPart: 'arms', name: 'Bench Dip' }).muscle).toBe('triceps')
    expect(bodyFor({ bodyPart: 'arms', name: 'Barbell Curl' }).muscle).toBe('biceps')
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
    })
    expect(bodyFor({ bodyPart: null, name: 'Something' }).muscle).toBe('')
  })
})
