import { useNavigate } from 'react-router-dom'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { useUnits } from '@/shared/units/UnitsContext'
import { ListRow } from '@/shared/components/ListRow'
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

/**
 * A recently-performed exercise as a flat Home row (mock 1b): photo/muscle
 * tile, name, last-set recall, and a trailing trend chip. Tap → detail.
 */
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
    <ListRow
      onClick={() => navigate(`/library/${id}`)}
      leading={
        <ExerciseTile
          photoId={primaryPhotoId}
          bodyPart={bodyPart}
          radius="14px"
          className="h-[42px] w-[42px] flex-none"
        />
      }
      title={name}
      meta={summaryLabel(summary, type, unit)}
      trailing={<TrendBadge trend={summaryTrend(summary, type)} unit={unit} size={13} />}
    />
  )
}
