import { memo } from 'react'
import { Check } from 'lucide-react'
import { metaLine } from '@/shared/utils/bodyParts'
import type { StarterExercise } from './starterCatalog'

interface StarterRowProps {
  exercise: StarterExercise
  /** Already in the library — shown dimmed and not selectable. */
  added: boolean
  /** Currently selected for adding. */
  checked: boolean
  onToggle: (exercise: StarterExercise) => void
}

/**
 * One selectable row in the starter picker. Memoized so toggling a single
 * selection (which re-renders the virtualized list) only re-renders the row
 * whose `checked`/`added` actually changed — important with 1,000+ rows.
 */
export const StarterRow = memo(function StarterRow({
  exercise,
  added,
  checked,
  onToggle,
}: StarterRowProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(exercise)}
      disabled={added}
      aria-pressed={!added && checked}
      className={[
        'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
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
          added || checked ? 'border-neon bg-neon text-ink' : 'border-white/20 text-transparent',
        ].join(' ')}
      >
        <Check size={15} strokeWidth={2.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-semibold text-white">
          {exercise.name}
        </span>
        <span className="block truncate text-[11.5px] text-faint">
          {metaLine(exercise.bodyPart, exercise.equipment)}
        </span>
      </span>
      {added && (
        <span className="flex-none text-[11px] font-semibold uppercase tracking-wide text-faint">
          Added
        </span>
      )}
    </button>
  )
})
