export type LocalSessionExercise = {
  id: string
  exerciseId: string
  name: string
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export type LocalWorkoutSession = {
  id: string
  name: string
  startedAt: string
  endedAt: string | null
  templateId: string | null
  notes: string | null
  exercises: LocalSessionExercise[]
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

const createId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
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

const normalizeExercise = (value: unknown, fallbackIndex: number): LocalSessionExercise | null => {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>

  if (typeof input.id !== 'string' || typeof input.exerciseId !== 'string' || typeof input.name !== 'string') {
    return null
  }

  return {
    id: input.id,
    exerciseId: input.exerciseId,
    name: input.name,
    orderIndex: typeof input.orderIndex === 'number' ? input.orderIndex : fallbackIndex,
    createdAt: typeof input.createdAt === 'string' ? input.createdAt : nowIso(),
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : nowIso()
  }
}

const normalizeSession = (value: unknown): LocalWorkoutSession | null => {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>

  if (typeof input.id !== 'string' || typeof input.name !== 'string' || typeof input.startedAt !== 'string') {
    return null
  }

  const exercises = Array.isArray(input.exercises)
    ? input.exercises.map((entry, index) => normalizeExercise(entry, index)).filter((entry): entry is LocalSessionExercise => entry !== null)
    : []

  return {
    id: input.id,
    name: input.name,
    startedAt: input.startedAt,
    endedAt: typeof input.endedAt === 'string' ? input.endedAt : null,
    templateId: typeof input.templateId === 'string' ? input.templateId : null,
    notes: typeof input.notes === 'string' ? input.notes : null,
    exercises,
    createdAt: typeof input.createdAt === 'string' ? input.createdAt : nowIso(),
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : nowIso()
  }
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
  return normalizeSession(parseJson<unknown>(storage.getItem(ACTIVE_WORKOUT_SESSION_KEY), null))
}

export const getRecentWorkoutSessions = (): LocalWorkoutSession[] => {
  const storage = getStorage()
  const rawSessions = parseJson<unknown[]>(storage.getItem(WORKOUT_SESSION_HISTORY_KEY), [])
  return rawSessions.map((entry) => normalizeSession(entry)).filter((entry): entry is LocalWorkoutSession => entry !== null)
}

export const getWorkoutSessionById = (sessionId: string): LocalWorkoutSession | null => {
  const activeSession = getActiveWorkoutSession()
  if (activeSession?.id === sessionId) return activeSession

  return getRecentWorkoutSessions().find((session) => session.id === sessionId) ?? null
}

export const startLocalWorkoutSession = (name: string): LocalWorkoutSession => {
  const timestamp = nowIso()
  const trimmedName = name.trim()
  const session: LocalWorkoutSession = {
    id: createId('session'),
    name: trimmedName.length > 0 ? trimmedName : createDefaultWorkoutName(),
    startedAt: timestamp,
    endedAt: null,
    templateId: null,
    notes: null,
    exercises: [],
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

export const addExerciseToLocalWorkoutSession = (exerciseId: string, exerciseName: string): LocalWorkoutSession | null => {
  const activeSession = getActiveWorkoutSession()
  if (!activeSession) return null

  const timestamp = nowIso()
  const nextSession: LocalWorkoutSession = {
    ...activeSession,
    exercises: [
      ...activeSession.exercises,
      {
        id: createId('session-exercise'),
        exerciseId,
        name: exerciseName,
        orderIndex: activeSession.exercises.length,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    ],
    updatedAt: timestamp
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
