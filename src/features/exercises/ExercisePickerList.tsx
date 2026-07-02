import { memo, useMemo, useRef, useState, useTransition, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Plus } from 'lucide-react'
import type { ExerciseRow } from '@/evolu/rows'
import { BODY_PARTS } from '@/evolu/schema'
import type { ExerciseId, ExercisePhotoId } from '@/evolu/schema'
import { SearchField } from '@/shared/components/SearchField'
import { FilterChips } from '@/shared/components/FilterChips'
import { humanize } from '@/shared/utils/bodyParts'
import { useDebouncedValue } from '@/shared/utils/useDebouncedValue'
import { useScrollParent } from '@/shared/utils/useScrollParent'
import { ExerciseTile } from './ExerciseTile'
import { useListScrollMargin } from './useListScrollMargin'
import { matchesExerciseFilter } from './exerciseFilter'

const CHIP_OPTIONS = [
  { value: 'all', label: 'All' },
  ...BODY_PARTS.map((p) => ({ value: p, label: humanize(p) })),
]

/** A single row: photo tile + name + a caller-supplied subtitle + pick affordance. */
const ROW_ESTIMATE = 72

interface ExercisePickerListProps {
  /** The full candidate list (already query-filtered, e.g. non-deleted). */
  exercises: readonly ExerciseRow[]
  /** Called with the picked exercise's id when a row is tapped. Keep stable. */
  onPick: (id: ExerciseId) => void
  /**
   * Secondary line for a row (last-performance summary, meta line, …). Called
   * once per rendered row; the result string is what the memoized row compares
   * on, so an unstable function reference is fine.
   */
  subtitleFor: (exercise: ExerciseRow) => string
  /** Optional slot rendered between the filters and the list (e.g. a "Create new" CTA). */
  header?: ReactNode
}

/**
 * The shared, virtualized exercise picker used by every "Add exercise" flow
 * (workout, edit-session, plan). It owns search (debounced), body-part chips,
 * filtering and windowing so only on-screen rows mount — a 1,000-exercise
 * library no longer renders (or, with the W1 index, queries) every row at once.
 * Callers keep their own page header, pick handler and row subtitle.
 */
export function ExercisePickerList({
  exercises,
  onPick,
  subtitleFor,
  header,
}: ExercisePickerListProps) {
  const [search, setSearch] = useState('')
  const [part, setPart] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // Debounce so filtering 1,000+ exercises doesn't run on every keystroke.
  const debouncedSearch = useDebouncedValue(search)

  const filtered = useMemo(
    () => exercises.filter((e) => matchesExerciseFilter(e, debouncedSearch, part)),
    [exercises, debouncedSearch, part],
  )

  // Chip changes re-filter the whole list; defer that work so the chip itself
  // stays responsive. Typing is already deferred by the debounce above.
  const changePart = (next: string | null) => startTransition(() => setPart(next))

  // Virtualize the flat row list: only on-screen rows mount. The page scrolls in
  // the AppShell `<main>` column, so the virtualizer watches that ancestor and
  // offsets by the header/search/chips height above the list.
  const listRef = useRef<HTMLDivElement>(null)
  const scrollParent = useScrollParent(listRef)
  const scrollMargin = useListScrollMargin(listRef, scrollParent, filtered.length > 0)
  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollParent,
    estimateSize: () => ROW_ESTIMATE,
    overscan: 6,
    scrollMargin,
  })

  return (
    <>
      <div className="mb-[14px]">
        <SearchField value={search} onChange={setSearch} />
      </div>

      <div className="mb-4">
        <FilterChips
          options={CHIP_OPTIONS}
          value={part}
          onChange={changePart}
          allValue="all"
          ariaLabel="Filter by body part"
        />
      </div>

      {header}

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-faint">
          {exercises.length === 0
            ? 'Your library is empty — create your first exercise.'
            : 'No exercises match.'}
        </p>
      ) : (
        <div ref={listRef}>
          <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
            {virtualizer.getVirtualItems().map((v) => {
              const exercise = filtered[v.index]
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
                  <div className="pb-[10px]">
                    <PickerRow
                      exercise={exercise}
                      subtitle={subtitleFor(exercise)}
                      onPick={onPick}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

/**
 * A picker row. Memoized so a parent re-render (typing, a sibling selection)
 * only re-renders rows whose `exercise`/`subtitle` actually changed — `onPick`
 * is expected to be stable.
 */
const PickerRow = memo(function PickerRow({
  exercise,
  subtitle,
  onPick,
}: {
  exercise: ExerciseRow
  subtitle: string
  onPick: (id: ExerciseId) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(exercise.id as ExerciseId)}
      className="flex w-full items-center gap-[13px] rounded-2xl border border-white/[0.07] bg-surface p-3 text-left"
    >
      <ExerciseTile
        photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
        bodyPart={exercise.bodyPart}
        radius="14px"
        className="h-[46px] w-[46px] flex-none"
        glyphSize={23}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15.5px] font-semibold tracking-tight text-white">
          {exercise.name}
        </div>
        <div className="mt-[2px] truncate text-[12.5px] text-muted">{subtitle}</div>
      </div>
      <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-neon/[0.12] text-neon">
        <Plus size={18} strokeWidth={2} />
      </div>
    </button>
  )
})
