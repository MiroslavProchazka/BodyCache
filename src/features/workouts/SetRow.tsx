import { useState } from 'react'
import { Check, Trash2, Trophy } from 'lucide-react'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseSetRow } from '@/evolu/rows'
import type { ExerciseType } from '@/evolu/schema'
import type { HistorySet } from '@/shared/utils/exerciseStats'
import { SET_FIELDS, type SetFieldDef, type SetFieldKey } from './setFields'

interface SetRowProps {
  set: ExerciseSetRow
  /** Zero-based position; displayed as 1-based. */
  index: number
  type: ExerciseType
  /** Same-position set from the previous workout, shown as a ghost placeholder. */
  ghost: HistorySet | null
  isPR: boolean
}

const numOrNull = (raw: string): number | null => {
  const t = raw.trim()
  if (t === '') return null
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

/** Strip to a valid numeric string while typing (digits, optional single dot). */
const sanitize = (raw: string, integer?: boolean): string => {
  const s = raw.replace(integer ? /[^0-9]/g : /[^0-9.]/g, '')
  if (integer) return s
  const [head, ...rest] = s.split('.')
  return rest.length ? `${head}.${rest.join('')}` : s
}

const ghostText = (ghost: HistorySet | null, f: SetFieldDef): string => {
  if (!ghost) return f.label
  const v = ghost[f.key] as number | null
  return v == null ? f.label : String(v)
}

/**
 * A single logged set: type-specific numeric inputs, a tap-to-complete toggle,
 * an inline PR badge, and delete. Edits are committed to Evolu on blur (and
 * flushed when the set is completed) so logging survives an app reload.
 */
export function SetRow({ set, index, type, ghost, isPR }: SetRowProps) {
  const { updateSet, setSetCompleted, removeSet } = useBodyCacheMutations()
  const fields = SET_FIELDS[type]

  // Seed input state once from the row so reactive query updates can't clobber
  // in-progress typing (the row is keyed by id, so it remounts if id changes).
  const [values, setValues] = useState<Record<SetFieldKey, string>>(() => {
    const init = {} as Record<SetFieldKey, string>
    for (const f of fields) {
      const v = set[f.key] as number | null
      init[f.key] = v == null ? '' : String(v)
    }
    return init
  })

  const completed = set.completedAt != null

  const commit = (key: SetFieldKey) => {
    const patch: Partial<Record<SetFieldKey, number | null>> = {
      [key]: numOrNull(values[key]),
    }
    updateSet(set.id, patch)
  }

  const toggleComplete = () => {
    if (completed) {
      setSetCompleted(set.id, false)
      return
    }
    // Flush all current inputs before marking done.
    const patch: Partial<Record<SetFieldKey, number | null>> = {}
    for (const f of fields) patch[f.key] = numOrNull(values[f.key])
    updateSet(set.id, patch)
    setSetCompleted(set.id, true)
  }

  return (
    <div
      className={[
        'flex items-center gap-2 rounded-xl px-1.5 py-1.5',
        completed ? 'bg-emerald-500/10' : '',
      ].join(' ')}
    >
      <span className="w-5 shrink-0 text-center text-sm font-medium text-gray-500">
        {index + 1}
      </span>

      <div className="flex flex-1 items-center gap-2">
        {fields.map((f) => (
          <label key={f.key} className="flex-1">
            <input
              type="text"
              inputMode={f.integer ? 'numeric' : 'decimal'}
              value={values[f.key]}
              placeholder={ghostText(ghost, f)}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.key]: sanitize(e.target.value, f.integer) }))
              }
              onBlur={() => commit(f.key)}
              aria-label={f.label}
              className="w-full rounded-lg border border-gray-800 bg-gray-950 py-2 text-center text-lg font-semibold text-gray-100 placeholder:text-base placeholder:font-normal placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none"
            />
          </label>
        ))}
      </div>

      {isPR && (
        <span
          className="inline-flex shrink-0 items-center gap-0.5 rounded-md bg-amber-400/15 px-1.5 py-1 text-xs font-semibold text-amber-300"
          title="Personal record"
        >
          <Trophy size={12} /> PR
        </span>
      )}

      <button
        type="button"
        onClick={toggleComplete}
        aria-label={completed ? 'Mark set incomplete' : 'Complete set'}
        aria-pressed={completed}
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
          completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-gray-700 text-gray-500 active:bg-gray-800',
        ].join(' ')}
      >
        <Check size={18} />
      </button>

      <button
        type="button"
        onClick={() => removeSet(set.id)}
        aria-label="Delete set"
        className="flex h-9 w-6 shrink-0 items-center justify-center text-gray-600 active:text-red-400"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
