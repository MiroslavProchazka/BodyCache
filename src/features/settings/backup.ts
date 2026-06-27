/**
 * Backup / restore / CSV — pure (DOM-free) helpers.
 *
 * BodyCache is local-only with no cloud sync, so a manual backup is the user's
 * safety net for their "workout memory". A backup is a single JSON file holding
 * every live row from every table plus the photo binaries (base64), so it can
 * be restored losslessly onto a fresh device. The Evolu/IndexedDB/file plumbing
 * lives in `useDataTransfer`; everything here is pure and unit-tested.
 */

export const BACKUP_FORMAT = 'bodycache-backup' as const
// v2 adds the plan/planExercise/planSet tables. v1 files (without them) still
// restore — the missing plan tables are tolerated and treated as empty.
// Supersets added the nullable `supersetGroup` *column* (not a new table) to
// workoutExercise/planExercise, which does NOT bump the version: a pre-supersets
// v2 backup simply lacks the field and imports it as null (→ standalone).
export const BACKUP_VERSION = 2 as const

/** A serialized table row. Values are JSON primitives (strings/numbers/null). */
export type SerializedRow = Record<string, unknown>

/** Every backed-up table, keyed by Evolu table name. */
export interface BackupTables {
  readonly exercise: readonly SerializedRow[]
  readonly exercisePhoto: readonly SerializedRow[]
  readonly workoutSession: readonly SerializedRow[]
  readonly workoutExercise: readonly SerializedRow[]
  readonly exerciseSet: readonly SerializedRow[]
  readonly plan: readonly SerializedRow[]
  readonly planExercise: readonly SerializedRow[]
  readonly planSet: readonly SerializedRow[]
}

/** A photo binary captured in a backup. */
export interface BackupPhoto {
  /** The `idb://…` reference the image is stored under. */
  readonly ref: string
  readonly mime: string
  readonly base64: string
}

/** The full backup document written to / read from disk. */
export interface BackupFile {
  readonly format: typeof BACKUP_FORMAT
  readonly version: number
  readonly exportedAt: string
  readonly tables: BackupTables
  readonly photos: readonly BackupPhoto[]
}

/** Tables present since v1 — a valid backup must include all of these. */
const REQUIRED_TABLE_NAMES = [
  'exercise',
  'exercisePhoto',
  'workoutSession',
  'workoutExercise',
  'exerciseSet',
] as const satisfies readonly (keyof BackupTables)[]

/** Tables added in v2 — tolerated as missing when restoring older backups. */
const OPTIONAL_TABLE_NAMES = [
  'plan',
  'planExercise',
  'planSet',
] as const satisfies readonly (keyof BackupTables)[]

const TABLE_NAMES = [
  ...REQUIRED_TABLE_NAMES,
  ...OPTIONAL_TABLE_NAMES,
] as const satisfies readonly (keyof BackupTables)[]

/** Assemble a backup document. `exportedAt` is injectable for testing. */
export const buildBackupFile = (
  tables: BackupTables,
  photos: readonly BackupPhoto[],
  exportedAt: string = new Date().toISOString(),
): BackupFile => ({
  format: BACKUP_FORMAT,
  version: BACKUP_VERSION,
  exportedAt,
  tables,
  photos,
})

/** Discriminated result for the (untrusted) file parser. */
export type ParseResult =
  | { readonly ok: true; readonly value: BackupFile }
  | { readonly ok: false; readonly error: string }

/**
 * Parse and validate a backup file's text. Defensive by design: the input is a
 * user-chosen file, so we check the shape before handing rows to Evolu.
 */
export const parseBackupFile = (text: string): ParseResult => {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: "That file isn't valid JSON." }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, error: 'Unrecognized backup file.' }
  }
  const obj = parsed as Record<string, unknown>
  if (obj.format !== BACKUP_FORMAT) {
    return { ok: false, error: "This doesn't look like a BodyCache backup." }
  }
  if (typeof obj.version !== 'number' || obj.version > BACKUP_VERSION) {
    return { ok: false, error: 'This backup was made by a newer version.' }
  }

  const tables = obj.tables as Record<string, unknown> | undefined
  if (typeof tables !== 'object' || tables === null) {
    return { ok: false, error: 'Backup is missing its data.' }
  }
  for (const name of REQUIRED_TABLE_NAMES) {
    if (!Array.isArray(tables[name])) {
      return { ok: false, error: `Backup is missing the "${name}" table.` }
    }
  }
  // Optional (v2+) tables: if present they must be arrays, but a v1 backup
  // simply won't have them.
  for (const name of OPTIONAL_TABLE_NAMES) {
    if (name in tables && !Array.isArray(tables[name])) {
      return { ok: false, error: `Backup has an invalid "${name}" table.` }
    }
  }
  if (!Array.isArray(obj.photos)) {
    return { ok: false, error: 'Backup is missing its photos.' }
  }

  // Normalize so callers can read every table unconditionally, even from v1.
  const normalizedTables = Object.fromEntries(
    TABLE_NAMES.map((name) => [name, Array.isArray(tables[name]) ? tables[name] : []]),
  ) as unknown as BackupTables

  return {
    ok: true,
    value: { ...(parsed as BackupFile), tables: normalizedTables },
  }
}

