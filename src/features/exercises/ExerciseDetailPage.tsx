import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Plus } from 'lucide-react'
import { evolu } from '@/evolu/evolu'
import { exerciseById, completedSetsForExercise, activeWorkoutSession } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Divider } from '@/shared/components/Divider'
import { HeroStat } from '@/shared/components/HeroStat'
import { Overline } from '@/shared/components/Overline'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { metaLine } from '@/shared/utils/bodyParts'
import { formatRelativeDay } from '@/shared/utils/dates'
import {
  formatWeight,
  formatSetSummary,
  formatDuration,
  formatDistance,
  toDisplayWeight,
} from '@/shared/utils/units'
import {
  bestSet,
  groupSessions,
  sessionTrend,
  averageTopWeightKg,
  workingSets,
} from '@/shared/utils/exerciseStats'
import { bestOneRepMax } from '@/shared/utils/oneRepMax'
import { progressSeries } from '@/shared/utils/progress'
import { useUnits } from '@/shared/units/UnitsContext'
import { SetTypeTag } from '@/features/workouts/SetTypeTag'
import { ExerciseTile } from './ExerciseTile'
import { BodyMap } from './BodyMap'
import { bodyFor } from './muscleMap'
import { cuesFor } from './cues'
import { TrendBadge } from './TrendBadge'
import { ProgressChart } from './ProgressChart'
import { toHistorySets } from './history'

