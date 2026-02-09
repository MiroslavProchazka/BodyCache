import { evolu } from './evolu'
import { seedExercises } from './seedExercises'

const SEED_FLAG = 'bodycache_seeded_v1'

export const seedExercisesOnFirstRun = async () => {
  if (typeof window === 'undefined') return
  if (window.localStorage.getItem(SEED_FLAG) === '1') return
  const create = (evolu as any).create as
    | ((table: string, values: Record<string, unknown>) => Promise<unknown>)
    | undefined
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
