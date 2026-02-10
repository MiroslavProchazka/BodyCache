export type LocalWorkoutSession = {
  id: string
  name: string
  startedAt: string
  endedAt: string | null
  templateId: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export const ACTIVE_WORKOUT_SESSION_KEY = 'bodycache_active_workout_session_v1'
export const WORKOUT_SESSION_HISTORY_KEY = 'bodycache_workout_session_history_v1'

type StorageLike = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem?: (key: string) => void
}

const memoryStorage = new Map<string, string>()

const memoryStorageAdapter: StorageLike = {
  getItem: (key) => memoryStorage.get(key) ?? null,
  setItem: (key, value) => {
    memoryStorage.set(key, value)
  },
  removeItem: (key) => {
    memoryStorage.delete(key)
  }
}

const nowIso = () => new Date().toISOString()

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}

const getBrowserStorage = (): StorageLike | null => {
  if (typeof window === 'undefined') return null
  const storage = window.localStorage as unknown

  if (
    storage &&
    typeof (storage as StorageLike).getItem === 'function' &&
    typeof (storage as StorageLike).setItem === 'function'
  ) {
    return storage as StorageLike
  }

  return null
}

const getStorage = () => getBrowserStorage() ?? memoryStorageAdapter

const parseJson = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const clearStorageKey = (storage: StorageLike, key: string, fallbackValue = '') => {
  if (typeof storage.removeItem === 'function') {
    storage.removeItem(key)
    return
  }

  storage.setItem(key, fallbackValue)
}

const saveActiveWorkoutSession = (session: LocalWorkoutSession | null) => {
  const storage = getStorage()

  if (!session) {
    clearStorageKey(storage, ACTIVE_WORKOUT_SESSION_KEY)
    return
  }

  storage.setItem(ACTIVE_WORKOUT_SESSION_KEY, JSON.stringify(session))
}

const saveRecentWorkoutSessions = (sessions: LocalWorkoutSession[]) => {
  const storage = getStorage()
  storage.setItem(WORKOUT_SESSION_HISTORY_KEY, JSON.stringify(sessions.slice(0, 50)))
}

export const resetWorkoutSessionStorageForTests = () => {
  memoryStorage.clear()

  const browserStorage = getBrowserStorage()
  if (!browserStorage) return

  clearStorageKey(browserStorage, ACTIVE_WORKOUT_SESSION_KEY)
  clearStorageKey(browserStorage, WORKOUT_SESSION_HISTORY_KEY, '[]')
}

export const createDefaultWorkoutName = (now = new Date()) => `Workout ${now.toISOString().slice(0, 10)}`

export const getActiveWorkoutSession = (): LocalWorkoutSession | null => {
  const storage = getStorage()
  return parseJson<LocalWorkoutSession | null>(storage.getItem(ACTIVE_WORKOUT_SESSION_KEY), null)
}

export const getRecentWorkoutSessions = (): LocalWorkoutSession[] => {
  const storage = getStorage()
  return parseJson<LocalWorkoutSession[]>(storage.getItem(WORKOUT_SESSION_HISTORY_KEY), [])
}

export const startLocalWorkoutSession = (name: string): LocalWorkoutSession => {
  const timestamp = nowIso()
  const trimmedName = name.trim()
  const session: LocalWorkoutSession = {
    id: createId(),
    name: trimmedName.length > 0 ? trimmedName : createDefaultWorkoutName(),
    startedAt: timestamp,
    endedAt: null,
    templateId: null,
    notes: null,
    createdAt: timestamp,
    updatedAt: timestamp
  }

  saveActiveWorkoutSession(session)
  return session
}

export const renameLocalWorkoutSession = (name: string): LocalWorkoutSession | null => {
  const activeSession = getActiveWorkoutSession()
  if (!activeSession) return null

  const trimmedName = name.trim()
  const nextSession: LocalWorkoutSession = {
    ...activeSession,
    name: trimmedName.length > 0 ? trimmedName : activeSession.name,
    updatedAt: nowIso()
  }

  saveActiveWorkoutSession(nextSession)
  return nextSession
}

export const finishLocalWorkoutSession = (): LocalWorkoutSession | null => {
  const activeSession = getActiveWorkoutSession()
  if (!activeSession) return null

  const finishedSession: LocalWorkoutSession = {
    ...activeSession,
    endedAt: nowIso(),
    updatedAt: nowIso()
  }

  saveActiveWorkoutSession(null)
  saveRecentWorkoutSessions([finishedSession, ...getRecentWorkoutSessions()])

  return finishedSession
}
