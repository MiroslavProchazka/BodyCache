import { memo, useMemo, useRef, useState, useTransition, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Plus } from 'lucide-react'
import type { ExerciseRow } from '@/evolu/rows'
import { BODY_PARTS } from '@/evolu/schema'
import type { ExerciseId, ExercisePhotoId } from '@/evolu/schema'
import { SearchField } from '@/shared/components/SearchField'
import { FilterChips } from '@/shared/components/FilterChips'
import { ViewToggle } from '@/shared/components/ViewToggle'
import { humanize } from '@/shared/utils/bodyParts'
import { useDebouncedValue } from '@/shared/utils/useDebouncedValue'
import { useScrollParent } from '@/shared/utils/useScrollParent'
import { chunk } from '@/shared/utils/chunk'
import { ExerciseTile } from './ExerciseTile'
import { useListScrollMargin } from './useListScrollMargin'
import { useLibraryView, type LibraryView } from './useLibraryView'
import { matchesExerciseFilter } from './exerciseFilter'

const CHIP_OPTIONS = [
  { value: 'all', label: 'All' },
  ...BODY_PARTS.map((p) => ({ value: p, label: humanize(p) })),
]

const ROW_ESTIMATE = 72
const GRID_ROW_ESTIMATE = 236
const MAX_FAVORITES = 12

interface ExercisePickerListProps {
  /** The full candidate list (already query-filtered, e.g. non-deleted). */
  exercises: readonly ExerciseRow[]
  /** Recent/favorite exercises to pin above the full list. */
  favorites?: readonly ExerciseRow[]
  /** The trailing-plus action — logs/adds the pick immediately. Keep stable. */
  onPick: (id: ExerciseId) => void
  /**
   * Optional body-tap handler (TWEAK T3 selection mode): when set, tapping a
   * row/card body opens it (e.g. exercise detail) while the plus still picks.
   * When omitted, the whole row is a single pick target (the classic picker).
   */
  onOpen?: (id: ExerciseId) => void
  /** Secondary line for a row (last-performance summary, meta line, …). */
  subtitleFor: (exercise: ExerciseRow) => string
  /** Optional slot rendered between the filters and the list (e.g. a "Create new" CTA). */
  header?: ReactNode
}

/**
 * The shared, virtualized exercise picker used by every "Add exercise" flow.
 * Owns search (debounced), body-part chips, a grid/list toggle (TWEAK T1) and
 * windowing so only on-screen items mount. A trailing plus picks; an optional
 * `onOpen` splits the body tap for the in-workout selection mode (T3).
 */
