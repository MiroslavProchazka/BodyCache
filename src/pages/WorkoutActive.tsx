import { EmptyState } from '../components/Workout/EmptyState'

export const WorkoutActive = () => {
  return (
    <EmptyState
      title="Active workout"
      description="Milestone 1 will add session creation, set logging, inline edits, and last-time hints"
      actionLabel="Start session flow in M1"
    />
  )
}
