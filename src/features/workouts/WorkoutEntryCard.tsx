import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { setsForWorkoutExercise } from '@/evolu/queries'
import type { SessionExerciseRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { formatSetSummary } from '@/shared/utils/units'
import { bestSet, workingSets } from '@/shared/utils/exerciseStats'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { LinkNextButton } from './SupersetGroup'

/**
 * One exercise inside the active workout (mock 3b): a flat row — photo tile,
 * name, and an `n sets · top W × R` recall line. The body taps through to the
 * Log screen; a trailing cluster of up/down chevrons reorders the exercise in
 * place (no drag) and a trash button removes it. A standalone row can also show
 * a "Superset with next" link. Grouping into supersets is conveyed by the
 * parent `SupersetGroup` rail + overline, not a per-row badge.
 */
export function WorkoutEntryCard({
  entry,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onRemove,
  onLinkNext,
}: {
  entry: SessionExerciseRow
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
  onLinkNext?: () => void
}) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const type = entry.exerciseType as ExerciseType
  // A plan instantiates its target sets as incomplete "ghost" rows; show only
  // confirmed (completed) sets here so prescribed targets don't read as logged.
  // The targets still pre-fill the logger when the user taps in.
  const sets = useQuery(setsForWorkoutExercise(entry.id)).filter((s) => s.completedAt != null)
  const top = bestSet(workingSets(sets), type)

  const meta =
    sets.length === 0
      ? 'Not logged yet'
      : `${sets.length} ${sets.length === 1 ? 'set' : 'sets'}${
          top ? ` · top ${formatSetSummary(top, type, unit)}` : ''
        }`

  return (
    <div>
      <div className="flex items-center gap-[13px]">
        <button
          type="button"
          onClick={() => navigate(`/workout/log/${entry.exerciseId as ExerciseId}`)}
          className="flex min-h-[44px] min-w-0 flex-1 items-center gap-[13px] text-left transition-transform active:scale-[0.99]"
        >
          <ExerciseTile
            photoId={entry.primaryPhotoId as ExercisePhotoId | null}
            bodyPart={entry.bodyPart as string | null}
            radius="14px"
            className="h-[42px] w-[42px] flex-none"
            glyphSize={20}
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-semibold text-white">
              {entry.exerciseName}
            </div>
            <div className="mt-[2px] truncate text-[12.5px] text-muted">{meta}</div>
          </div>
        </button>
        <div className="flex flex-none items-center">
          <MoveBtn onClick={onMoveUp} disabled={index === 0} label="Move up">
            <ChevronUp size={18} strokeWidth={2} />
          </MoveBtn>
          <MoveBtn onClick={onMoveDown} disabled={index === total - 1} label="Move down">
            <ChevronDown size={18} strokeWidth={2} />
          </MoveBtn>
          <MoveBtn onClick={onRemove} disabled={false} label="Remove exercise">
            <Trash2 size={16} strokeWidth={1.85} />
          </MoveBtn>
        </div>
      </div>
      {onLinkNext && <LinkNextButton onClick={onLinkNext} />}
    </div>
  )
}

/** 34px borderless chevron/trash button; dimmed & disabled at the list ends. */
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
      className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-faint transition-transform active:scale-[0.9] disabled:opacity-25"
    >
      {children}
    </button>
  )
}