export function ExercisePickerList({
  exercises,
  favorites = [],
  onPick,
  onOpen,
  subtitleFor,
  header,
}: ExercisePickerListProps) {
  const [search, setSearch] = useState('')
  const [part, setPart] = useState<string | null>(null)
  const [view, setView] = useLibraryView()
  const [, startTransition] = useTransition()

  const debouncedSearch = useDebouncedValue(search)

  const filtered = useMemo(
    () => exercises.filter((e) => matchesExerciseFilter(e, debouncedSearch, part)),
    [exercises, debouncedSearch, part],
  )
  const visibleFavorites = useMemo(
    () =>
      favorites
        .filter((e) => matchesExerciseFilter(e, debouncedSearch, part))
        .slice(0, MAX_FAVORITES),
    [favorites, debouncedSearch, part],
  )

  const changePart = (next: string | null) => startTransition(() => setPart(next))

  return (
    <>
      <div className="mb-[14px]">
        <SearchField value={search} onChange={setSearch} />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <FilterChips
            options={CHIP_OPTIONS}
            value={part}
            onChange={changePart}
            allValue="all"
            ariaLabel="Filter by body part"
          />
        </div>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {header}

      {visibleFavorites.length > 0 && (
        <section aria-label="Favorites" className="mb-[18px]">
          <h2 className="mb-[10px] font-display text-[17px] font-semibold tracking-tight text-white">
            Favorites
          </h2>
          <div className={view === 'grid' ? 'grid grid-cols-2 gap-x-3 gap-y-[18px]' : 'flex flex-col gap-[10px]'}>
            {visibleFavorites.map((exercise) => (
              <PickerItem
                key={exercise.id}
                exercise={exercise}
                subtitle={subtitleFor(exercise)}
                view={view}
                onPick={onPick}
                onOpen={onOpen}
              />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-faint">
          {exercises.length === 0
            ? 'Your library is empty — create your first exercise.'
            : 'No exercises match.'}
        </p>
      ) : (
        <>
          {visibleFavorites.length > 0 && (
            <h2 className="mb-[10px] font-display text-[17px] font-semibold tracking-tight text-white">
              All exercises
            </h2>
          )}
          <VirtualizedPickerRows
            exercises={filtered}
            view={view}
            onPick={onPick}
            onOpen={onOpen}
            subtitleFor={subtitleFor}
            revision={visibleFavorites.length + (view === 'list' ? 100000 : 0)}
          />
        </>
      )}
    </>
  )
}

const VirtualizedPickerRows = memo(function VirtualizedPickerRows({
  exercises,
  view,
  onPick,
  onOpen,
  subtitleFor,
  revision,
}: {
  exercises: readonly ExerciseRow[]
  view: LibraryView
  onPick: (id: ExerciseId) => void
  onOpen?: (id: ExerciseId) => void
  subtitleFor: (exercise: ExerciseRow) => string
  revision: number
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const scrollParent = useScrollParent(listRef)
  const scrollMargin = useListScrollMargin(listRef, scrollParent, exercises.length > 0, revision)
  const cols = view === 'grid' ? 2 : 1
  const rows = useMemo(() => chunk(exercises, cols), [exercises, cols])
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollParent,
    estimateSize: () => (view === 'grid' ? GRID_ROW_ESTIMATE : ROW_ESTIMATE),
    overscan: 6,
    scrollMargin,
  })

  return (
    <div ref={listRef}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((v) => (
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
            <div className={view === 'grid' ? 'grid grid-cols-2 gap-x-3 gap-y-[18px] pb-[18px]' : 'pb-[10px]'}>
              {rows[v.index].map((exercise) => (
                <PickerItem
                  key={exercise.id}
                  exercise={exercise}
                  subtitle={subtitleFor(exercise)}
                  view={view}
                  onPick={onPick}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

/**
 * A picker entry. With no `onOpen` it's a single button that picks (classic
 * picker). With `onOpen`, the body opens the detail and the trailing plus picks
 * — rendered as sibling buttons (can't nest buttons).
 */
const PickerItem = memo(function PickerItem({
  exercise,
  subtitle,
  view,
  onPick,
  onOpen,
}: {
  exercise: ExerciseRow
  subtitle: string
  view: LibraryView
  onPick: (id: ExerciseId) => void
  onOpen?: (id: ExerciseId) => void
}) {
  const id = exercise.id as ExerciseId
  const tile = (
    <ExerciseTile
      photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
      bodyPart={exercise.bodyPart}
      radius={view === 'grid' ? '16px 16px 16px 5px' : '14px'}
      className={view === 'grid' ? 'h-[150px] w-full' : 'h-[46px] w-[46px] flex-none'}
      glyphSize={view === 'grid' ? 34 : 23}
      fit="cover"
    />
  )
  const plus = (
    <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-neon/[0.16] text-[#8b90f7]">
      <Plus size={18} strokeWidth={2} />
    </span>
  )
  const name = (
    <div className="truncate text-[15px] font-semibold text-white">{exercise.name}</div>
  )
  const meta = <div className="mt-[2px] truncate text-[12.5px] text-muted">{subtitle}</div>

  if (view === 'grid') {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => (onOpen ?? onPick)(id)}
          className="w-full text-left transition-transform active:scale-[0.99]"
        >
          {tile}
          <div className="mt-[10px] pr-[38px]">
            {name}
            {meta}
          </div>
        </button>
        <button
          type="button"
          aria-label={`Add ${exercise.name}`}
          onClick={() => onPick(id)}
          className="absolute bottom-0 right-0"
        >
          {plus}
        </button>
      </div>
    )
  }

  // List row.
  if (onOpen) {
    return (
      <div className="flex items-center gap-[13px]">
        <button
          type="button"
          onClick={() => onOpen(id)}
          className="flex min-h-[44px] min-w-0 flex-1 items-center gap-[13px] text-left transition-transform active:scale-[0.99]"
        >
          {tile}
          <div className="min-w-0 flex-1">
            {name}
            {meta}
          </div>
        </button>
        <button type="button" aria-label={`Add ${exercise.name}`} onClick={() => onPick(id)}>
          {plus}
        </button>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onPick(id)}
      className="flex min-h-[44px] w-full items-center gap-[13px] text-left transition-transform active:scale-[0.99]"
    >
      {tile}
      <div className="min-w-0 flex-1">
        {name}
        {meta}
      </div>
      {plus}
    </button>
  )
})
