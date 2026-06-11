import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Pencil } from 'lucide-react'
import { setsForWorkoutExercise } from '@/evolu/queries'
import type { SessionExerciseRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType } from '@/evolu/schema'
import { humanize } from '@/shared/utils/bodyParts'
import { formatSetSummary } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'

/**
 * One exercise inside the active workout: photo, name, set count, and a wrap of
 * set chips. Tap anywhere re-opens the Log screen for this exercise.
 */
export function WorkoutEntryCard({ entry }: { entry: SessionExerciseRow }) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const type = entry.exerciseType as ExerciseType
  const sets = useQuery(setsForWorkoutExercise(entry.id))

  return (
    <button
      type="button"
      onClick={() => navigate(`/workout/log/${entry.exerciseId as ExerciseId}`)}
      className="w-full rounded-[20px] border border-white/[0.07] bg-surface p-4 text-left"
    >
      <div className="mb-[13px] flex items-center gap-[13px]">
        <ExerciseTile
          photoId={entry.primaryPhotoId as ExercisePhotoId | null}
          bodyPart={entry.bodyPart as string | null}
          radius="14px 14px 14px 4px"
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
        <Pencil size={18} strokeWidth={1.75} className="flex-none text-faint" />
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
    </button>
  )
}
