import { useQuery } from '@evolu/react'
import { Dumbbell } from 'lucide-react'
import { photoById } from '@/evolu/queries'
import type { ExercisePhotoId } from '@/evolu/schema'
import { usePhotoUrl } from '@/shared/utils/usePhotoUrl'
import { tileGradient, tintFor } from '@/shared/utils/bodyParts'

interface ExerciseTileProps {
  photoId: ExercisePhotoId | null
  /** Body part drives the placeholder tint when there's no photo. */
  bodyPart?: string | null
  /** Shape-mask radius, e.g. "14px 14px 14px 4px". */
  radius: string
  /** Sizing classes (the tile is square/fixed by the caller). */
  className?: string
  /** Dumbbell glyph size for the placeholder. */
  glyphSize?: number
  /** Prefer the full image over the thumbnail (detail hero). */
  full?: boolean
}

/**
 * The signature "shape mask" tile: a rounded square with one squared-off
 * corner. Shows the exercise's captured photo when present, otherwise a
 * body-part-tinted gradient with a dumbbell glyph (our photo-first placeholder).
 */
export function ExerciseTile({
  photoId,
  bodyPart,
  radius,
  className = '',
  glyphSize = 22,
  full = false,
}: ExerciseTileProps) {
  if (photoId)
    return (
      <ResolvedTile
        photoId={photoId}
        bodyPart={bodyPart}
        radius={radius}
        className={className}
        glyphSize={glyphSize}
        full={full}
      />
    )
  return (
    <Placeholder
      bodyPart={bodyPart}
      radius={radius}
      className={className}
      glyphSize={glyphSize}
    />
  )
}

function ResolvedTile({
  photoId,
  bodyPart,
  radius,
  className,
  glyphSize,
  full,
}: {
  photoId: ExercisePhotoId
  bodyPart?: string | null
  radius: string
  className: string
  glyphSize: number
  full: boolean
}) {
  const rows = useQuery(photoById(photoId))
  const photo = rows[0]
  const ref = photo ? (full ? photo.localUri : (photo.thumbnailUri ?? photo.localUri)) : null
  const url = usePhotoUrl(ref)

  if (!url)
    return (
      <Placeholder
        bodyPart={bodyPart}
        radius={radius}
        className={className}
        glyphSize={glyphSize}
      />
    )
  return (
    <div className={['overflow-hidden', className].join(' ')} style={{ borderRadius: radius }}>
      <img src={url} alt="" className="h-full w-full object-cover" />
    </div>
  )
}

function Placeholder({
  bodyPart,
  radius,
  className,
  glyphSize,
}: {
  bodyPart?: string | null
  radius: string
  className: string
  glyphSize: number
}) {
  return (
    <div
      className={['flex items-center justify-center', className].join(' ')}
      style={{ borderRadius: radius, background: tileGradient(bodyPart), color: tintFor(bodyPart) }}
    >
      <Dumbbell size={glyphSize} strokeWidth={1.75} />
    </div>
  )
}
