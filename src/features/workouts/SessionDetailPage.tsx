import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { sessionById, sessionSetsDetailed } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionRow, SessionDetailSetRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, WorkoutSessionId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Overline } from '@/shared/components/Overline'
import { StatTile } from '@/shared/components/StatTile'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { humanize } from '@/shared/utils/bodyParts'
import { formatRelativeDay } from '@/shared/utils/dates'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatVolume, formatSetSummary } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { summarizeSession } from './sessionSummary'
import { groupExerciseSets, type SessionExerciseGroup } from './historyStats'
import { SetTypeTag } from './SetTypeTag'

/** A finished workout's full recap: stats plus the per-exercise set breakdown. */
export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const session = useQuery(sessionById((id ?? '') as WorkoutSessionId))[0] as
    | WorkoutSessionRow
    | undefined

  if (!session || session.status !== 'finished') {
    return (
      <div className="px-5 py-16 text-center text-muted">
        <p>Workout not found.</p>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="mt-3 font-semibold text-neon"
        >
          Back to history
        </button>
      </div>
    )
  }
  return <SessionDetailInner session={session} />
}

function SessionDetailInner({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const { deleteWorkoutSession } = useBodyCacheMutations()
  const rows = useQuery(sessionSetsDetailed(session.id as WorkoutSessionId)) as readonly SessionDetailSetRow[]

  const summary = summarizeSession(rows)
  const groups = groupExerciseSets(rows)
  const durationSec = finishedDurationSec(session)
  const duration = durationSec != null ? formatDurationSec(durationSec) : '—'

  const handleDelete = () => {
    if (!window.confirm('Delete this workout from history? This can\'t be undone.')) return
    deleteWorkoutSession(session.id as WorkoutSessionId)
    navigate('/history', { replace: true })
  }

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <header className="mb-4 flex items-center gap-3">
        <CircleButton onClick={() => navigate('/history')} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[20px] font-semibold leading-[1.1] tracking-tight text-white">
            {summary.name}
          </div>
          <div className="mt-[2px] truncate text-[12.5px] text-muted">
            {session.startedAt ? formatRelativeDay(session.startedAt) : '—'}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Delete workout"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/10 bg-surface text-faint"
        >
          <Trash2 size={18} strokeWidth={1.75} />
        </button>
      </header>

      <div className="mb-[26px] flex gap-[10px]">
        <StatTile value={duration} label="duration" />
        <StatTile value={summary.setCount} label="sets" />
        <StatTile value={formatVolume(summary.volumeKg, unit)} label={`${unit} lifted`} />
      </div>

      {groups.length > 0 ? (
        <>
          <Overline className="mb-3">Exercises</Overline>
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <ExerciseBreakdown
                key={group.workoutExerciseId}
                group={group}
                onClick={() =>
                  group.exerciseId &&
                  navigate(`/library/${group.exerciseId as ExerciseId}`)
                }
              />
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-[18px] border border-white/[0.07] bg-surface px-4 py-6 text-center text-sm text-muted">
          No completed sets were logged in this workout.
        </p>
      )}
    </div>
  )
}

/** One exercise's photo, name, set count and set chips. Taps to its detail. */
function ExerciseBreakdown({
  group,
  onClick,
}: {
  group: SessionExerciseGroup
  onClick: () => void
}) {
  const { unit } = useUnits()
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[20px] border border-white/[0.07] bg-surface p-4 text-left"
    >
      <div className="mb-[13px] flex items-center gap-[13px]">
        <ExerciseTile
          photoId={group.primaryPhotoId as ExercisePhotoId | null}
          bodyPart={group.bodyPart}
          radius="14px"
          className="h-[46px] w-[46px] flex-none"
          glyphSize={23}
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-semibold tracking-tight text-white">
            {group.name}
          </div>
          <div className="mt-[2px] truncate text-[12.5px] text-muted">
            {group.sets.length} {group.sets.length === 1 ? 'set' : 'sets'}
            {group.bodyPart ? ` · ${humanize(group.bodyPart)}` : ''}
          </div>
        </div>
        <ChevronRight size={18} strokeWidth={1.75} className="flex-none text-faint" />
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {group.sets.map((s) => (
          <span
            key={s.id}
            className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-[9px] bg-inset px-[10px] py-[6px] text-[12.5px] font-semibold tnum text-soft"
          >
            {formatSetSummary(s, group.type, unit, true)}
            <SetTypeTag value={s.setType} />
          </span>
        ))}
      </div>
    </button>
  )
}