/** Total live rows across all tables — for a friendly post-restore summary. */
export const countRows = (tables: BackupTables): number =>
  TABLE_NAMES.reduce((sum, name) => sum + tables[name].length, 0)

// --- CSV export -----------------------------------------------------------

/** Minimal row shapes the CSV builder needs (structural subset of DB rows). */
interface CsvExercise {
  readonly id: string
  readonly name: string | null
  readonly type: string | null
  readonly bodyPart: string | null
}
interface CsvSession {
  readonly id: string
  readonly date: string | null
  readonly startedAt: string | null
  readonly status: string | null
}
interface CsvWorkoutExercise {
  readonly id: string
  readonly workoutSessionId: string | null
  readonly exerciseId: string | null
  readonly orderIndex: number | null
}
interface CsvSet {
  readonly workoutExerciseId: string | null
  readonly orderIndex: number | null
  readonly completedAt: string | null
  readonly weightKg: number | null
  readonly reps: number | null
  readonly addedWeightKg: number | null
  readonly assistanceWeightKg: number | null
  readonly durationSec: number | null
  readonly distanceMeters: number | null
  readonly rpe: number | null
  readonly notes: string | null
}

/** Tables the history CSV reads from. */
export interface CsvSource {
  readonly exercises: readonly CsvExercise[]
  readonly sessions: readonly CsvSession[]
  readonly workoutExercises: readonly CsvWorkoutExercise[]
  readonly sets: readonly CsvSet[]
}

const CSV_HEADER = [
  'date',
  'exercise',
  'type',
  'body_part',
  'set',
  'weight_kg',
  'reps',
  'added_weight_kg',
  'assistance_weight_kg',
  'duration_sec',
  'distance_m',
  'rpe',
  'notes',
] as const

/** Quote a CSV field when it contains a comma, quote, or newline. */
export const csvEscape = (value: string | number | null | undefined): string => {
  if (value == null) return ''
  const str = String(value)
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

/**
 * Flatten finished-workout history into one CSV row per completed set —
 * spreadsheet-friendly and unambiguous (weights are canonical kilograms).
 * Sorted newest workout first, then exercise order, then set order.
 */
export const toHistoryCsv = (source: CsvSource): string => {
  const exercises = new Map(source.exercises.map((e) => [e.id, e]))
  const sessions = new Map(source.sessions.map((s) => [s.id, s]))
  const workoutExercises = new Map(source.workoutExercises.map((w) => [w.id, w]))

  interface CsvRow {
    readonly session: CsvSession
    readonly exercise: CsvExercise | undefined
    readonly exerciseOrder: number
    readonly set: CsvSet
  }

  const rows: CsvRow[] = []
  for (const set of source.sets) {
    if (!set.completedAt || !set.workoutExerciseId) continue
    const we = workoutExercises.get(set.workoutExerciseId)
    if (!we || !we.workoutSessionId) continue
    const session = sessions.get(we.workoutSessionId)
    if (!session || session.status !== 'finished') continue
    rows.push({
      session,
      exercise: we.exerciseId ? exercises.get(we.exerciseId) : undefined,
      exerciseOrder: we.orderIndex ?? 0,
      set,
    })
  }

  const time = (s: CsvSession) =>
    s.startedAt ? new Date(s.startedAt).getTime() : 0
  rows.sort(
    (a, b) =>
      time(b.session) - time(a.session) ||
      a.exerciseOrder - b.exerciseOrder ||
      (a.set.orderIndex ?? 0) - (b.set.orderIndex ?? 0),
  )

  const lines = rows.map((r) => {
    const day = r.session.date ?? r.session.startedAt ?? ''
    return [
      day ? day.slice(0, 10) : '',
      r.exercise?.name ?? '',
      r.exercise?.type ?? '',
      r.exercise?.bodyPart ?? '',
      (r.set.orderIndex ?? 0) + 1,
      r.set.weightKg,
      r.set.reps,
      r.set.addedWeightKg,
      r.set.assistanceWeightKg,
      r.set.durationSec,
      r.set.distanceMeters,
      r.set.rpe,
      r.set.notes,
    ]
      .map(csvEscape)
      .join(',')
  })

  return [CSV_HEADER.join(','), ...lines].join('\r\n')
}
