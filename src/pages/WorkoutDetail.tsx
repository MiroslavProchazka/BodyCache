import { EmptyState } from '../components/Workout/EmptyState'

type WorkoutDetailProps = {
  mode?: 'history'
}

export const WorkoutDetail = ({ mode }: WorkoutDetailProps) => {
  if (mode === 'history') {
    return (
      <EmptyState
        title="Workout history"
        description="Milestone 3 will add session list and detail with computed volume"
        actionLabel="History arrives in M3"
      />
    )
  }

  return (
    <EmptyState
      title="Workout detail"
      description="Session detail and per-exercise set timeline lands in milestone 3"
      actionLabel="Session detail in M3"
    />
  )
}
