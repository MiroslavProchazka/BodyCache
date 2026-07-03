import { useNavigate } from 'react-router-dom'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExerciseTile } from './ExerciseTile'
import { TrendBadge } from './TrendBadge'
import { summaryLabel, summaryTrend, type ExercisePerformanceSummary } from './lastPerformance'

interface RecentExerciseCardProps {
  id: ExerciseId
  name: string
  type: ExerciseType
  bodyPart: string | null
  primaryPhotoId: ExercisePhotoId | null
  /** Last-performance summary from the page's `useLastPerformanceIndex`. */
  summary?: ExercisePerformanceSummary
}

/** 158px rail card for the Home "recent exercises" scroller. Tap → detail. */
export function RecentExerciseCard({
  id,
  name,
  type,
  bodyPart,
  primaryPhotoId,
  summary,
}: RecentExerciseCardProps) {
  const navigate = useNavigate()
  const { unit } = useUnits()

  return (
    <button
      type="button"
      onClick={() => navigate(`/library/${id}`)}
      className="w-[158px] flex-none rounded-[18px] border border-white/[0.07] bg-surface p-[14px] text-left"
    >
      <ExerciseTile
        photoId={primaryPhotoId}
        bodyPart={bodyPart}
        radius="14px"
        className="mb-3 h-[42px] w-[42px]"
      />
      <div className="mb-[3px] truncate text-[14.5px] font-semibold leading-tight tracking-tight text-white">
        {name}
      </div>
      <div className="mb-[9px] truncate text-xs text-muted">{summaryLabel(summary, type, unit)}</div>
      <TrendBadge trend={summaryTrend(summary, type)} unit={unit} />
    </button>
  )
}
