import { useCallback, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronLeft, Search } from 'lucide-react'
import { allExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Overline } from '@/shared/components/Overline'
import { StickyAction } from '@/shared/components/StickyAction'
import { humanize } from '@/shared/utils/bodyParts'
import { storePhoto } from '@/shared/utils/photos'
import { useDebouncedValue } from '@/shared/utils/useDebouncedValue'
import { useScrollParent } from '@/shared/utils/useScrollParent'
import { useListScrollMargin } from './useListScrollMargin'
import { StarterRow } from './StarterRow'
import {
  flattenStarterGroups,
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
  // Debounce so filtering 1,000+ entries doesn't run on every keystroke.
  const q = normalizeExerciseName(useDebouncedValue(query))

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

  /** One flat, ordered list (headers + items) for the virtualizer. */
  const flatRows = useMemo(() => flattenStarterGroups(visibleGroups), [visibleGroups])

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

  // Stable across renders (functional update, no closure over `selected`) so the
  // memoized rows don't all re-render when one selection changes. Added entries
  // can't reach here — their row is disabled.
  const toggle = useCallback((e: StarterExercise) => {
    const key = normalizeExerciseName(e.name)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

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

  // Virtualize the flat header/item list: only the rows on screen mount, so the
  // full 1,000+ entry catalog renders instantly and scrolls smoothly. Headers
  // (~34px) and rows (~64px) differ in height, so estimate per kind and let
  // measureElement correct. The page scrolls in the AppShell `<main>` column.
  const listRef = useRef<HTMLDivElement>(null)
  const scrollParent = useScrollParent(listRef)
  const scrollMargin = useListScrollMargin(listRef, scrollParent, flatRows.length > 0)
  const virtualizer = useVirtualizer({
    count: flatRows.length,
    getScrollElement: () => scrollParent,
    estimateSize: (i) => (flatRows[i].kind === 'header' ? 34 : 64),
    overscan: 6,
    scrollMargin,
  })

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

        <div ref={listRef}>
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map((v) => {
              const item = flatRows[v.index]
              return (
                <div
                  key={v.key}
                  data-index={v.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${v.start - virtualizer.options.scrollMargin}px)`,
                  }}
                >
                  {item.kind === 'header' ? (
                    <Overline className="pb-[10px] pt-5">{humanize(item.bodyPart)}</Overline>
                  ) : (
                    <div className="pb-2">
                      <StarterRow
                        exercise={item.exercise}
                        added={isAdded(item.exercise)}
                        checked={isSelected(item.exercise)}
                        onToggle={toggle}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
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
