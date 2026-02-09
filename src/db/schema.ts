import * as Evolu from '@evolu/common'

const movementPattern = Evolu.TrimmedString100
const setType = Evolu.TrimmedString100
const weightUnit = Evolu.TrimmedString100

export const schema = {
  exercises: {
    id: Evolu.id('Exercise'),
    name: Evolu.NonEmptyTrimmedString100,
    primaryMuscles: Evolu.Json,
    secondaryMuscles: Evolu.Json,
    equipment: Evolu.Json,
    movementPattern,
    isCustom: Evolu.SqliteBoolean,
    archivedAt: Evolu.nullOr(Evolu.TrimmedString100)
  },
  workoutTemplates: {
    id: Evolu.id('WorkoutTemplate'),
    name: Evolu.NonEmptyTrimmedString100,
    notes: Evolu.nullOr(Evolu.TrimmedString1000),
    archivedAt: Evolu.nullOr(Evolu.TrimmedString100)
  },
  templateExercises: {
    id: Evolu.id('TemplateExercise'),
    templateId: Evolu.id('WorkoutTemplate'),
    exerciseId: Evolu.id('Exercise'),
    orderIndex: Evolu.NonNegativeNumber,
    suggestedSets: Evolu.nullOr(Evolu.PositiveNumber),
    suggestedReps: Evolu.nullOr(Evolu.PositiveNumber),
    suggestedRpe: Evolu.nullOr(Evolu.PositiveNumber),
    notes: Evolu.nullOr(Evolu.TrimmedString1000)
  },
  workoutSessions: {
    id: Evolu.id('WorkoutSession'),
    name: Evolu.NonEmptyTrimmedString100,
    startedAt: Evolu.TrimmedString100,
    endedAt: Evolu.nullOr(Evolu.TrimmedString100),
    templateId: Evolu.nullOr(Evolu.id('WorkoutTemplate')),
    notes: Evolu.nullOr(Evolu.TrimmedString1000)
  },
  sessionExercises: {
    id: Evolu.id('SessionExercise'),
    sessionId: Evolu.id('WorkoutSession'),
    exerciseId: Evolu.id('Exercise'),
    orderIndex: Evolu.NonNegativeNumber,
    notes: Evolu.nullOr(Evolu.TrimmedString1000)
  },
  setEntries: {
    id: Evolu.id('SetEntry'),
    sessionExerciseId: Evolu.id('SessionExercise'),
    setIndex: Evolu.NonNegativeNumber,
    type: setType,
    reps: Evolu.nullOr(Evolu.PositiveNumber),
    weight: Evolu.nullOr(Evolu.NonNegativeNumber),
    unit: weightUnit,
    rpe: Evolu.nullOr(Evolu.PositiveNumber),
    rir: Evolu.nullOr(Evolu.NonNegativeNumber),
    restSeconds: Evolu.nullOr(Evolu.NonNegativeNumber),
    isCompleted: Evolu.SqliteBoolean,
    completedAt: Evolu.nullOr(Evolu.TrimmedString100),
    notes: Evolu.nullOr(Evolu.TrimmedString1000)
  }
}

export type Schema = typeof schema

export type SeedExercise = {
  name: string
  primaryMuscles: string[]
  secondaryMuscles: string[]
  equipment: string[]
  movementPattern: 'push' | 'pull' | 'hinge' | 'squat' | 'carry' | 'core' | 'other'
}
