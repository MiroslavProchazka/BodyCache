import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, Clock, Layers } from 'lucide-react'
import {
  finishedWorkoutSessions,
  completedSetsForSession,
  finishedSessionSets,
} from '@/evolu/queries'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { ExerciseType, WorkoutSessionId } from '@/evolu/schema'
import { Divider } from '@/shared/components/Divider'
import { HeroStat } from '@/shared/components/HeroStat'
import { Overline } from '@/shared/components/Overline'
import { PrChip } from '@/shared/components/Chips'
import { SplitBar } from '@/shared/components/SplitBar'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatSetSummary, formatVolume } from '@/shared/utils/units'
import { bestSet, workingSets } from '@/shared/utils/exerciseStats'
import { useUnits } from '@/shared/units/UnitsContext'
import { summarizeSession } from './sessionSummary'
import { sessionPersonalRecords } from './sessionPrs'
import { bodyPartSplit } from './weeklyStats'

/** Confirmation + recap shown right after finishing a workout (mock 3b). */
export function FinishPage() {
  const location = useLocation()
  const finished = useQuery(finishedWorkoutSessions)
  const stateId = (location.state as { sessionId?: WorkoutSessionId } | null)?.sessionId
  const session =
    (stateId && finished.find((s) => String(s.id) === String(stateId))) || finished[0]

  if (!session) return <Navigate to="/" replace />
  return <FinishInner session={session as WorkoutSessionRow} />
}

const chip =
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-neon/[0.16] px-[10px] py-1 text-[12px] font-bold text-[#8b90f7]'

function FinishInner({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const rows = useQuery(completedSetsForSession(session.id as WorkoutSessionId))
  const allSets = useQuery(finishedSessionSets)
  const summary = summarizeSession(rows)
  const durationSec = finishedDurationSec(session)
  const duration = durationSec != null ? formatDurationSec(durationSec) : '—'

  const sessionSets = allSets.filter((s) => String(s.sessionId) === String(session.id))
  const split = bodyPartSplit(sessionSets)
  const prIds = new Set(
    sessionPersonalRecords(String(session.id as WorkoutSessionId), allSets).map((p) => p.exerciseId),
  )
  const prCount = prIds.size

  // Per-exercise recap rows, in workout order.
  const byExercise = new Map<
    string,
    { name: string; type: ExerciseType; order: number; sets: typeof sessionSets }
  >()
  for (const s of sessionSets) {
    if (!s.exerciseId) continue
    const key = String(s.exerciseId)
    const g = byExercise.get(key)
    if (g) g.sets.push(s)
    else
      byExercise.set(key, {
        name: String(s.exerciseName ?? 'Exercise'),
        type: (s.exerciseType as ExerciseType) ?? 'strength',
        order: Number(s.exerciseOrder ?? 0),
        sets: [s],
      })
  }
  const exercises = [...byExercise.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([id, g]) => {
      const best = bestSet(workingSets(g.sets), g.type)
      return {
        id,
        name: g.name,
        count: g.sets.length,
        value: best ? formatSetSummary(best, g.type, unit) : '—',
        isPr: prIds.has(id),
      }
    })

  return (
    <>
      <div className="px-[22px] pb-[130px] pt-[26px]">
        <h1 className="mb-[14px] font-display text-[28px] font-bold tracking-tight text-white">
          Nice work.
        </h1>

        <HeroStat
          intro="You lifted"
          value={formatVolume(summary.volumeKg, unit)}
          unit={unit}
          chips={
            <>
              <span className={chip}>
                <Clock size={13} strokeWidth={2} />
                {duration}
              </span>
              <span className={chip}>
                <Layers size={13} strokeWidth={2} />
                {summary.setCount} {summary.setCount === 1 ? 'set' : 'sets'}
              </span>
              {prCount > 0 && <PrChip>{`${prCount} PR${prCount === 1 ? '' : 's'}`}</PrChip>}
            </>
          }
        />

        {split.length > 0 && (
          <>
            <Divider className="my-[18px]" />
            <Overline className="mb-3">By muscle</Overline>
            <div className="flex flex-col gap-[10px]">
              {split.map((s) => (
                <SplitBar key={s.key} label={s.label} percent={s.percent} strong={s.strong} />
              ))}
            </div>
          </>
        )}

        {exercises.length > 0 && (
          <>
            <Divider className="my-[18px]" />
            <Overline className="mb-[14px]">Exercises</Overline>
            <div className="flex flex-col gap-4">
              {exercises.map((e) => (
                <div key={e.id} className="flex items-center gap-[13px]">
                  <span className="min-w-0 flex-1 truncate text-[14.5px] font-semibold text-white">
                    {e.name}
                  </span>
                  <span className="whitespace-nowrap text-[13px] font-semibold tnum text-muted">
                    {e.count} × {e.value}
                  </span>
                  {e.isPr && <PrChip>PR</PrChip>}
                </div>
              ))}
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
