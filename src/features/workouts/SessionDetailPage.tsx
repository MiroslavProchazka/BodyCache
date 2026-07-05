import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Clock, Layers, RotateCcw } from 'lucide-react'
import { sessionById, sessionSetsDetailed, finishedSessionSets } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionRow, SessionDetailSetRow, FinishedSessionSetRow } from '@/evolu/rows'
import type { ExerciseId, WorkoutSessionId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Divider } from '@/shared/components/Divider'
import { HeroStat } from '@/shared/components/HeroStat'
import { Overline } from '@/shared/components/Overline'
import { MetaChip, PrChip } from '@/shared/components/Chips'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { useRepeatWorkout } from './useRepeatWorkout'
import { formatRelativeDay } from '@/shared/utils/dates'
import { finishedDurationSec, formatDurationSec } from '@/shared/utils/workoutStats'
import { formatVolume, formatSetSummary } from '@/shared/utils/units'
import { bestSet, workingSets } from '@/shared/utils/exerciseStats'
import { useUnits } from '@/shared/units/UnitsContext'
import { summarizeSession } from './sessionSummary'
import { groupExerciseSets, type SessionExerciseGroup } from './historyStats'
import { sessionPersonalRecords } from './sessionPrs'
import { SetTypeTag } from './SetTypeTag'

/** A finished workout's full recap: hero stats plus the per-exercise breakdown. */
export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const session = useQuery(sessionById((id ?? '') as WorkoutSessionId))[0] as
    | WorkoutSessionRow
    | undefined

  if (!session || session.status !== 'finished') {
    return (
      <div className="px-[22px] py-16 text-center text-muted">
        <p>Workout not found.</p>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="mt-3 font-semibold text-[#8b90f7]"
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
  const repeatWorkout = useRepeatWorkout()
  const rows = useQuery(
    sessionSetsDetailed(session.id as WorkoutSessionId),
  ) as readonly SessionDetailSetRow[]
  const allSets = useQuery(finishedSessionSets) as readonly FinishedSessionSetRow[]

  const summary = summarizeSession(rows)
  const groups = groupExerciseSets(rows)
  const durationSec = finishedDurationSec(session)
  const duration = durationSec != null ? formatDurationSec(durationSec) : null

  // Which exercises PR'd this session, and the single record set to badge in each.
  const prs = sessionPersonalRecords(String(session.id as WorkoutSessionId), allSets)
  const prExercises = new Set(prs.map((p) => p.exerciseId))
  const prSetIds = new Set<string>()
  for (const g of groups) {
    if (g.exerciseId && prExercises.has(g.exerciseId)) {
      const top = bestSet(workingSets(g.sets), g.type)
      if (top) prSetIds.add(String(top.id))
    }
  }

  const time = session.startedAt
    ? new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null
  const stamp = [session.startedAt ? formatRelativeDay(session.startedAt) : null, time]
    .filter(Boolean)
    .join(' · ')

  const handleDelete = () => {
    if (!window.confirm('Delete this workout from history? This can’t be undone.')) return
    deleteWorkoutSession(session.id as WorkoutSessionId)
    navigate('/history', { replace: true })
  }

  const handleRepeat = async () => {
    const sessionId = await repeatWorkout(session.id as WorkoutSessionId)
    if (sessionId) navigate('/workout')
  }

  return (
    <>
      <div className="px-[22px] pb-[150px] pt-[14px]">
        <header className="mb-[22px] flex items-center justify-between">
          <CircleButton onClick={() => navigate('/history')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <button
            type="button"
            onClick={() => navigate(`/history/${session.id as WorkoutSessionId}/edit`)}
            className="text-[13px] font-semibold text-[#8b90f7]"
          >
            Edit
          </button>
        </header>

        <Overline className="mb-[10px]">{stamp || '—'}</Overline>
        <h1 className="mb-4 font-display text-[26px] font-bold tracking-[-0.02em] text-white">
          {summary.name}
        </h1>
        <HeroStat
          value={formatVolume(summary.volumeKg, unit)}
          unit={unit}
          size={44}
          chips={
            <>
              {duration && <MetaChip icon={<Clock size={13} strokeWidth={2} />}>{duration}</MetaChip>}
              <MetaChip icon={<Layers size={13} strokeWidth={2} />}>
                {summary.setCount} {summary.setCount === 1 ? 'set' : 'sets'}
              </MetaChip>
              {prs.length > 0 && <PrChip>{`${prs.length} PR${prs.length === 1 ? '' : 's'}`}</PrChip>}
            </>
          }
        />

        {groups.length > 0 ? (
          groups.map((group) => (
            <ExerciseBreakdown
              key={group.workoutExerciseId}
              group={group}
              prSetIds={prSetIds}
              onOpen={() =>
                group.exerciseId && navigate(`/library/${group.exerciseId as ExerciseId}`)
              }
            />
          ))
        ) : (
          <>
            <Divider className="my-6" />
            <p className="text-[13.5px] text-muted">
              No completed sets were logged in this workout.
            </p>
          </>
        )}

        <Divider className="my-6" />
        <button
          type="button"
          onClick={handleDelete}
          className="text-[13.5px] font-semibold text-[#fa757e] active:scale-[0.99]"
        >
          Delete workout
        </button>
      </div>

      {groups.length > 0 && (
        <FloatingAction>
          <ActionPill
            label="Repeat workout"
            icon={<RotateCcw size={18} strokeWidth={2.2} />}
            onClick={handleRepeat}
          />
        </FloatingAction>
      )}
    </>
  )
}

/**
 * One exercise's contribution: a tappable name overline (→ exercise detail) and
 * its sets as flat `SET n` tabular rows, with a PR chip on the record set.
 */
function ExerciseBreakdown({
  group,
  prSetIds,
  onOpen,
}: {
  group: SessionExerciseGroup
  prSetIds: Set<string>
  onOpen: () => void
}) {
  const { unit } = useUnits()
  return (
    <div>
      <Divider className="my-6" />
      <button
        type="button"
        onClick={onOpen}
        disabled={!group.exerciseId}
        className="mb-3 block text-left"
      >
        <Overline>{group.name}</Overline>
      </button>
      <div className="flex flex-col gap-3">
        {group.sets.map((s, i) => (
          <div key={s.id} className="flex items-center gap-[13px]">
            <span className="w-[44px] flex-none text-[11px] font-semibold uppercase tracking-[0.06em] text-faint">
              Set {i + 1}
            </span>
            <SetTypeTag value={s.setType} />
            <span className="flex-1 text-[14.5px] font-semibold tnum text-white">
              {formatSetSummary(s, group.type, unit)}
            </span>
            {prSetIds.has(String(s.id)) && <PrChip>PR</PrChip>}
          </div>
        ))}
      </div>
    </div>
  )
}
