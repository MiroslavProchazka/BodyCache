import { describe, expect, it } from 'vitest'
import { muscleDistribution, distributionLegend } from './muscleDistribution'

describe('muscleDistribution', () => {
  it('credits the primary muscle one point per set', () => {
    const dist = muscleDistribution([{ name: 'Crunch', bodyPart: 'core', sets: 2 }])
    expect(dist.direct.abs).toBe(2)
    expect(dist.pts.abs).toBe(2)
    // 2 of 4 points → half intensity.
    expect(dist.levels.abs).toBeCloseTo(0.5)
  })

  it('credits secondary muscles at 40% and excludes them from direct counts', () => {
    // Bench press → primary chest, secondaries shoulders + triceps.
    const dist = muscleDistribution([{ name: 'Bench Press', bodyPart: 'chest', sets: 1 }])
    expect(dist.direct.chest).toBe(1)
    expect(dist.direct.shoulders).toBeUndefined()
    expect(dist.pts.shoulders).toBeCloseTo(0.4)
    expect(dist.pts.triceps).toBeCloseTo(0.4)
    expect(dist.levels.shoulders).toBeCloseTo(0.1)
  })

  it('caps intensity at 1 once a muscle passes four points', () => {
    const dist = muscleDistribution([{ name: 'Squat', bodyPart: 'legs', sets: 9 }])
    expect(dist.levels.quads).toBe(1)
  })

  it('accumulates across multiple exercises hitting the same muscle', () => {
    const dist = muscleDistribution([
      { name: 'Bench Press', bodyPart: 'chest', sets: 2 },
      { name: 'Overhead Press', bodyPart: 'shoulders', sets: 2 },
    ])
    // shoulders: 2 direct (OHP) + 0.8 secondary (bench) = 2.8 points.
    expect(dist.direct.shoulders).toBe(2)
    expect(dist.pts.shoulders).toBeCloseTo(2.8)
  })

  it('ignores entries with no muscle mapping or zero sets', () => {
    const dist = muscleDistribution([
      { name: 'Treadmill', bodyPart: 'cardio', sets: 3 },
      { name: 'Bench Press', bodyPart: 'chest', sets: 0 },
    ])
    expect(dist.direct).toEqual({})
    expect(dist.levels).toEqual({})
  })
})

describe('distributionLegend', () => {
  it('lists directly worked muscles, sorted by set count desc', () => {
    const dist = muscleDistribution([
      { name: 'Lat Pulldown', bodyPart: 'back', sets: 1 },
      { name: 'Squat', bodyPart: 'legs', sets: 3 },
    ])
    const legend = distributionLegend(dist)
    expect(legend.map((l) => l.muscle)).toEqual(['quads', 'back'])
    expect(legend[0]).toMatchObject({ label: 'Quads', sets: 3 })
  })

  it('is empty when nothing has been worked', () => {
    expect(distributionLegend(muscleDistribution([]))).toEqual([])
  })
})
