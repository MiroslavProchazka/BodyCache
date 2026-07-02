import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Plus, Dumbbell, ListPlus } from 'lucide-react'
import { allExercises, performedExercises } from '@/evolu/queries'
import type { ExerciseRow } from '@/evolu/rows'
import { BODY_PARTS } from '@/evolu/schema'
import { SearchField } from '@/shared/components/SearchField'
import { FilterChips } from '@/shared/components/FilterChips'
import { Button } from '@/shared/components/Button'
import { humanize } from '@/shared/utils/bodyParts'
import { chunk } from '@/shared/utils/chunk'
import { useDebouncedValue } from '@/shared/utils/useDebouncedValue'
import { useScrollParent } from '@/shared/utils/useScrollParent'
import { useListScrollMargin } from './useListScrollMargin'
import { ExerciseCard } from './ExerciseCard'

const CHIP_OPTIONS = [
  { value: 'all', label: 'All' },
  ...BODY_PARTS.map((p) => ({ value: p, label: humanize(p) })),
]

/** Two cards per grid row; each row slot reserves card height + the 12px gap. */
const COLS = 2
const ROW_ESTIMATE = 212

/**
 * Browse / search all exercises; entry to detail and create. Exercises the
 * user has logged before surface in a Favourites section above the full
 * catalog, so the everyday handful is reachable without scrolling hundreds.
 */
export function ExerciseLibraryPage() {
  const navigate = useNavigate()
  const exercises = useQuery(allExercises)
  const performed = useQuery(performedExercises)
  const [search, setSearch] = useState('')
  const [part, setPart] = useState<string | null>(null)

  // Debounce so filtering 1,000+ exercises doesn't run on every keystroke.
  const debouncedSearch = useDebouncedValue(search)

  // Favourites = exercises the user has actually logged in a finished workout,
  // most recently performed first — the handful they use, surfaced above the
  // full catalog. `performedExercises` repeats rows per completed set, so
  // de-duplicate by id and resolve each to its live library row.
  const favourites = useMemo(() => {
    const byId = new Map(exercises.map((e) => [e.id, e]))
    const seen = new Set<string>()
    const result: ExerciseRow[] = []
    for (const row of performed) {
      if (seen.has(row.id)) continue
      seen.add(row.id)
      const exercise = byId.get(row.id)
      if (exercise) result.push(exercise)
    }
    return result
  }, [exercises, performed])

  const matchesFilter = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    return (e: ExerciseRow) => {
      if (part && e.bodyPart !== part) return false
      if (!q) return true
      return [e.name, e.bodyPart, e.equipment]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    }
  }, [debouncedSearch, part])

  const filtered = useMemo(() => exercises.filter(matchesFilter), [exercises, matchesFilter])
  const favouritesFiltered = useMemo(
    () => favourites.filter(matchesFilter),
    [favourites, matchesFilter],
  )

  const rows = useMemo(() => chunk(filtered, COLS), [filtered])

  // Virtualize the grid so only the cards on screen mount — each card runs its
  // own history query + IndexedDB photo read, so without this a 1,000-exercise
  // library would fire thousands of queries at once. The page scrolls in the
  // AppShell `<main>` column, so the virtualizer watches that ancestor.
  const listRef = useRef<HTMLDivElement>(null)
  const scrollParent = useScrollParent(listRef)
  // The Favourites section sits above the virtualized grid and resizes as the
  // filter changes, so its row count doubles as the re-measure revision.
  const scrollMargin = useListScrollMargin(
    listRef,
    scrollParent,
    filtered.length > 0,
    favouritesFiltered.length,
  )
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollParent,
    estimateSize: () => ROW_ESTIMATE,
    overscan: 4,
    scrollMargin,
  })

  const hasAny = exercises.length > 0

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-[26px] font-semibold tracking-tight text-white">
          Exercises
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/library/starter')}
            aria-label="Add from starter library"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-white/10 bg-surface text-soft"
          >
            <ListPlus size={21} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/library/new')}
            aria-label="Create exercise"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-neon text-ink"
          >
            <Plus size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      {hasAny && (
        <>
          <div className="mb-[14px]">
            <SearchField value={search} onChange={setSearch} />
          </div>
          <div className="mb-[18px]">
            <FilterChips
              options={CHIP_OPTIONS}
              value={part}
              onChange={setPart}
              allValue="all"
              ariaLabel="Filter by body part"
            />
          </div>
        </>
      )}

      {!hasAny ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-inset text-neon">
            <Dumbbell size={28} strokeWidth={1.75} />
          </div>
          <h2 className="font-display text-lg font-semibold text-white">No exercises yet</h2>
          <p className="max-w-xs text-sm text-muted">
            Add the basics from the starter library, or create your own — snap a photo of the
            machine, name it, and you're set.
          </p>
          <Button className="mt-2" onClick={() => navigate('/library/starter')}>
            <ListPlus size={18} strokeWidth={2} /> Add starter exercises
          </Button>
          <Button variant="outline" onClick={() => navigate('/library/new')}>
            <Plus size={18} strokeWidth={2} /> Create exercise
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-faint">No exercises match.</p>
      ) : (
        <>
          {favouritesFiltered.length > 0 && (
            <section aria-label="Favourites" className="mb-[18px]">
              <h2 className="mb-[14px] font-display text-[17px] font-semibold tracking-tight text-white">
                Favourites
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {favouritesFiltered.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            </section>
          )}
          {favouritesFiltered.length > 0 && (
            <h2 className="mb-[14px] font-display text-[17px] font-semibold tracking-tight text-white">
              All exercises
            </h2>
          )}
          <div ref={listRef}>
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map((row) => (
                <div
                  key={row.key}
                  data-index={row.index}
                  ref={virtualizer.measureElement}
                  className="grid grid-cols-2 gap-3 pb-3"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)`,
                  }}
                >
                  {rows[row.index].map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
