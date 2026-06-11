import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Plus, Trash2, Dumbbell } from 'lucide-react'
import { sessionExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionRow } from '@/evolu/rows'
import { Button } from '@/shared/components/Button'
import { formatElapsed } from '@/shared/utils/workoutStats'
import { WorkoutExerciseCard } from './WorkoutExerciseCard'

interface ActiveWorkoutProps {
  session: WorkoutSessionRow
}

/** The in-progress workout screen: timer, logged exercises, finish / discard. */
export function ActiveWorkout({ session }: ActiveWorkoutProps) {
  const navigate = useNavigate()
  const { finishWorkoutSession, discardWorkoutSession } = useBodyCacheMutations()
  const exercises = useQuery(sessionExercises(session.id))

  // Tick once a second so the elapsed timer stays live.
  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [])

  const handleFinish = () => {
    if (!window.confirm('Finish this workout?')) return
    finishWorkoutSession(session.id)
    navigate('/', { replace: true })
  }

  const handleDiscard = () => {
    if (!window.confirm('Discard this workout? Everything logged will be removed.')) return
    discardWorkoutSession(session.id)
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-100">Workout</h1>
          <p className="text-sm tabular-nums text-gray-400">
            {formatElapsed(session.startedAt ?? now, now)} elapsed
          </p>
        </div>
        <button
          type="button"
          onClick={handleDiscard}
          aria-label="Discard workout"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 active:bg-gray-800"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {exercises.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-800 px-6 py-10 text-center">
          <Dumbbell size={28} className="text-gray-600" />
          <p className="text-sm text-gray-400">
            No exercises yet. Add one to start logging sets.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {exercises.map((we) => (
            <WorkoutExerciseCard
              key={we.id}
              workoutExercise={we}
              currentSessionId={session.id}
            />
          ))}
        </div>
      )}

      <Button variant="secondary" fullWidth onClick={() => navigate('/workout/add-exercise')}>
        <Plus size={18} /> Add exercise
      </Button>

      <Button fullWidth onClick={handleFinish} disabled={exercises.length === 0}>
        Finish workout
      </Button>
    </div>
  )
}
