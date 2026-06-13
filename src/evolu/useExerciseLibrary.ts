import { useQuerySubscription } from '@evolu/react'
import { useBodyCacheMutations } from './mutations'
import { allExercises } from './queries'

export const useExerciseLibrary = () => {
  const exercises = useQuerySubscription(allExercises)
  const { createExercise } = useBodyCacheMutations()

  return {
    exercises,
    createExercise,
  }
}