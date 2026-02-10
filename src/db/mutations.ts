import {
  type LocalWorkoutSession,
  finishLocalWorkoutSession,
  renameLocalWorkoutSession,
  startLocalWorkoutSession
} from '../domain/workoutSession'
import { evolu } from './evolu'
import { seedExercises } from './seedExercises'

const SEED_FLAG = 'bodycache_seeded_v1'

const getCreateMutation = () =>
  (evolu as any).create as
    | ((table: string, values: Record<string, unknown>) => Promise<unknown>)
    | undefined

const syncWorkoutSessionStart = async (session: LocalWorkoutSession) => {
  const create = getCreateMutation()
  if (!create) return

  try {
    await create('workoutSessions', {
      name: session.name,
      startedAt: session.startedAt,
      endedAt: null,
      templateId: null,
      notes: null
    })
  } catch {
    // Local-first mode keeps state in local storage even when sync is unavailable
  }
}

export const seedExercisesOnFirstRun = async () => {
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem(SEED_FLAG) === '1') return

  const create = getCreateMutation()
  if (!create) return

  for (const exercise of seedExercises) {
    await create('exercises', {
      name: exercise.name,
      primaryMuscles: exercise.primaryMuscles,
      secondaryMuscles: exercise.secondaryMuscles,
      equipment: exercise.equipment,
      movementPattern: exercise.movementPattern,
      isCustom: 0,
      archivedAt: null
    })
  }

  window.localStorage.setItem(SEED_FLAG, '1')
}

export const startWorkoutSession = async (name: string) => {
  const session = startLocalWorkoutSession(name)
  await syncWorkoutSessionStart(session)
  return session
}

export const renameWorkoutSession = (name: string) => renameLocalWorkoutSession(name)

export const finishWorkoutSession = () => finishLocalWorkoutSession()
