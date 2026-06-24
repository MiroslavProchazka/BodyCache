import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, Medal } from 'lucide-react'
import { finishedWorkoutSessions, completedSetsForSession, finishedSessionSets } from '@/evolu/queries'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { WorkoutSessionId } from '@/evolu/schema'
import { Button } from '@/shared/components/Button'
import { StatTile } from '@/shared/components/StatTile'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { summarizeSession } from './sessionSummary'
import { sessionPersonalRecords, prBadgeLabel } from './sessionPrs'

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
  const allSets = useQuery(finishedSessionSets)
  const summary = summarizeSession(rows)
  const durationSec = finishedDurationSec(session)
  const duration = durationSec != null ? formatDurationSec(durationSec) : '—'
  const prLabel = prBadgeLabel(
    sessionPersonalRecords(String(session.id as WorkoutSessionId), allSets),
  )

  return (
    <div className="flex flex-col items-center px-5 pb-[130px] pt-[30px] text-center">
      <div
        className="mb-5 flex h-[72px] w-[72px] items-center justify-center bg-gradient-to-br from-neon to-brand text-ink"
        style={{ borderRadius: '24px 24px 24px 6px' }}
      >
        <Check size={36} strokeWidth={2} />
      </div>
      <h1 className="mb-[6px] font-display text-[30px] font-bold tracking-tight text-white">
        Nice work.
      </h1>
      <p className="mb-[26px] max-w-[280px] text-[15px] text-muted">
        Cached. Everything's saved — next time we'll remind you exactly where you left off.
      </p>

      {prLabel && (
        <div
          className="mb-[18px] flex items-center gap-[7px] rounded-full border px-[14px] py-[8px] text-[13.5px] font-semibold text-pr"
          style={{ borderColor: 'rgba(242,160,101,.28)', background: 'rgba(242,160,101,.14)' }}
        >
          <Medal size={16} strokeWidth={1.9} />
          {prLabel}
        </div>
      )}

      <div className="mb-[14px] w-full rounded-[22px] border border-white/[0.07] bg-surface p-[18px] text-left">
        <div className="mb-[14px] font-display text-[20px] font-semibold text-white">
          {summary.name}
        </div>
        <div className="flex gap-[10px]">
          <StatTile value={duration} label="duration" />
          <StatTile value={summary.setCount} label="sets" />
          <StatTile value={formatVolume(summary.volumeKg, unit)} label={unit} />
        </div>
      </div>

      <Button fullWidth onClick={() => navigate('/')}>
        Done
      </Button>
    </div>
  )
}
