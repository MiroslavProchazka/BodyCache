import { useQuery } from '@evolu/react'
import { sessionSetsForDistribution } from '@/evolu/queries'
import type { WorkoutSessionId } from '@/evolu/schema'
import { Divider } from '@/shared/components/Divider'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { SplitBar } from '@/shared/components/SplitBar'
import { muscleSplit } from './weeklyStats'

/**
 * Live "muscle split" for the active workout (SPEC §5.7): a flat section of
 * labeled horizontal bars showing the session's volume share by body part,
 * derived each render from the in-progress sets — no separate state. Hides
 * entirely until a set carries volume, so it never shows an empty rail.
 */
export function MuscleDistributionCard({ sessionId }: { sessionId: WorkoutSessionId }) {
  const sets = useQuery(sessionSetsForDistribution(sessionId))
  const split = muscleSplit(sets)
  if (split.length === 0) return null

  return (
    <>
      <Divider className="my-5" />
      <SectionHeader>Muscle split · This session</SectionHeader>
      <div className="flex flex-col gap-[10px]">
        {split.map((s) => (
          <SplitBar key={s.key} label={s.label} percent={s.percent} strong={s.strong} />
        ))}
      </div>
    </>
  )
}
