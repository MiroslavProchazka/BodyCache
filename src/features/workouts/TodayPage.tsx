import { useQuery } from '@evolu/react'
import { Dumbbell } from 'lucide-react'
import { activeWorkoutSession } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import { Button } from '@/shared/components/Button'
import { EmptyState } from '@/shared/components/EmptyState'
import { ActiveWorkout } from './ActiveWorkout'

/**
 * The "Today" tab. Shows the in-progress workout if one is active, otherwise a
 * single tap to start logging. Starting a workout is instant and offline —
 * never blocked on network or login.
 */
export function TodayPage() {
  const sessions = useQuery(activeWorkoutSession)
  const { startWorkoutSession } = useBodyCacheMutations()
  const active = sessions[0]

  if (active) return <ActiveWorkout session={active} />

  return (
    <div className="mx-auto flex max-w-xl flex-col px-4 py-5">
      <h1 className="text-2xl font-bold tracking-tight text-gray-100">Today</h1>
      <EmptyState
        Icon={Dumbbell}
        title="Ready to lift"
        description="Start a workout, then add exercises and log your sets. BodyCache remembers the rest."
        action={
          <Button onClick={() => startWorkoutSession()}>Start workout</Button>
        }
      />
    </div>
  )
}
