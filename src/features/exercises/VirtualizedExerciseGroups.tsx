import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { ExerciseRow } from '@/evolu/rows'
import { humanize } from '@/shared/utils/bodyParts'
import { chunk } from '@/shared/utils/chunk'
import { useScrollParent } from '@/shared/utils/useScrollParent'
import { useListScrollMargin } from './useListScrollMargin'
import type { LibraryView } from './useLibraryView'

export interface ExerciseGroup {
  part: string
  exercises: readonly ExerciseRow[]
}

type GroupRow =
  | { kind: 'heading'; key: string; part: string; first: boolean }
  | { kind: 'items'; key: string; exercises: readonly ExerciseRow[] }

interface VirtualizedExerciseGroupsProps {
  groups: readonly ExerciseGroup[]
  view: LibraryView
  renderItem: (exercise: ExerciseRow) => ReactNode
  headingClassName: string
  headingGapClassName: string
  itemRowClassName: (view: LibraryView) => string
  estimateItemRow: (view: LibraryView) => number
  estimateHeading?: (first: boolean) => number
  overscan?: number
  onTotalSizeChange: (size: number) => void
}

/**
 * Windowed body-part groups for the favorites sections. Flattening headings
 * and card rows into one virtual sequence keeps even a single very large body
 * part bounded, while the measured total lets the list below stay aligned.
 */
export function VirtualizedExerciseGroups({
  groups,
  view,
  renderItem,
  headingClassName,
  headingGapClassName,
  itemRowClassName,
  estimateItemRow,
  estimateHeading = (first) => (first ? 28 : 50),
  overscan = 4,
  onTotalSizeChange,
}: VirtualizedExerciseGroupsProps) {
  const columns = view === 'grid' ? 2 : 1
  const rows = useMemo<GroupRow[]>(
    () =>
      groups.flatMap((group, groupIndex) => [
        {
          kind: 'heading' as const,
          key: `heading:${group.part}`,
          part: group.part,
          first: groupIndex === 0,
        },
        ...chunk(group.exercises, columns).map((exercises, rowIndex) => ({
          kind: 'items' as const,
          key: `items:${group.part}:${rowIndex}:${exercises.map((exercise) => exercise.id).join(',')}`,
          exercises,
        })),
      ]),
    [columns, groups],
  )

  const listRef = useRef<HTMLDivElement>(null)
  const scrollParent = useScrollParent(listRef)
  const layoutKey = rows.map((row) => row.key).join('|')
  const scrollMargin = useListScrollMargin(
    listRef,
    scrollParent,
    rows.length > 0,
    `${view}:${layoutKey}`,
  )
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollParent,
    estimateSize: (index) => {
      const row = rows[index]
      return row?.kind === 'heading' ? estimateHeading(row.first) : estimateItemRow(view)
    },
    getItemKey: (index) => rows[index]?.key ?? index,
    overscan,
    scrollMargin,
  })
  const totalSize = virtualizer.getTotalSize()

  useEffect(() => onTotalSizeChange(totalSize), [onTotalSizeChange, totalSize])

  return (
    <div ref={listRef}>
      <div style={{ height: totalSize, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index]
          if (!row) return null
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              {row.kind === 'heading' ? (
                <h3 className={[headingClassName, row.first ? '' : headingGapClassName].join(' ')}>
                  {humanize(row.part)}
                </h3>
              ) : (
                <div className={itemRowClassName(view)}>{row.exercises.map(renderItem)}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
