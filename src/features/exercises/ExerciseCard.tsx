import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Card } from '@/shared/components/Card'
import type { ExerciseRow } from '@/evolu/rows'
import type { ExercisePhotoId } from '@/evolu/schema'
import { PhotoThumb } from './PhotoThumb'

interface ExerciseCardProps {
  exercise: ExerciseRow
}

/**
 * Photo-first exercise card (our differentiator vs. text-first trackers).
 * Shows the machine/setup photo, the name, and meta chips. Stats (last
 * performance / best) are layered in during Milestone 5.
 */
export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const chips = [exercise.type, exercise.bodyPart, exercise.equipment].filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  )

  return (
    <Link to={`/library/${exercise.id}`} className="block">
      <Card className="flex items-center gap-3 overflow-hidden p-3 active:bg-gray-800/60">
        <PhotoThumb
          photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
          className="h-16 w-16 shrink-0 rounded-xl"
          alt={String(exercise.name)}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-100">
            {exercise.name}
          </h3>
          {chips.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {chips.map((chip, i) => (
                <span
                  key={i}
                  className="rounded-md bg-gray-800 px-1.5 py-0.5 text-xs capitalize text-gray-400"
                >
                  {String(chip).replace('_', ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
        <ChevronRight size={20} className="shrink-0 text-gray-600" />
      </Card>
    </Link>
  )
}
