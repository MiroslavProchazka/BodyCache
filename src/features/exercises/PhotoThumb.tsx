import { useQuery } from '@evolu/react'
import { ImageIcon } from 'lucide-react'
import { photoById } from '@/evolu/queries'
import type { ExercisePhotoId } from '@/evolu/schema'
import { usePhotoUrl } from '@/shared/utils/usePhotoUrl'

interface PhotoThumbProps {
  photoId: ExercisePhotoId | null
  /** Prefer the thumbnail reference for lists; full image for detail. */
  full?: boolean
  className?: string
  alt?: string
}

/**
 * Renders an exercise's photo from its `ExercisePhotoId`, resolving the
 * IndexedDB-stored binary. Shows a neutral placeholder when there is no photo.
 */
export function PhotoThumb({ photoId, full = false, className = '', alt = '' }: PhotoThumbProps) {
  if (!photoId) return <PhotoPlaceholder className={className} />
  return <ResolvedPhoto photoId={photoId} full={full} className={className} alt={alt} />
}

function ResolvedPhoto({
  photoId,
  full,
  className,
  alt,
}: {
  photoId: ExercisePhotoId
  full: boolean
  className: string
  alt: string
}) {
  const rows = useQuery(photoById(photoId))
  const photo = rows[0]
  const ref = photo ? (full ? photo.localUri : (photo.thumbnailUri ?? photo.localUri)) : null
  const url = usePhotoUrl(ref)

  if (!url) return <PhotoPlaceholder className={className} />
  return <img src={url} alt={alt} className={['object-cover', className].join(' ')} />
}

function PhotoPlaceholder({ className }: { className: string }) {
  return (
    <div
      className={[
        'flex items-center justify-center bg-gray-800 text-gray-600',
        className,
      ].join(' ')}
    >
      <ImageIcon size={28} strokeWidth={1.5} />
    </div>
  )
}
