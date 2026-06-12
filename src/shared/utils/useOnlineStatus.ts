import { useEffect, useState } from 'react'

/**
 * Track the browser's network connectivity via `navigator.onLine` and the
 * `online`/`offline` events.
 *
 * This is the only sync signal we can surface today: Evolu's `SyncState`
 * subscription isn't exposed in the current release (the React `useSyncState`
 * hook throws a TODO). Connectivity is an honest, non-blocking proxy — writes
 * commit locally regardless, so a "offline" reading never means data loss.
 */
export const useOnlineStatus = (): boolean => {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )

  useEffect(() => {
    const update = () => setOnline(navigator.onLine)
    // Re-read on mount in case connectivity changed before the effect ran.
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  return online
}
