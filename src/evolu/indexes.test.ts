import { describe, expect, it } from 'vitest'
import { INDEX_DEFINITIONS, buildIndexes } from './indexes'

describe('INDEX_DEFINITIONS', () => {
  it('is a stable snapshot of the index set', () => {
    expect(INDEX_DEFINITIONS).toMatchInlineSnapshot(`
      [
        {
          "column": "workoutExerciseId",
          "name": "exerciseSetWorkoutExerciseId",
          "table": "exerciseSet",
        },
        {
          "column": "workoutSessionId",
          "name": "workoutExerciseSessionId",
          "table": "workoutExercise",
        },
        {
          "column": "exerciseId",
          "name": "workoutExerciseExerciseId",
          "table": "workoutExercise",
        },
        {
          "column": "startedAt",
          "name": "workoutSessionStartedAt",
          "table": "workoutSession",
        },
        {
          "column": "status",
          "name": "workoutSessionStatus",
          "table": "workoutSession",
        },
        {
          "column": "exerciseId",
          "name": "exercisePhotoExerciseId",
          "table": "exercisePhoto",
        },
        {
          "column": "name",
          "name": "exerciseName",
          "table": "exercise",
        },
        {
          "column": "planId",
          "name": "planExercisePlanId",
          "table": "planExercise",
        },
        {
          "column": "planExerciseId",
          "name": "planSetPlanExerciseId",
          "table": "planSet",
        },
      ]
    `)
  })

  it('has unique index names', () => {
    const names = INDEX_DEFINITIONS.map((d) => d.name)
    expect(new Set(names).size).toBe(names.length)
  })
})

describe('buildIndexes', () => {
  it('applies each definition through create().on().column() in order', () => {
    const calls: string[] = []
    const built = buildIndexes((name) => {
      calls.push(`create:${name}`)
      return {
        on: (table) => {
          calls.push(`on:${table}`)
          return {
            column: (column) => {
              calls.push(`column:${column}`)
              return `${name}|${table}|${column}`
            },
          }
        },
      }
    })

    expect(built).toEqual(
      INDEX_DEFINITIONS.map((d) => `${d.name}|${d.table}|${d.column}`),
    )
    // The first definition drives the first create/on/column call trio.
    const first = INDEX_DEFINITIONS[0]
    expect(calls.slice(0, 3)).toEqual([
      `create:${first.name}`,
      `on:${first.table}`,
      `column:${first.column}`,
    ])
    expect(built).toHaveLength(INDEX_DEFINITIONS.length)
  })
})
