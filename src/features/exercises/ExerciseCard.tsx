import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ExerciseRow } from '@/evolu/rows'
import type { ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { metaLine } from '@/shared/utils/bodyParts'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExerciseTile } from './ExerciseTile'
import { TrendBadge } from './TrendBadge'
import { bodyFor } from './muscleMap'
import { summaryLabel, summaryTrend, type ExercisePerformanceSummary } from './lastPerformance'

/**
 * Photo-first library grid card (our differentiator vs. text-first trackers):
 * a photographed shape-mask block leads — or, with no photo, a muscle BodyMap
 * highlighting what the exercise works — then name, meta, and the last
 * performance with a trend arrow. Tap → detail.
 *
 * The last-performance `summary` is computed once per page from the aggregate
 * `completedSetsIndex` query (see `useLastPerformanceIndex`) and passed in — the
 * card runs no query of its own, so a 1,000-exercise grid no longer fires a
 * per-card history join. Memoized: a parent re-render (e.g. typing in search)
 * skips cards whose `exercise`/`summary` props are unchanged.
 */
export const ExerciseCard = memo(function ExerciseCard({
  exercise,
  summary,
}: {
  exercise: ExerciseRow
  summary?: ExercisePerformanceSummary
}) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const type = exercise.type as ExerciseType
  const body = bodyFor(exercise)

  return (
    <button
      type="button"
      onClick={() => navigate(`/library/${exercise.id}`)}
      className="text-left transition-transform active:scale-[0.99]"
    >
      <ExerciseTile
        photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
        bodyPart={exercise.bodyPart}
        radius="16px 16px 16px 5px"
        className="h-[150px] w-full"
        glyphSize={34}
        fit="cover"
        map={{ muscle: body.muscle, view: body.view, fw: 50 }}
      />
      <div className="mt-[10px]">
        <div className="truncate text-[14.5px] font-semibold leading-tight tracking-tight text-white">
          {exercise.name}
        </div>
        <div className="my-[3px] truncate text-[11.5px] text-faint">
          {metaLine(exercise.bodyPart, exercise.equipment) || '—'}
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-[12.5px] font-medium tnum text-soft">
            {summaryLabel(summary, type, unit)}
          </span>
          <TrendBadge trend={summaryTrend(summary, type)} unit={unit} iconOnly size={15} />
        </div>
      </div>
    </button>
  )
})
