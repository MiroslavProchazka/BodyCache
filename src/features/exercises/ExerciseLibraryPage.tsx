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
import { Overline } from '@/shared/components/Overline'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { ViewToggle } from '@/shared/components/ViewToggle'
import { humanize } from '@/shared/utils/bodyParts'
import { chunk } from '@/shared/utils/chunk'
import { useDebouncedValue } from '@/shared/utils/useDebouncedValue'
import { useScrollParent } from '@/shared/utils/useScrollParent'
import { useListScrollMargin } from './useListScrollMargin'
import { ExerciseCard } from './ExerciseCard'
import { useLibraryView } from './useLibraryView'
import { useLastPerformanceIndex } from './useLastPerformanceIndex'

const CHIP_OPTIONS = [
  { value: 'all', label: 'All' },
  ...BODY_PARTS.map((p) => ({ value: p, label: humanize(p) })),
]

/** Two cards per grid row; each row slot reserves card height + the 12px gap. */
const COLS = 2
const ROW_ESTIMATE = 236
const MAX_FAVORITES = 12

/**
 * Browse / search all exercises; entry to detail and create. Exercises the
 * user has logged before surface in a Favorites section above the full
 * catalog, so the everyday handful is reachable without scrolling hundreds.
 */
export function ExerciseLibraryPage() {
  const navigate = useNavigate()
  const exercises = useQuery(allExercises)
  const performed = useQuery(performedExercises)
  // One aggregate query for every card's "last time" label + trend, replacing
  // the per-card history join that used to fire once per rendered card.
  const performanceIndex = useLastPerformanceIndex()
  const [search, setSearch] = useState('')
  const [part, setPart] = useState<string | null>(null)
  const [view, setView] = useLibraryView()

  // Debounce so filtering 1,000+ exercises doesn't run on every keystroke.
  const debouncedSearch = useDebouncedValue(search)

  // Favorites = exercises logged in finished workouts, newest first. Resolve
  // the performed rows back to live library rows so edits/deletes stay current.
  const favorites = useMemo(() => {
    const byId = new Map<string, ExerciseRow>(exercises.map((e) => [e.id, e]))
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
  const favoritesFiltered = useMemo(
    () => favorites.filter(matchesFilter).slice(0, MAX_FAVORITES),
    [favorites, matchesFilter],
  )

  const cols = view === 'grid' ? COLS : 1
  const rows = useMemo(() => chunk(filtered, cols), [filtered, cols])
  const rowEstimate = view === 'grid' ? ROW_ESTIMATE : 80

  // Virtualize the grid so only the cards on screen mount — each card runs its
  // own history query + IndexedDB photo read, so without this a 1,000-exercise
  // library would fire thousands of queries at once. The page scrolls in the
  // AppShell `<main>` column, so the virtualizer watches that ancestor.
  const listRef = useRef<HTMLDivElement>(null)
  const scrollParent = useScrollParent(listRef)
  // The Favorites section sits above the virtualized grid and resizes as the
  // filter changes, so its row count doubles as the re-measure revision.
  const scrollMargin = useListScrollMargin(
    listRef,
    scrollParent,
    filtered.length > 0,
    // Re-measure when Favorites resize OR the view mode flips (row heights change).
    favoritesFiltered.length + (view === 'list' ? 100000 : 0),
  )
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollParent,
    estimateSize: () => rowEstimate,
    overscan: 4,
    scrollMargin,
  })

  const hasAny = exercises.length > 0

  return (
    <>
    <div className="px-[22px] pb-[130px] pt-[14px]">
      <header className="mb-[18px] flex items-center justify-between">
        <h1 className="font-display text-[24px] font-semibold tracking-[-0.02em] text-white">
          Exercises
        </h1>
        <div className="flex items-center gap-2">
          {hasAny && <ViewToggle view={view} onChange={setView} />}
          <button
            type="button"
            onClick={() => navigate('/library/starter')}
            aria-label="Add from starter library"
            className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[14px] border border-white/10 bg-surface text-soft"
          >
            <ListPlus size={21} strokeWidth={2} />
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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-inset text-[#8b90f7]">
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
          {favoritesFiltered.length > 0 && (
            <section aria-label="Favorites" className="mb-[22px]">
              <Overline className="mb-[14px]">Favorites</Overline>
              <div
                className={
                  view === 'grid'
                    ? 'grid grid-cols-2 gap-x-3 gap-y-[18px]'
                    : 'flex flex-col gap-[16px]'
                }
              >
                {favoritesFiltered.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    summary={performanceIndex.get(exercise.id)}
                    view={view}
                  />
                ))}
              </div>
            </section>
          )}
          {favoritesFiltered.length > 0 && <Overline className="mb-[14px]">All exercises</Overline>}
          <div ref={listRef}>
            <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
              {virtualizer.getVirtualItems().map((row) => (
                <div
                  key={row.key}
                  data-index={row.index}
                  ref={virtualizer.measureElement}
                  className={
                    view === 'grid' ? 'grid grid-cols-2 gap-3 pb-3' : 'flex flex-col pb-[16px]'
                  }
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)`,
                  }}
                >
                  {rows[row.index].map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      summary={performanceIndex.get(exercise.id)}
                      view={view}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    {hasAny && (
      <FloatingAction raised>
        <ActionPill
          label="New exercise"
          icon={<Plus size={19} strokeWidth={2} />}
          onClick={() => navigate('/library/new')}
        />
      </FloatingAction>
    )}
    </>
  )
}
