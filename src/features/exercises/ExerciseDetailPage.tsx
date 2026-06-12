import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Trash2, Trophy, LineChart } from 'lucide-react'
import { evolu } from '@/evolu/evolu'
import { exerciseById, completedSetsForExercise, activeWorkoutSession } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Overline } from '@/shared/components/Overline'
import { StickyAction } from '@/shared/components/StickyAction'
import { Button } from '@/shared/components/Button'
import { metaLine } from '@/shared/utils/bodyParts'
import { formatRelativeDay } from '@/shared/utils/dates'
import { formatWeight, formatSetSummary } from '@/shared/utils/units'
import {
  bestSet,
  groupSessions,
  sessionTrend,
  averageTopWeightKg,
  workingSets,
} from '@/shared/utils/exerciseStats'
import { useUnits } from '@/shared/units/UnitsContext'
import { SetTypeTag } from '@/features/workouts/SetTypeTag'
import { ExerciseTile } from './ExerciseTile'
import { TrendBadge } from './TrendBadge'
import { toHistorySets } from './history'

/** Everything about one exercise — best, average, last, and full history. */
export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { unit } = useUnits()
  const { softDeleteExercise, startWorkoutSession } = useBodyCacheMutations()
  const exercise = useQuery(exerciseById((id ?? '') as ExerciseId))[0]
  const history = toHistorySets(useQuery(completedSetsForExercise((id ?? '') as ExerciseId)))

  if (!exercise) {
    return (
      <div className="px-5 py-16 text-center text-muted">
        <p>Exercise not found.</p>
        <button
          type="button"
          onClick={() => navigate('/library')}
          className="mt-3 font-semibold text-neon"
        >
          Back to library
        </button>
      </div>
    )
  }

  const type = exercise.type as ExerciseType
  // Records ignore warm-up sets; the session list below still shows them.
  const records = workingSets(history)
  const groups = groupSessions(history)
  const best = bestSet(records, type)
  const avg = averageTopWeightKg(records, type)
  const trend = sessionTrend(records, type)
  const last = groups[0]

  const handleDelete = () => {
    if (!window.confirm(`Delete "${exercise.name}"? This can't be undone.`)) return
    softDeleteExercise(exercise.id as ExerciseId)
    navigate('/library', { replace: true })
  }

  /** Start (or continue) a workout and open the logger for this exercise. */
  const handleLogToday = async () => {
    const active = await evolu.loadQuery(activeWorkoutSession)
    if (!active[0]) {
      const started = startWorkoutSession()
      if (!started.ok) return
    }
    navigate(`/workout/log/${exercise.id as ExerciseId}`)
  }

  return (
    <>
      <div className="px-5 pb-[150px] pt-[6px]">
        <header className="mb-4 flex items-center gap-3">
          <CircleButton onClick={() => navigate('/library')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-[20px] font-semibold leading-[1.1] tracking-tight text-white">
              {exercise.name}
            </div>
            <div className="mt-[2px] truncate text-[12.5px] text-muted">
              {metaLine(exercise.bodyPart, exercise.equipment)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete exercise"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/10 bg-surface text-faint"
          >
            <Trash2 size={18} strokeWidth={1.75} />
          </button>
        </header>

        <ExerciseTile
          photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
          bodyPart={exercise.bodyPart}
          radius="24px 24px 24px 6px"
          className="mb-4 h-[150px] w-full"
          glyphSize={56}
          full
        />

        <div className="mb-4 flex gap-[10px]">
          <div className="flex-1 rounded-2xl border border-white/[0.07] bg-surface p-[13px]">
            <div className="mb-2 flex items-center gap-[6px] text-[11px] font-semibold uppercase tracking-[0.06em] text-neon">
              <Trophy size={14} strokeWidth={1.75} />
              Best
            </div>
            <div className="font-display text-[19px] font-semibold tnum text-white">
              {best ? formatSetSummary(best, type, unit) : '—'}
            </div>
          </div>
          <div className="flex-1 rounded-2xl border border-white/[0.07] bg-surface p-[13px]">
            <div className="mb-2 flex items-center gap-[6px] text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
              <LineChart size={14} strokeWidth={1.75} />
              Average
            </div>
            <div className="font-display text-[19px] font-semibold tnum text-white">
              {avg != null ? formatWeight(avg, unit) : '—'}
            </div>
          </div>
        </div>

        {last && (
          <div className="mb-4 rounded-[18px] border border-white/[0.07] bg-surface p-[15px]">
            <div className="mb-[13px] flex items-center justify-between">
              <Overline className="whitespace-nowrap">
                Last performance · {formatRelativeDay(last.startedAt)}
              </Overline>
              {(trend.dir === 'up' || trend.dir === 'down') && (
                <TrendBadge trend={trend} unit={unit} size={15} />
              )}
            </div>
            <div className="flex flex-wrap gap-[7px]">
              {last.sets.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-[6px] whitespace-nowrap rounded-[9px] bg-inset px-[11px] py-[7px] text-[13px] font-semibold tnum text-soft"
                >
                  {formatSetSummary(s, type, unit, true)}
                  <SetTypeTag value={s.setType} />
                </span>
              ))}
            </div>
          </div>
        )}

        {groups.length > 0 ? (
          <>
            <Overline className="mb-3">History</Overline>
            <div className="flex flex-col gap-[10px]">
              {groups.map((g) => {
                const top = bestSet(workingSets(g.sets), type)
                return (
                  <div
                    key={g.sessionId}
                    className="flex items-center justify-between rounded-[14px] border border-white/[0.07] bg-surface px-[15px] py-[13px]"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {formatRelativeDay(g.startedAt)}
                      </div>
                      <div className="mt-[2px] text-xs text-muted">
                        {g.sets.length} sets
                        {top?.reps != null ? ` · top ${top.reps} reps` : ''}
                      </div>
                    </div>
                    {top?.weightKg != null && (
                      <div className="font-display text-base font-semibold tnum text-white">
                        {formatWeight(top.weightKg, unit)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <p className="rounded-[18px] border border-white/[0.07] bg-surface px-4 py-6 text-center text-sm text-muted">
            No history yet. Log this exercise in a workout to see your best, average and trend
            here.
          </p>
        )}
      </div>

      <StickyAction>
        <Button fullWidth onClick={handleLogToday}>
          Log today
        </Button>
      </StickyAction>
    </>
  )
}
