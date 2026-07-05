import { useCallback, useEffect, useState } from 'react'

/** How the exercise library / picker lays out results (TWEAK T1). */
export type LibraryView = 'grid' | 'list'

const STORAGE_KEY = 'bodycache:libview'

const read = (): LibraryView => {
  if (typeof localStorage === 'undefined') return 'grid'
  return localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid'
}

/**
 * The persisted grid/list choice, shared by the library and every in-workout /
 * plan picker so the preference follows the user across surfaces. Grid (media-
 * first) is the default. Persistence is best-effort (private-mode safe).
 */
export function useLibraryView(): [LibraryView, (view: LibraryView) => void] {
  const [view, setView] = useState<LibraryView>(read)

  // Re-sync if another mounted surface changed the choice (same-tab custom event).
  useEffect(() => {
    const onChange = () => setView(read())
    window.addEventListener('bodycache:libview', onChange)
    return () => window.removeEventListener('bodycache:libview', onChange)
  }, [])

  const update = useCallback((next: LibraryView) => {
    setView(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
      window.dispatchEvent(new Event('bodycache:libview'))
    } catch {
      // Persistence is best-effort.
    }
  }, [])

  return [view, update]
}
