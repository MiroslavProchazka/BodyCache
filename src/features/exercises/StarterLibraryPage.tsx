import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, ChevronLeft, Search } from 'lucide-react'
import { allExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Overline } from '@/shared/components/Overline'
import { StickyAction } from '@/shared/components/StickyAction'
import { humanize, metaLine } from '@/shared/utils/bodyParts'
import { storePhoto } from '@/shared/utils/photos'
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
  const { createExercise, addExercisePhoto, setPrimaryPhoto } = useBodyCacheMutations()
  const [saving, setSaving] = useState(false)

  const groups = useMemo(() => groupStarterCatalog(), [])

  /** Names already in the library, normalised for matching. */
  const existingNames = useMemo(
    () => new Set(existing.map((e) => normalizeExerciseName(e.name ?? ''))),
    [existing],
  )

  const isAdded = (e: StarterExercise) => existingNames.has(normalizeExerciseName(e.name))

  // The catalog is large, so a search box keeps it usable.
  const [query, setQuery] = useState('')
  const q = normalizeExerciseName(query)

  /** Body-part groups narrowed to the search query. */
  const visibleGroups = useMemo(() => {
    if (!q) return groups
    return groups
      .map((g) => ({
        bodyPart: g.bodyPart,
        items: g.items.filter((e) => normalizeExerciseName(e.name).includes(q)),
      }))
      .filter((g) => g.items.length > 0)
  }, [groups, q])

  /** Currently-visible entries not yet in the library — what "Select all" acts on. */
  const visibleAddable = useMemo(
    () => visibleGroups.flatMap((g) => g.items).filter((e) => !isAdded(e)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleGroups, existingNames],
  )

  // Selection keyed by normalised name. Starts empty — with 1,000+ entries the
  // user searches and picks (or "Select all" within a search), so a single tap
  // never floods the library with the whole catalog.
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const isSelected = (e: StarterExercise) => selected.has(normalizeExerciseName(e.name))

  const toggle = (e: StarterExercise) => {
    if (isAdded(e)) return
    const key = normalizeExerciseName(e.name)
    const next = new Set(selected)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSelected(next)
  }

  const allVisibleSelected =
    visibleAddable.length > 0 &&
    visibleAddable.every((e) => selected.has(normalizeExerciseName(e.name)))
  const toggleAll = () => {
    const next = new Set(selected)
    for (const e of visibleAddable) {
      const key = normalizeExerciseName(e.name)
      if (allVisibleSelected) next.delete(key)
      else next.add(key)
    }
    setSelected(next)
  }

  const count = selected.size

  /**
   * Fetch a bundled demo GIF and copy it into IndexedDB via the normal photo
   * pipeline, then attach it as the exercise's primary photo. Best-effort: any
   * failure (offline, missing asset) leaves the exercise without a photo rather
   * than blocking the add — the user can still snap their own machine photo.
   */
  const attachAnimation = async (exerciseId: ExerciseId, animation: string) => {
    try {
      const res = await fetch(animation)
      if (!res.ok) return
      const stored = await storePhoto(await res.blob())
      const photo = addExercisePhoto(exerciseId, {
        localUri: stored.ref,
        thumbnailUri: stored.thumbnailRef,
      })
      if (photo.ok) setPrimaryPhoto(exerciseId, photo.value.id)
    } catch {
      // Ignore — the exercise is already created; media is a nice-to-have.
    }
  }

  const handleAdd = async () => {
    if (count === 0 || saving) return
    setSaving(true)
    for (const e of STARTER_CATALOG) {
      if (!selected.has(normalizeExerciseName(e.name)) || isAdded(e)) continue
      const result = createExercise({
        name: e.name,
        type: e.type,
        bodyPart: e.bodyPart,
        equipment: e.equipment,
        notes: e.cues ?? null,
      })
      if (result.ok && e.animation) await attachAnimation(result.value.id, e.animation)
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
          The full gym exercise library — each comes with a demo animation and form cues. Search for
          what you do, tap to pick, then add. Swap in your own machine photo any time.
        </p>

        <div className="relative mb-4">
          <Search
            size={17}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
          />
          <input
            type="search"
            inputMode="search"
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="Search exercises"
            className="w-full rounded-2xl border border-white/10 bg-surface py-3 pl-10 pr-3 text-[15px] text-white placeholder:text-faint focus:border-neon/40 focus:outline-none"
          />
        </div>

        {visibleAddable.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            className="mb-4 text-[13px] font-semibold text-neon"
          >
            {allVisibleSelected
              ? 'Deselect all'
              : q
                ? `Select all ${visibleAddable.length} matches`
                : 'Select all'}
          </button>
        )}

        {visibleGroups.length === 0 && (
          <p className="mb-4 rounded-2xl bg-surface p-3 text-[13px] text-faint">
            {q ? 'No exercises match your search.' : 'Every exercise is already in your library.'}
          </p>
        )}

        <div className="flex flex-col gap-5">
          {visibleGroups.map((group) => (
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
          className="w-full rounded-2xl bg-white py-[17px] text-base font-bold text-ink transition-transform active:scale-[0.99] disabled:bg-surface disabled:text-faint disabled:opacity-60"
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
