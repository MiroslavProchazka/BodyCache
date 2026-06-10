import { useEffect, useState } from 'react'
import { resolvePhotoUrl } from './photos'

/**
 * Resolve a stored photo reference (`idb://…`) to a usable object URL,
 * revoking it on unmount / ref change to avoid leaks. Returns null until
 * resolved or when there is no photo.
 */
export const usePhotoUrl = (ref: string | null | undefined): string | null => {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let revoked = false
    let created: string | null = null
    setUrl(null)
    void resolvePhotoUrl(ref).then((resolved) => {
      if (revoked) {
        if (resolved?.startsWith('blob:')) URL.revokeObjectURL(resolved)
        return
      }
      created = resolved
      setUrl(resolved)
    })
    return () => {
      revoked = true
      if (created?.startsWith('blob:')) URL.revokeObjectURL(created)
    }
  }, [ref])

  return url
}
