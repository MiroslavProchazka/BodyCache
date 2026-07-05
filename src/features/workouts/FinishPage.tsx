import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, Clock, Dumbbell } from 'lucide-react'
import {
  finishedWorkoutSessions,
  completedSetsForSession,
  finishedSessionSets,
  sessionSetsForDistribution,
} from '@/evolu/queries'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { WorkoutSessionId } from '@/evolu/schema'
import { Divider } from '@/shared/components/Divider'
import { HeroStat } from '@/shared/components/HeroStat'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { SplitBar } from '@/shared/components/SplitBar'
import { MetaChip, PrChip } from '@/shared/components/Chips'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatVolume, formatWeight } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { summarizeSession, exerciseBreakdown } from './sessionSummary'
import { muscleSplit } from './weeklyStats'
import { sessionPersonalRecords } from './sessionPrs'

/** How many exercise rows to list before collapsing the rest into a summary row. */
const MAX_ROWS = 5

/** Confirmation + recap shown right after finishing a workout. */
export function FinishPage() {
  const location = useLocation()
  const finished = useQuery(finishedWorkoutSessions)
  const stateId = (location.state as { sessionId?: WorkoutSessionId } | null)?.sessionId
  const session =
    (stateId && finished.find((s) => String(s.id) === String(stateId))) || finished[0]

  if (!session) return <Navigate to="/" replace />
  return <FinishInner session={session as WorkoutSessionRow} />
}

function FinishInner({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const rows = useQuery(completedSetsForSession(session.id as WorkoutSessionId))
  const detail = useQuery(sessionSetsForDistribution(session.id as WorkoutSessionId))
  const allSets = useQuery(finishedSessionSets)

  const summary = summarizeSession(rows)
  const breakdown = exerciseBreakdown(detail)
  const split = muscleSplit(detail)
  const durationSec = finishedDurationSec(session)
  const duration = durationSec != null ? formatDurationSec(durationSec) : null
  const prs = sessionPersonalRecords(String(session.id as WorkoutSessionId), allSets)
  const prExercises = new Set(prs.map((p) => p.exerciseId))

  // Collapse a long list: show the first few, roll the rest into one summary row.
  const truncated = breakdown.length > MAX_ROWS
  const shown = truncated ? breakdown.slice(0, MAX_ROWS - 1) : breakdown

  return (
    <>
      <div className="px-[22px] pb-[130px] pt-[24px]">
        <div className="mb-[14px] text-[11px] font-semibold uppercase tracking-[0.09em] text-[#8b90f7]">
          Workout complete
        </div>

        <HeroStat
          intro="You lifted"
          value={formatVolume(summary.volumeKg, unit)}
          unit={unit}
          chips={
            <>
              <MetaChip icon={<Dumbbell size={13} strokeWidth={2} />}>
                {summary.exerciseCount} {summary.exerciseCount === 1 ? 'exercise' : 'exercises'}
              </MetaChip>
              {duration && <MetaChip icon={<Clock size={13} strokeWidth={2} />}>{duration}</MetaChip>}
              {prs.length > 0 && <PrChip>{`${prs.length} PR${prs.length === 1 ? '' : 's'}`}</PrChip>}
            </>
          }
        />

        {split.length > 0 && (
          <>
            <Divider className="my-6" />
            <SectionHeader>By muscle</SectionHeader>
            <div className="flex flex-col gap-[10px]">
              {split.map((s) => (
                <SplitBar key={s.key} label={s.label} percent={s.percent} strong={s.strong} />
              ))}
            </div>
          </>
        )}

        {breakdown.length > 0 && (
          <>
            <Divider className="my-6" />
            <SectionHeader>Exercises · {summary.exerciseCount}</SectionHeader>
            <div className="flex flex-col gap-[16px]">
              {shown.map((ex) => (
                <div key={ex.exerciseId} className="flex items-center gap-[13px]">
                  <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold text-white">
                    {ex.name}
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-semibold tnum text-muted">
                    {ex.setCount} {ex.setCount === 1 ? 'set' : 'sets'}
                    {ex.topWeightKg != null ? ` · ${formatWeight(ex.topWeightKg, unit)}` : ''}
                  </span>
                  {prExercises.has(ex.exerciseId) && <PrChip>PR</PrChip>}
                </div>
              ))}
              {truncated && (
                <div className="flex items-center gap-[13px]">
                  <span className="flex-1 text-[14.5px] font-semibold text-muted">
                    + {breakdown.length - (MAX_ROWS - 1)} more
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-semibold tnum text-faint">
                    {summary.setCount} sets total
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <FloatingAction>
        <ActionPill
          label="Done"
          icon={<Check size={19} strokeWidth={2} />}
          onClick={() => navigate('/')}
        />
      </FloatingAction>
    </>
  )
}
