import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { setsForWorkoutExercise } from '@/evolu/queries'
import type { SessionExerciseRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { humanize } from '@/shared/utils/bodyParts'
import { formatSetSummary } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { bestSet, workingSets } from '@/shared/utils/exerciseStats'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'
import { LinkNextButton } from './SupersetGroup'

/**
 * One exercise inside the active workout as a flat row (SPEC §5.6): photo tile,
 * name, and a `n sets · top W kg × R` recall line. The body taps through to the
 * Log screen; a trailing cluster of up/down chevrons reorders the exercise in
 * place (no drag) and a trash button removes it. A standalone row can also link
 * into a superset with the next exercise.
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
  // A plan instantiates its target sets as incomplete "ghost" rows; count only
  // confirmed (completed) sets here so prescribed targets don't read as logged.
  // The targets still pre-fill the logger when the user taps in.
  const sets = useQuery(setsForWorkoutExercise(entry.id)).filter((s) => s.completedAt != null)
  const top = bestSet(workingSets(sets), type)

  const meta =
    sets.length > 0
      ? `${sets.length} ${sets.length === 1 ? 'set' : 'sets'}${
          top ? ` · top ${formatSetSummary(top, type, unit)}` : ''
        }`
      : entry.bodyPart
        ? humanize(entry.bodyPart as string)
        : 'No sets yet'

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
            <div className="mt-[2px] truncate text-[12.5px] tnum text-muted">{meta}</div>
          </div>
        </button>
        <div className="flex flex-none items-center gap-1">
          <MoveBtn onClick={onMoveUp} disabled={index === 0} label="Move up">
            <ChevronUp size={17} strokeWidth={2} />
          </MoveBtn>
          <MoveBtn onClick={onMoveDown} disabled={index === total - 1} label="Move down">
            <ChevronDown size={17} strokeWidth={2} />
          </MoveBtn>
          <MoveBtn onClick={onRemove} disabled={false} label="Remove exercise">
            <Trash2 size={15} strokeWidth={1.85} />
          </MoveBtn>
        </div>
      </div>
      {onLinkNext && <LinkNextButton onClick={onLinkNext} />}
    </div>
  )
}

/** 32px chevron/remove button; disabled (dimmed) at the ends of the list. */
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
      className="flex h-[32px] w-[32px] items-center justify-center rounded-[10px] border border-white/10 bg-inset text-soft transition-transform active:scale-[0.95] disabled:opacity-30"
    >
      {children}
    </button>
  )
}