/** Everything about one exercise — best, average, last, and full history. */
export function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { unit } = useUnits()
  const { softDeleteExercise, startWorkoutSession } = useBodyCacheMutations()
  const exercise = useQuery(exerciseById((id ?? '') as ExerciseId))[0]
  const history = toHistorySets(useQuery(completedSetsForExercise((id ?? '') as ExerciseId)))

  // Progress | How to. Reset to Progress whenever a different exercise opens.
  const [tab, setTab] = useState<'progress' | 'howto'>('progress')
  useEffect(() => setTab('progress'), [id])

  if (!exercise) {
    return (
      <div className="px-[22px] py-16 text-center text-muted">
        <p>Exercise not found.</p>
        <button
          type="button"
          onClick={() => navigate('/library')}
          className="mt-3 font-semibold text-[#8b90f7]"
        >
          Back to library
        </button>
      </div>
    )
  }

  const type = exercise.type as ExerciseType
  const body = bodyFor(exercise)
  const photoId = exercise.primaryPhotoId as ExercisePhotoId | null
  // Records ignore warm-up sets; the session list below still shows them.
  const records = workingSets(history)
  const groups = groupSessions(history)
  const best = bestSet(records, type)
  const avg = averageTopWeightKg(records, type)
  const trend = sessionTrend(records, type)
  const last = groups[0]
  // Estimated 1RM only makes sense for loaded weight × reps efforts.
  const oneRm = type === 'strength' || type === 'freeform' ? bestOneRepMax(records) : null

  // The screen's hero number: estimated 1RM when it applies, else the best set.
  const heroWeightKg = oneRm ?? best?.weightKg ?? null
  const heroIntro = oneRm != null ? 'Estimated 1RM' : 'Best set'

  // One point per session for the progress chart (oldest → newest).
  const series = progressSeries(history, type)
  const formatMetric = (v: number): string => {
    switch (type) {
      case 'strength':
      case 'freeform':
        return formatWeight(v, unit)
      case 'bodyweight':
        return `${v} reps`
      case 'timed':
        return formatDuration(v)
      case 'distance':
        return formatDistance(v)
    }
  }

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
      <div className="px-[22px] pb-[150px] pt-[14px]">
        <header className="mb-5 flex items-center justify-between">
          <CircleButton onClick={() => navigate('/library')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
        </header>

        {photoId ? (
          <ExerciseTile
            photoId={photoId}
            bodyPart={exercise.bodyPart}
            radius="20px 20px 20px 6px"
            className="mb-5 h-[240px] w-full"
            glyphSize={56}
            full
            fit="contain"
            map={{ muscle: body.muscle, view: body.view, fw: 60 }}
          />
        ) : (
          // Photo-free hero: the full front+back muscle map, primary + secondary.
          <div className="mx-auto mb-5 w-fit">
            <BodyMap
              view="both"
              active={body.muscle}
              secondary={body.secondaries.join(',')}
              captions
              fw={90}
            />
          </div>
        )}

        <Overline className="mb-[10px]">
          {metaLine(exercise.bodyPart, exercise.equipment) || humanizeType(type)}
        </Overline>
        <h1 className="mb-4 font-display text-[26px] font-bold leading-[1.1] tracking-[-0.02em] text-white">
          {exercise.name}
        </h1>
        <HeroStat
          intro={heroWeightKg != null ? heroIntro : 'Best'}
          value={heroWeightKg != null ? toDisplayWeight(heroWeightKg, unit) : best ? formatSetSummary(best, type, unit) : '—'}
          unit={heroWeightKg != null ? unit : undefined}
          size={heroWeightKg != null ? 44 : 30}
          chips={
            trend.dir === 'up' || trend.dir === 'down' ? (
              <TrendBadge trend={trend} unit={unit} size={15} />
            ) : undefined
          }
        />

        {/* Progress | How to */}
        <div
          className="mb-5 mt-6 flex gap-1 rounded-full border border-white/[0.08] p-1"
          style={{ background: '#16181a' }}
          role="tablist"
          aria-label="Exercise detail tabs"
        >
          {(
            [
              ['progress', 'Progress'],
              ['howto', 'How to'],
            ] as const
          ).map(([value, label]) => {
            const activeTab = tab === value
            return (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={activeTab}
                onClick={() => setTab(value)}
                className={[
                  'flex-1 rounded-full py-[10px] text-[13.5px] font-semibold transition-colors',
                  activeTab ? 'bg-neon text-white' : 'text-muted',
                ].join(' ')}
              >
                {label}
              </button>
            )
          })}
        </div>

        {tab === 'howto' ? (
          <HowTo exercise={exercise} />
        ) : (
          <>
            {/* Progress tab — best/average, last performance, trend, history. */}
            <div className="mb-6 flex gap-3">
              <div className="flex-1 rounded-[14px] bg-inset p-[13px]">
                <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8b90f7]">
                  Best
                </div>
                <div className="font-display text-[19px] font-semibold tnum text-white">
                  {best ? formatSetSummary(best, type, unit) : '—'}
                </div>
              </div>
              <div className="flex-1 rounded-[14px] bg-inset p-[13px]">
                <div className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-faint">
                  {oneRm != null ? 'Est. 1RM' : 'Average'}
                </div>
                <div className="font-display text-[19px] font-semibold tnum text-white">
                  {oneRm != null
                    ? formatWeight(oneRm, unit)
                    : avg != null
                      ? formatWeight(avg, unit)
                      : '—'}
                </div>
              </div>
            </div>

            {last && (
              <>
                <Divider className="my-6" />
                <div className="mb-3 flex items-center justify-between">
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
              </>
            )}

            {series.length >= 2 && (
              <>
                <Divider className="my-6" />
                <Overline className="mb-3">Progress · {series.length} sessions</Overline>
                <ProgressChart points={series} format={formatMetric} />
              </>
            )}

            {groups.length > 0 ? (
              <>
                <Divider className="my-6" />
                <Overline className="mb-3">History</Overline>
                <div className="flex flex-col gap-[16px]">
                  {groups.map((g) => {
                    const top = bestSet(workingSets(g.sets), type)
                    return (
                      <div key={g.sessionId} className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[14.5px] font-semibold text-white">
                            {formatRelativeDay(g.startedAt)}
                          </div>
                          <div className="mt-[2px] text-[12.5px] tnum text-muted">
                            {g.sets.length} {g.sets.length === 1 ? 'set' : 'sets'}
                            {top?.reps != null ? ` · top ${top.reps} reps` : ''}
                          </div>
                        </div>
                        {top?.weightKg != null && (
                          <div className="font-display text-[15px] font-semibold tnum text-white">
                            {formatWeight(top.weightKg, unit)}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <>
                <Divider className="my-6" />
                <p className="text-[13.5px] leading-[1.5] text-muted">
                  No history yet. Log this exercise in a workout to see your best, average and trend
                  here.
                </p>
              </>
            )}
          </>
        )}

        <Divider className="my-6" />
        <button
          type="button"
          onClick={handleDelete}
          className="text-[13.5px] font-semibold text-[#fa757e] active:scale-[0.99]"
        >
          Delete exercise
        </button>
      </div>

      <FloatingAction>
        <ActionPill
          label="Log today"
          icon={<Plus size={19} strokeWidth={2} />}
          onClick={handleLogToday}
        />
      </FloatingAction>
    </>
  )
}

const humanizeType = (type: ExerciseType): string => type.charAt(0).toUpperCase() + type.slice(1)

/** Numbered form cues for the exercise, with a "not coaching advice" note. */
function HowTo({ exercise }: { exercise: { name?: string | null; notes?: string | null } }) {
  const steps = cuesFor(exercise)
  return (
    <div>
      <ol className="flex flex-col gap-[14px]">
        {steps.map((text, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-neon/[0.16] font-display text-[13px] font-semibold text-[#8b90f7]">
              {i + 1}
            </span>
            <span
              className="pt-[3px] text-[13.5px] leading-[1.5] text-soft"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              {text}
            </span>
          </li>
        ))}
      </ol>
      <Divider className="my-[18px]" />
      <p className="text-[12.5px] leading-[1.45] text-faint">
        Form cues are general guidance to jog your memory — not medical or coaching advice. Train
        within your own ability.
      </p>
    </div>
  )
}
