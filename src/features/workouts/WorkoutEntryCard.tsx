import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { setsForWorkoutExercise } from '@/evolu/queries'
import type { SessionExerciseRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { humanize } from '@/shared/utils/bodyParts'
import { formatSetSummary } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { LinkNextButton, SupersetBadge } from './SupersetGroup'

/**
 * One exercise inside the active workout: photo, name, set count, and a wrap of
 * set chips. The body taps through to the Log screen; a trailing cluster of
 * up/down chevrons reorders the exercise in place (no drag). Optionally wears an
 * A1/A2 superset badge and a "Superset with next" link (standalone only).
 */
export function WorkoutEntryCard({
  entry,
  index,
  total,
  onMoveUp,
  onMoveDown,
  badge = null,
  onLinkNext,
}: {
  entry: SessionExerciseRow
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  badge?: string | null
  onLinkNext?: () => void
}) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const type = entry.exerciseType as ExerciseType
  const sets = useQuery(setsForWorkoutExercise(entry.id))

  return (
    <div className="rounded-[20px] border border-white/[0.07] bg-surface p-4">
      <div className="mb-[13px] flex items-center gap-[11px]">
        {badge && <SupersetBadge label={badge} />}
        <button
          type="button"
          onClick={() => navigate(`/workout/log/${entry.exerciseId as ExerciseId}`)}
          className="flex min-w-0 flex-1 items-center gap-[13px] text-left"
        >
          <ExerciseTile
            photoId={entry.primaryPhotoId as ExercisePhotoId | null}
            bodyPart={entry.bodyPart as string | null}
            radius="14px"
            className="h-[46px] w-[46px] flex-none"
            glyphSize={23}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold tracking-tight text-white">
              {entry.exerciseName}
            </div>
            <div className="mt-[2px] truncate text-[12.5px] text-muted">
              {sets.length} {sets.length === 1 ? 'set' : 'sets'}
              {entry.bodyPart ? ` · ${humanize(entry.bodyPart as string)}` : ''}
            </div>
          </div>
        </button>
        <div className="flex flex-none items-center gap-1">
          <MoveBtn onClick={onMoveUp} disabled={index === 0} label="Move up">
            <ChevronUp size={18} strokeWidth={2} />
          </MoveBtn>
          <MoveBtn onClick={onMoveDown} disabled={index === total - 1} label="Move down">
            <ChevronDown size={18} strokeWidth={2} />
          </MoveBtn>
        </div>
      </div>
      {sets.length > 0 && (
        <div className="flex flex-wrap gap-[7px]">
          {sets.map((s) => (
            <span
              key={s.id}
              className="whitespace-nowrap rounded-[9px] bg-inset px-[10px] py-[6px] text-[12.5px] font-semibold tnum text-soft"
            >
              {formatSetSummary(s, type, unit, true)}
            </span>
          ))}
        </div>
      )}
      {onLinkNext && <LinkNextButton onClick={onLinkNext} />}
    </div>
  )
}

/** 34px square chevron button; disabled (dimmed) at the ends of the list. */
function MoveBtn({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-white/10 bg-inset text-soft transition-transform active:scale-[0.95] disabled:opacity-30"
    >
      {children}
    </button>
  )
}
