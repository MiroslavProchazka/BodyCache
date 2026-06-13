import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, ChevronLeft } from 'lucide-react'
import { allExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import { CircleButton } from '@/shared/components/CircleButton'
import { Overline } from '@/shared/components/Overline'
import { StickyAction } from '@/shared/components/StickyAction'
import { humanize, metaLine } from '@/shared/utils/bodyParts'
import {
  groupStarterCatalog,
  normalizeExerciseName,
  STARTER_CATALOG,
  type StarterExercise,
} from './starterCatalog'

/**
 * Browse the built-in starter library and bulk-add the basics in one tap, so
 * the user rarely builds an exercise from scratch. Entries already in the
 * library (matched by name) are shown as added and can't be re-selected, so
 * running this twice never creates duplicates.
 */
export function StarterLibraryPage() {
  const navigate = useNavigate()
  const existing = useQuery(allExercises)
  const { createExercise } = useBodyCacheMutations()
  const [saving, setSaving] = useState(false)

  const groups = useMemo(() => groupStarterCatalog(), [])

  /** Names already in the library, normalised for matching. */
  const existingNames = useMemo(
    () => new Set(existing.map((e) => normalizeExerciseName(e.name ?? ''))),
    [existing],
  )

  /** Catalog entries not yet in the library — the only ones selectable. */
  const addable = useMemo(
    () => STARTER_CATALOG.filter((e) => !existingNames.has(normalizeExerciseName(e.name))),
    [existingNames],
  )

  // Selection is keyed by normalised name. Default: everything not yet added is
  // pre-selected, so "add the basics" is a single tap.
  const [selected, setSelected] = useState<Set<string> | null>(null)
  const selectedSet = selected ?? new Set(addable.map((e) => normalizeExerciseName(e.name)))

  const isAdded = (e: StarterExercise) => existingNames.has(normalizeExerciseName(e.name))
  const isSelected = (e: StarterExercise) => selectedSet.has(normalizeExerciseName(e.name))

  const toggle = (e: StarterExercise) => {
    if (isAdded(e)) return
    const key = normalizeExerciseName(e.name)
    const next = new Set(selectedSet)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSelected(next)
  }

  const allSelected = addable.length > 0 && selectedSet.size === addable.length
  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(addable.map((e) => normalizeExerciseName(e.name))))
  }

  const count = selectedSet.size

  const handleAdd = () => {
    if (count === 0 || saving) return
    setSaving(true)
    for (const e of addable) {
      if (selectedSet.has(normalizeExerciseName(e.name))) {
        createExercise({
          name: e.name,
          type: e.type,
          bodyPart: e.bodyPart,
          equipment: e.equipment,
        })
      }
    }
    navigate('/library', { replace: true })
  }

  return (
    <>
      <div className="px-5 pb-[150px] pt-[6px]">
        <header className="mb-3 flex items-center gap-3">
          <CircleButton onClick={() => navigate('/library')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <h1 className="font-display text-[22px] font-semibold tracking-tight text-white">
            Starter library
          </h1>
        </header>

        <p className="mb-4 text-sm text-muted">
          Common gym exercises, ready to add — so you don&apos;t start from scratch. Pick what
          you&apos;ll use; add a machine photo and tweak details later.
        </p>

        {addable.length > 0 ? (
          <button
            type="button"
            onClick={toggleAll}
            className="mb-4 text-[13px] font-semibold text-neon"
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        ) : (
          <p className="mb-4 rounded-2xl bg-surface p-3 text-[13px] text-faint">
            Every starter exercise is already in your library.
          </p>
        )}

        <div className="flex flex-col gap-5">
          {groups.map((group) => (
            <section key={group.bodyPart}>
              <Overline className="mb-[10px]">{humanize(group.bodyPart)}</Overline>
              <div className="flex flex-col gap-2">
                {group.items.map((e) => {
                  const added = isAdded(e)
                  const checked = isSelected(e)
                  return (
                    <button
                      key={e.name}
                      type="button"
                      onClick={() => toggle(e)}
                      disabled={added}
                      aria-pressed={!added && checked}
                      className={[
                        'flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
                        added
                          ? 'border-white/[0.06] bg-surface/50 opacity-55'
                          : checked
                            ? 'border-neon/40 bg-neon/[0.08]'
                            : 'border-white/10 bg-surface',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex h-6 w-6 flex-none items-center justify-center rounded-md border',
                          added || checked
                            ? 'border-neon bg-neon text-ink'
                            : 'border-white/20 text-transparent',
                        ].join(' ')}
                      >
                        <Check size={15} strokeWidth={2.5} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-semibold text-white">
                          {e.name}
                        </span>
                        <span className="block truncate text-[11.5px] text-faint">
                          {metaLine(e.bodyPart, e.equipment)}
                        </span>
                      </span>
                      {added && (
                        <span className="flex-none text-[11px] font-semibold uppercase tracking-wide text-faint">
                          Added
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <StickyAction>
        <button
          type="button"
          onClick={handleAdd}
          disabled={count === 0 || saving}
          className="w-full rounded-2xl bg-neon py-[17px] text-base font-bold text-ink transition-transform active:scale-[0.99] disabled:bg-surface disabled:text-faint disabled:opacity-60"
        >
          {saving
            ? 'Adding…'
            : count === 0
              ? 'Select exercises to add'
              : `Add ${count} exercise${count === 1 ? '' : 's'}`}
        </button>
      </StickyAction>
    </>
  )
}
