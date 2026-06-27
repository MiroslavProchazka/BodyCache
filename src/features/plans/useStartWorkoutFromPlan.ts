import { useCallback } from 'react'
import { evolu } from '@/evolu/evolu'
import { planExercises, planSetsForPlan } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId, PlanId, WorkoutSessionId } from '@/evolu/schema'
import { byOrderIndex, planSetToSetInput } from './planToSession'

/**
 * Instantiate a live workout from a saved plan. Starts a fresh session, then
 * copies each plan exercise (in order) and its target sets into the session as
 * incomplete "ghost" sets the user confirms/edits in the logger.
 *
 * Reads use `evolu.loadQuery` (promise-based, fine in an event handler); the
 * session/exercise/set inserts reuse the existing workout mutations so the
 * instantiated rows are indistinguishable from a hand-logged session.
 */
export const useStartWorkoutFromPlan = () => {
  const { startWorkoutSession, addExerciseToWorkout, addSet } = useBodyCacheMutations()

  return useCallback(
    async (planId: PlanId): Promise<WorkoutSessionId | null> => {
      const session = startWorkoutSession()
      if (!session.ok) return null
      const sessionId = session.value.id

      const [exercises, sets] = await Promise.all([
        evolu.loadQuery(planExercises(planId)),
        evolu.loadQuery(planSetsForPlan(planId)),
      ])

      for (const pe of byOrderIndex(exercises)) {
        const we = addExerciseToWorkout(
          sessionId,
          pe.exerciseId as ExerciseId,
          pe.orderIndex as number,
          (pe.supersetGroup as string | null) ?? null,
        )
        if (!we.ok) continue
        const peSets = byOrderIndex(
          sets.filter((s) => String(s.planExerciseId) === String(pe.id)),
        )
        peSets.forEach((ps, i) => addSet(we.value.id, planSetToSetInput(ps, i)))
      }

      return sessionId
    },
    [startWorkoutSession, addExerciseToWorkout, addSet],
  )
}
