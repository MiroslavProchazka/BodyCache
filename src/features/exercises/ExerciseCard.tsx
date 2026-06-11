import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { completedSetsForExercise } from '@/evolu/queries'
import type { ExerciseRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { sessionTrend } from '@/shared/utils/exerciseStats'
import { metaLine } from '@/shared/utils/bodyParts'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExerciseTile } from './ExerciseTile'
import { TrendBadge } from './TrendBadge'
import { toHistorySets, lastSummaryLabel } from './history'

/**
 * Photo-first library grid card (our differentiator vs. text-first trackers):
 * a tinted/photographed shape-mask block leads, then name, meta, and the last
 * performance with a trend arrow. Tap → detail.
 */
export function ExerciseCard({ exercise }: { exercise: ExerciseRow }) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const type = exercise.type as ExerciseType
  const history = toHistorySets(useQuery(completedSetsForExercise(exercise.id as ExerciseId)))
  const trend = sessionTrend(history, type)

  return (
    <button
      type="button"
      onClick={() => navigate(`/library/${exercise.id}`)}
      className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-surface text-left"
    >
      <ExerciseTile
        photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
        bodyPart={exercise.bodyPart}
        radius="18px 18px 18px 4px"
        className="h-[88px] w-full"
        glyphSize={34}
      />
      <div className="p-3">
        <div className="truncate text-[14.5px] font-semibold leading-tight tracking-tight text-white">
          {exercise.name}
        </div>
        <div className="my-[3px] truncate text-[11.5px] text-faint">
          {metaLine(exercise.bodyPart, exercise.equipment) || '—'}
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-[12.5px] font-medium tnum text-soft">
            {lastSummaryLabel(history, type, unit)}
          </span>
          <TrendBadge trend={trend} unit={unit} iconOnly size={15} />
        </div>
      </div>
    </button>
  )
}
