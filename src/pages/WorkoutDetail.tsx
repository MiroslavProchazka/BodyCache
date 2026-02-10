import { useParams } from 'react-router-dom'
import { EmptyState } from '../components/Workout/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getWorkoutSessionById } from '../domain/workoutSession'

type WorkoutDetailProps = {
  mode?: 'history'
}

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const WorkoutDetail = ({ mode }: WorkoutDetailProps) => {
  const { sessionId } = useParams()

  if (mode === 'history') {
    return (
      <EmptyState
        title="Workout history"
        description="Milestone 3 will add session list and detail with computed volume"
        actionLabel="History arrives in M3"
      />
    )
  }

  if (!sessionId) {
    return (
      <EmptyState
        title="Workout detail"
        description="Pick a workout session to inspect added exercises and logged sets"
        actionLabel="Session detail"
      />
    )
  }

  const session = getWorkoutSessionById(sessionId)

  if (!session) {
    return (
      <EmptyState
        title="Session not found"
        description="This session is not present in local storage on this device"
        actionLabel="Back to active workout"
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{session.name}</CardTitle>
        <CardDescription>
          Started {formatDateTime(session.startedAt)}
          {session.endedAt ? `, finished ${formatDateTime(session.endedAt)}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {session.exercises.length === 0 ? (
          <p className="text-sm text-muted-foreground">No exercises were added in this session</p>
        ) : (
          <ol className="space-y-2 text-sm">
            {session.exercises.map((exercise) => (
              <li className="rounded-md border border-border p-2" key={exercise.id}>
                <span className="font-medium">{exercise.orderIndex + 1}. </span>
                <span>{exercise.name}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}
