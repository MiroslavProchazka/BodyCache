import { useCallback } from 'react'
import { evolu } from '@/evolu/evolu'
import { sessionExercises, sessionSetsForRepeat } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId, WorkoutSessionId } from '@/evolu/schema'
import { byOrderIndex } from '@/features/plans/planToSession'
import { repeatSetToSetInput } from './sessionToSession'

/**
 * Instantiate a fresh workout from a finished session — "do what I did last
 * time". Starts a new session, then copies each exercise (in order) and its
 * completed sets into the session as incomplete "ghost" sets the user confirms
 * or edits in the logger.
 *
 * Mirrors `useStartWorkoutFromPlan`: reads use `evolu.loadQuery` (promise-based,
 * fine in an event handler); inserts reuse the workout mutations so the rebuilt
 * rows are indistinguishable from a hand-logged session.
 */
export const useRepeatWorkout = () => {
  const { startWorkoutSession, addExerciseToWorkout, addSet } = useBodyCacheMutations()

  return useCallback(
    async (sourceSessionId: WorkoutSessionId): Promise<WorkoutSessionId | null> => {
      const session = startWorkoutSession()
      if (!session.ok) return null
      const sessionId = session.value.id

      const [exercises, sets] = await Promise.all([
        evolu.loadQuery(sessionExercises(sourceSessionId)),
        evolu.loadQuery(sessionSetsForRepeat(sourceSessionId)),
      ])

      for (const ex of byOrderIndex(exercises)) {
        const we = addExerciseToWorkout(
          sessionId,
          ex.exerciseId as ExerciseId,
          ex.orderIndex as number,
        )
        if (!we.ok) continue
        const exSets = byOrderIndex(
          sets.filter((s) => String(s.workoutExerciseId) === String(ex.id)),
        )
        exSets.forEach((s, i) => addSet(we.value.id, repeatSetToSetInput(s, i)))
      }

      return sessionId
    },
    [startWorkoutSession, addExerciseToWorkout, addSet],
  )
}
