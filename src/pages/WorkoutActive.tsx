import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { seedExercises } from '../db/seedExercises'
import { addExerciseToWorkoutSession, finishWorkoutSession, renameWorkoutSession, startWorkoutSession } from '../db/mutations'
import {
  createDefaultWorkoutName,
  getActiveWorkoutSession,
  getRecentWorkoutSessions,
  type LocalWorkoutSession
} from '../domain/workoutSession'

type ExerciseOption = {
  id: string
  name: string
}

const createExerciseId = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const exerciseCatalog: ExerciseOption[] = seedExercises.map((exercise) => ({
  id: createExerciseId(exercise.name),
  name: exercise.name
}))

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const WorkoutActive = () => {
  const [activeSession, setActiveSession] = useState<LocalWorkoutSession | null>(() => getActiveWorkoutSession())
  const [sessionName, setSessionName] = useState(() => getActiveWorkoutSession()?.name ?? createDefaultWorkoutName())
  const [recentSessions, setRecentSessions] = useState(() => getRecentWorkoutSessions().slice(0, 5))
  const [exerciseSearch, setExerciseSearch] = useState('')

  const availableExercises = useMemo(() => {
    if (!activeSession) return []

    const alreadyAdded = new Set(activeSession.exercises.map((exercise) => exercise.exerciseId))
    const normalizedSearch = exerciseSearch.trim().toLowerCase()

    return exerciseCatalog
      .filter((exercise) => !alreadyAdded.has(exercise.id))
      .filter((exercise) =>
        normalizedSearch.length === 0 ? true : exercise.name.toLowerCase().includes(normalizedSearch)
      )
      .slice(0, 6)
  }, [activeSession, exerciseSearch])

  const onStartSession = async () => {
    const session = await startWorkoutSession(sessionName)
    setActiveSession(session)
    setSessionName(session.name)
  }

  const onRenameSession = (nextName: string) => {
    setSessionName(nextName)
    const renamedSession = renameWorkoutSession(nextName)
    if (renamedSession) {
      setActiveSession(renamedSession)
    }
  }

  const onAddExercise = (exerciseId: string, exerciseName: string) => {
    const updatedSession = addExerciseToWorkoutSession(exerciseId, exerciseName)
    if (!updatedSession) return

    setActiveSession(updatedSession)
    setExerciseSearch('')
  }

  const onQuickAddFirstMatch = () => {
    const firstMatch = availableExercises[0]
    if (!firstMatch) return
    onAddExercise(firstMatch.id, firstMatch.name)
  }

  const onFinishSession = () => {
    const finishedSession = finishWorkoutSession()
    if (!finishedSession) return

    setActiveSession(null)
    setSessionName(createDefaultWorkoutName())
    setExerciseSearch('')
    setRecentSessions(getRecentWorkoutSessions().slice(0, 5))
  }

  if (!activeSession) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Start workout session</CardTitle>
            <CardDescription>Start a session, autosave edits, and continue anytime from this device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="session-name">
                Session name
              </label>
              <Input
                id="session-name"
                onChange={(event) => setSessionName(event.target.value)}
                placeholder="Push Day"
                value={sessionName}
              />
            </div>
            <Button onClick={onStartSession} type="button">
              Start session
            </Button>
          </CardContent>
        </Card>

        {recentSessions.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent sessions</CardTitle>
              <CardDescription>Locally completed sessions in this browser</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {recentSessions.map((session) => (
                  <li className="rounded-md border border-border p-2" key={session.id}>
                    <div className="font-medium">{session.name}</div>
                    <div className="text-muted-foreground">Started {formatDateTime(session.startedAt)}</div>
                    <div className="text-muted-foreground">Exercises {session.exercises.length}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Current session</CardTitle>
          <CardDescription>Inline edits are autosaved instantly on every change</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="session-name">
              Session name
            </label>
            <Input id="session-name" onChange={(event) => onRenameSession(event.target.value)} value={sessionName} />
          </div>
          <p className="text-sm text-muted-foreground">Started {formatDateTime(activeSession.startedAt)}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild type="button" variant="outline">
              <Link to={`/workout/${activeSession.id}`}>Open detail</Link>
            </Button>
            <Button onClick={onFinishSession} type="button">
              Finish session
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add exercises</CardTitle>
          <CardDescription>Search from the seed exercise list and add in workout order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="exercise-search">
              Exercise search
            </label>
            <Input
              id="exercise-search"
              onChange={(event) => setExerciseSearch(event.target.value)}
              placeholder="Bench press"
              value={exerciseSearch}
            />
          </div>
          <Button onClick={onQuickAddFirstMatch} type="button" variant="outline">
            Add first match
          </Button>
          {availableExercises.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {availableExercises.map((exercise) => (
                <li className="flex items-center justify-between rounded-md border border-border px-3 py-2" key={exercise.id}>
                  <span className="text-sm">{exercise.name}</span>
                  <Button onClick={() => onAddExercise(exercise.id, exercise.name)} size="sm" type="button" variant="secondary">
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No more matching exercises available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session exercises</CardTitle>
          <CardDescription>Current order for this workout</CardDescription>
        </CardHeader>
        <CardContent>
          {activeSession.exercises.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exercises added yet</p>
          ) : (
            <ol className="space-y-2 text-sm">
              {activeSession.exercises.map((exercise) => (
                <li className="rounded-md border border-border p-2" key={exercise.id}>
                  <span className="font-medium">{exercise.orderIndex + 1}. </span>
                  <span>{exercise.name}</span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
