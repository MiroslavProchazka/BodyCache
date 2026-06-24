import { useQuery } from '@evolu/react'
import { sessionSetsForDistribution } from '@/evolu/queries'
import type { WorkoutSessionId } from '@/evolu/schema'
import { totalVolumeKg } from '@/shared/utils/workoutStats'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { BodyMap } from '@/features/exercises/BodyMap'
import {
  muscleDistribution,
  distributionLegend,
  type DistInput,
} from '@/features/exercises/muscleDistribution'

/**
 * Live "muscles worked today" card at the top of the active workout. As sets
 * are logged, the body fills with neon and a legend lists the directly worked
 * muscles by set count. Derived each render from the in-progress session — no
 * separate state.
 */
export function MuscleDistributionCard({ sessionId }: { sessionId: WorkoutSessionId }) {
  const { unit } = useUnits()
  const sets = useQuery(sessionSetsForDistribution(sessionId))

  // Group the flat set rows back into per-exercise entries for the aggregation.
  const byExercise = new Map<string, DistInput>()
  for (const s of sets) {
    const key = s.exerciseId ?? s.exerciseName ?? ''
    const existing = byExercise.get(key)
    if (existing) existing.sets += 1
    else byExercise.set(key, { name: s.exerciseName, bodyPart: s.bodyPart, sets: 1 })
  }

  const dist = muscleDistribution([...byExercise.values()])
  const legend = distributionLegend(dist)
  const totalSets = sets.length
  const volumeKg = totalVolumeKg(sets)

  return (
    <div
      className="mb-4 px-4 pb-4 pt-[18px]"
      style={{ background: '#16181a', borderRadius: '20px' }}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
          Muscles worked today
        </div>
        <div className="flex items-end gap-4">
          <div className="text-right">
            <span className="font-display text-base font-semibold tnum text-white">
              {totalSets}
            </span>{' '}
            <span className="text-[11px] text-faint">sets</span>
          </div>
          <div className="text-right">
            <span className="font-display text-base font-semibold tnum text-white">
              {formatVolume(volumeKg, unit)}
            </span>{' '}
            <span className="text-[11px] text-faint">{unit}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-fit">
        <BodyMap view="both" levels={dist.levels} fw={82} />
      </div>

      {legend.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-center gap-[7px]">
          {legend.map((item) => (
            <span
              key={item.muscle}
              className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-full bg-inset px-[11px] py-[6px] text-[12.5px] font-semibold text-soft"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: `rgba(73,79,223,${(0.35 + 0.65 * item.intensity).toFixed(2)})`,
                }}
              />
              {item.label}
              <span className="text-faint">{item.sets}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-center text-[12.5px] leading-[1.45] text-faint">
          Complete sets and the muscles you train light up here.
        </p>
      )}
    </div>
  )
}
