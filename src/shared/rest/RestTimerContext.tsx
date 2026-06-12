import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

/** Preset rest durations (seconds) offered in Settings. */
export const REST_PRESETS = [60, 90, 120, 180] as const

const STORAGE_KEY = 'bodycache:rest'
const DEFAULT_REST = 90

interface RestTimerValue {
  /** The user's preferred default rest length (seconds), persisted locally. */
  readonly defaultSec: number
  readonly setDefaultSec: (sec: number) => void
  /** Seconds remaining, or null when no timer is running. */
  readonly remaining: number | null
  /** The duration the running timer was started with. */
  readonly total: number
  /** Start (or restart) the timer. Defaults to `defaultSec`. */
  readonly start: (sec?: number) => void
  /** Cancel/dismiss the running timer. */
  readonly skip: () => void
  /** Add (or, with a negative delta, remove) seconds from the running timer. */
  readonly addTime: (delta: number) => void
}

const RestTimerContext = createContext<RestTimerValue | null>(null)

const readDefault = (): number => {
  if (typeof localStorage === 'undefined') return DEFAULT_REST
  const stored = Number(localStorage.getItem(STORAGE_KEY))
  return Number.isFinite(stored) && stored > 0 ? stored : DEFAULT_REST
}

/**
 * App-wide rest timer. Kept above the router so a countdown survives navigating
 * between the logger and the active-workout screen. Non-blocking by nature:
 * it's a convenience overlay and never gates saving.
 */
export function RestTimerProvider({ children }: { children: ReactNode }) {
  const [defaultSec, setDefaultSecState] = useState(readDefault)
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [total, setTotal] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const alerted = useRef(false)

  // Tick only while a timer is active.
  useEffect(() => {
    if (endsAt == null) return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [endsAt])

  const remaining = endsAt == null ? null : Math.max(0, Math.ceil((endsAt - now) / 1000))

  // Fire once when the countdown hits zero, then auto-dismiss after a moment.
  useEffect(() => {
    if (remaining === 0 && !alerted.current) {
      alerted.current = true
      try {
        navigator.vibrate?.([120, 60, 120])
      } catch {
        // Vibration is best-effort; ignore unsupported environments.
      }
      const t = setTimeout(() => setEndsAt(null), 4000)
      return () => clearTimeout(t)
    }
  }, [remaining])

  const setDefaultSec = useCallback((sec: number) => {
    setDefaultSecState(sec)
    try {
      localStorage.setItem(STORAGE_KEY, String(sec))
    } catch {
      // Persistence is best-effort.
    }
  }, [])

  const start = useCallback(
    (sec?: number) => {
      const duration = sec ?? defaultSec
      alerted.current = false
      setTotal(duration)
      setNow(Date.now())
      setEndsAt(Date.now() + duration * 1000)
    },
    [defaultSec],
  )

  const skip = useCallback(() => setEndsAt(null), [])

  const addTime = useCallback((delta: number) => {
    setEndsAt((prev) => {
      const base = prev ?? Date.now()
      const next = base + delta * 1000
      // Don't let removing time drop the deadline into the past-by-much.
      return Math.max(next, Date.now())
    })
    setTotal((t) => Math.max(0, t + delta))
    if (delta > 0) alerted.current = false
  }, [])

  const value = useMemo<RestTimerValue>(
    () => ({ defaultSec, setDefaultSec, remaining, total, start, skip, addTime }),
    [defaultSec, setDefaultSec, remaining, total, start, skip, addTime],
  )

  return <RestTimerContext.Provider value={value}>{children}</RestTimerContext.Provider>
}

export const useRestTimer = (): RestTimerValue => {
  const ctx = useContext(RestTimerContext)
  if (!ctx) throw new Error('useRestTimer must be used within a RestTimerProvider')
  return ctx
}
