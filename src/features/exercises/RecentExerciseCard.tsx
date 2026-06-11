import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { completedSetsForExercise } from '@/evolu/queries'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { sessionTrend } from '@/shared/utils/exerciseStats'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExerciseTile } from './ExerciseTile'
import { TrendBadge } from './TrendBadge'
import { toHistorySets, lastSummaryLabel } from './history'

interface RecentExerciseCardProps {
  id: ExerciseId
  name: string
  type: ExerciseType
  bodyPart: string | null
  primaryPhotoId: ExercisePhotoId | null
}

/** 158px rail card for the Home "recent exercises" scroller. Tap → detail. */
export function RecentExerciseCard({
  id,
  name,
  type,
  bodyPart,
  primaryPhotoId,
}: RecentExerciseCardProps) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const history = toHistorySets(useQuery(completedSetsForExercise(id)))
  const trend = sessionTrend(history, type)

  return (
    <button
      type="button"
      onClick={() => navigate(`/library/${id}`)}
      className="w-[158px] flex-none rounded-[18px] border border-white/[0.07] bg-surface p-[14px] text-left"
    >
      <ExerciseTile
        photoId={primaryPhotoId}
        bodyPart={bodyPart}
        radius="13px 13px 13px 4px"
        className="mb-3 h-[42px] w-[42px]"
      />
      <div className="mb-[3px] truncate text-[14.5px] font-semibold leading-tight tracking-tight text-white">
        {name}
      </div>
      <div className="mb-[9px] truncate text-xs text-muted">
        {lastSummaryLabel(history, type, unit)}
      </div>
      <TrendBadge trend={trend} unit={unit} />
    </button>
  )
}
