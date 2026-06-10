/**
 * Local image storage for BodyCache.
 *
 * Per the product spec, image binaries must NOT live in Evolu. We keep the
 * `Blob` in IndexedDB keyed by a generated id, and store only a reference
 * string (`idb://<key>`) plus metadata in the Evolu `exercisePhoto` table.
 *
 * `resolvePhotoUrl` turns a stored reference back into a short-lived object URL
 * for `<img src>`. Callers should revoke URLs they create when done (see the
 * `usePhotoUrl` hook in components if needed).
 */

const DB_NAME = 'bodycache-photos'
const STORE = 'photos'
const REF_PREFIX = 'idb://'

let dbPromise: Promise<IDBDatabase> | null = null

const openDb = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

const tx = async <T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(STORE, mode)
    const req = run(t.objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const randomKey = (): string =>
  (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)

/** A stored photo reference + its generated thumbnail reference. */
export interface StoredPhoto {
  /** Reference for the full-size image, e.g. `idb://abc`. Store as `localUri`. */
  readonly ref: string
  /** Reference for the thumbnail. Store as `thumbnailUri`. */
  readonly thumbnailRef: string
}

/**
 * Persist a captured/selected image. Stores the original plus a downscaled
 * thumbnail in IndexedDB and returns their reference strings.
 */
export const storePhoto = async (file: Blob): Promise<StoredPhoto> => {
  const key = randomKey()
  const thumbKey = `${key}-thumb`
  const thumbnail = await makeThumbnail(file)
  await tx('readwrite', (s) => s.put(file, key))
  await tx('readwrite', (s) => s.put(thumbnail, thumbKey))
  return { ref: `${REF_PREFIX}${key}`, thumbnailRef: `${REF_PREFIX}${thumbKey}` }
}

/** Resolve a stored reference (`idb://…`) to an object URL, or null. */
export const resolvePhotoUrl = async (
  ref: string | null | undefined,
): Promise<string | null> => {
  // Only `idb://` references are resolvable; anything else is treated as
  // "no image" rather than handed straight to <img src>.
  if (!ref || !ref.startsWith(REF_PREFIX)) return null
  const key = ref.slice(REF_PREFIX.length)
  const blob = await tx<Blob | undefined>('readonly', (s) => s.get(key))
  return blob ? URL.createObjectURL(blob) : null
}

/** Delete a stored image and its thumbnail by their references. */
export const deletePhoto = async (
  ...refs: (string | null | undefined)[]
): Promise<void> => {
  for (const ref of refs) {
    if (!ref || !ref.startsWith(REF_PREFIX)) continue
    await tx('readwrite', (s) => s.delete(ref.slice(REF_PREFIX.length)))
  }
}

/** Downscale an image Blob to a JPEG thumbnail (max 400px), best-effort. */
const makeThumbnail = async (file: Blob, max = 400): Promise<Blob> => {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', 0.8),
    )
    return blob ?? file
  } catch {
    // If decoding fails (e.g. unsupported format), fall back to the original.
    return file
  }
}
