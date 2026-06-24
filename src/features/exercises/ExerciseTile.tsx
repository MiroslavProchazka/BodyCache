import { useQuery } from '@evolu/react'
import { Dumbbell } from 'lucide-react'
import { photoById } from '@/evolu/queries'
import type { ExercisePhotoId } from '@/evolu/schema'
import { usePhotoUrl } from '@/shared/utils/usePhotoUrl'
import { tileGradient, tintFor } from '@/shared/utils/bodyParts'
import { BodyMap, type BodyView, type MuscleKey } from './BodyMap'

/** Muscle-map placeholder config (replaces the dumbbell when no photo). */
export interface TileMap {
  muscle: MuscleKey
  view: BodyView
  /** Figure width passed to BodyMap. */
  fw: number
  captions?: boolean
}

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
  /**
   * When set, the no-photo placeholder shows the muscle BodyMap (on the map
   * background) instead of the dumbbell glyph. Dense lists omit this.
   */
  map?: TileMap
}

/**
 * The signature "shape mask" tile: a rounded square with one squared-off
 * corner. Shows the exercise's captured photo when present, otherwise — if a
 * `map` is given — a muscle BodyMap, else a body-part-tinted dumbbell glyph.
 */
export function ExerciseTile({
  photoId,
  bodyPart,
  radius,
  className = '',
  glyphSize = 22,
  full = false,
  map,
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
        map={map}
      />
    )
  return (
    <Placeholder
      bodyPart={bodyPart}
      radius={radius}
      className={className}
      glyphSize={glyphSize}
      map={map}
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
  map,
}: {
  photoId: ExercisePhotoId
  bodyPart?: string | null
  radius: string
  className: string
  glyphSize: number
  full: boolean
  map?: TileMap
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
        map={map}
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
  map,
}: {
  bodyPart?: string | null
  radius: string
  className: string
  glyphSize: number
  map?: TileMap
}) {
  if (map)
    return (
      // The map background matches the gap strokes so muscle separations read.
      <div
        className={['flex items-center justify-center overflow-hidden', className].join(' ')}
        style={{ borderRadius: radius, background: '#16181a' }}
      >
        <BodyMap view={map.view} active={map.muscle} fw={map.fw} captions={map.captions} />
      </div>
    )
  return (
    <div
      className={['flex items-center justify-center', className].join(' ')}
      style={{ borderRadius: radius, background: tileGradient(bodyPart), color: tintFor(bodyPart) }}
    >
      <Dumbbell size={glyphSize} strokeWidth={1.75} />
    </div>
  )
}
