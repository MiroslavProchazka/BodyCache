import { useQuery } from '@evolu/react'
import { completedSetsForSession } from '@/evolu/queries'
import type { WorkoutSessionId } from '@/evolu/schema'
import { Divider } from '@/shared/components/Divider'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { SplitBar } from '@/shared/components/SplitBar'
import { bodyPartSplit } from './weeklyStats'

/**
 * "Muscle split · this session" (mock 3b): a flat set of labeled bars showing
 * the volume share by body part for the exercises logged so far. Derived each
 * render from the session's completed sets — no separate state, no body map.
 * Renders nothing until at least one set is logged.
 */
export function MuscleDistributionCard({ sessionId }: { sessionId: WorkoutSessionId }) {
  const sets = useQuery(completedSetsForSession(sessionId))
  const split = bodyPartSplit(sets)

  if (split.length === 0) return null

  return (
    <>
      <Divider className="my-[18px]" />
      <SectionHeader>Muscle split · This session</SectionHeader>
      <div className="flex flex-col gap-[10px]">
        {split.map((s) => (
          <SplitBar key={s.key} label={s.label} percent={s.percent} strong={s.strong} />
        ))}
      </div>
    </>
  )
}
