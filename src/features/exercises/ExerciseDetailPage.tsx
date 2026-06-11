import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ArrowLeft, Trash2, History } from 'lucide-react'
import { evolu } from '@/evolu/evolu'
import { exerciseById, activeWorkoutSession, sessionExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId, ExercisePhotoId, WorkoutSessionId } from '@/evolu/schema'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { PhotoThumb } from './PhotoThumb'

export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { softDeleteExercise, startWorkoutSession, addExerciseToWorkout } =
    useBodyCacheMutations()
  const rows = useQuery(exerciseById((id ?? '') as ExerciseId))
  const exercise = id ? rows[0] : undefined

  if (!exercise) {
    return (
      <div className="px-4 py-10 text-center text-gray-400">
        <p>Exercise not found.</p>
        <button
          onClick={() => navigate('/library')}
          className="mt-3 text-indigo-400 hover:text-indigo-300"
        >
          Back to library
        </button>
      </div>
    )
  }

  const chips = [exercise.type, exercise.bodyPart, exercise.equipment].filter(Boolean)

  const handleDelete = () => {
    if (!window.confirm(`Delete "${exercise.name}"? This can't be undone.`)) return
    softDeleteExercise(exercise.id)
    navigate('/library', { replace: true })
  }

  /** Add this exercise to the active workout (starting one if needed). */
  const handleLogToday = async () => {
    const active = await evolu.loadQuery(activeWorkoutSession)
    let sessionId = active[0]?.id as WorkoutSessionId | undefined
    if (!sessionId) {
      const started = startWorkoutSession()
      if (!started.ok) return
      sessionId = started.value.id
    }
    const existing = await evolu.loadQuery(sessionExercises(sessionId))
    if (!existing.some((w) => String(w.exerciseId) === String(exercise.id))) {
      addExerciseToWorkout(sessionId, exercise.id, existing.length)
    }
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-xl pb-6">
      {/* Hero photo */}
      <div className="relative">
        <PhotoThumb
          photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
          full
          className="aspect-video w-full"
          alt={String(exercise.name)}
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 rounded-full bg-black/50 p-2 text-white"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleDelete}
          className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white"
          aria-label="Delete exercise"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-100">{exercise.name}</h1>
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {chips.map((chip, i) => (
                <span
                  key={i}
                  className="rounded-md bg-gray-800 px-2 py-0.5 text-xs capitalize text-gray-400"
                >
                  {String(chip).replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        {exercise.notes && (
          <Card className="p-3 text-sm text-gray-300">{exercise.notes}</Card>
        )}

        {/* History & stats land in Milestone 5. */}
        <Card className="flex flex-col items-center gap-2 p-6 text-center">
          <History size={28} className="text-gray-500" />
          <p className="text-sm text-gray-400">
            No history yet. Log this exercise in a workout to see last performance,
            best set and trends here.
          </p>
        </Card>

        <Button fullWidth onClick={handleLogToday}>
          Log today
        </Button>
      </div>
    </div>
  )
}
