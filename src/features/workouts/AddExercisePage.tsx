import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ArrowLeft, Plus, Search } from 'lucide-react'
import { activeWorkoutSession, allExercises, sessionExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId, ExercisePhotoId, WorkoutSessionId } from '@/evolu/schema'
import { Button } from '@/shared/components/Button'
import { PhotoThumb } from '@/features/exercises/PhotoThumb'

/**
 * Pick an exercise from the library to add to the active workout, or jump to
 * creating a new one (carrying the session so it's added on save). Redirects
 * home if there is no active session.
 */
export function AddExercisePage() {
  const sessions = useQuery(activeWorkoutSession)
  const session = sessions[0]
  if (!session) return <Navigate to="/" replace />
  return <AddExerciseInner sessionId={session.id} />
}

function AddExerciseInner({ sessionId }: { sessionId: WorkoutSessionId }) {
  const navigate = useNavigate()
  const { addExerciseToWorkout } = useBodyCacheMutations()
  const exercises = useQuery(allExercises)
  const inWorkout = useQuery(sessionExercises(sessionId))
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return exercises
    return exercises.filter((e) => String(e.name).toLowerCase().includes(q))
  }, [exercises, search])

  const addedIds = useMemo(
    () => new Set(inWorkout.map((w) => String(w.exerciseId))),
    [inWorkout],
  )

  const handlePick = (exerciseId: ExerciseId) => {
    if (!addedIds.has(String(exerciseId))) {
      addExerciseToWorkout(sessionId, exerciseId, inWorkout.length)
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-5">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-200"
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">Add exercise</h1>
      </header>

      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="search"
          inputMode="search"
          placeholder="Search exercises"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-3 text-base text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <Link to={`/library/new?session=${sessionId}`}>
        <Button variant="secondary" fullWidth>
          <Plus size={18} /> New exercise
        </Button>
      </Link>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          {exercises.length === 0
            ? 'Your library is empty — create your first exercise.'
            : 'No exercises match your search.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((exercise) => {
            const added = addedIds.has(String(exercise.id))
            return (
              <button
                key={exercise.id}
                type="button"
                onClick={() => handlePick(exercise.id)}
                className="flex items-center gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-3 text-left active:bg-gray-800/60"
              >
                <PhotoThumb
                  photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
                  className="h-12 w-12 shrink-0 rounded-xl"
                  alt={String(exercise.name)}
                />
                <span className="min-w-0 flex-1 truncate text-base font-semibold text-gray-100">
                  {exercise.name}
                </span>
                {added ? (
                  <span className="shrink-0 text-xs font-medium text-emerald-400">Added</span>
                ) : (
                  <Plus size={20} className="shrink-0 text-gray-500" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
