import { Plus, Timer, X } from 'lucide-react'
import { formatDuration } from '@/shared/utils/units'
import { useRestTimer } from './RestTimerContext'

/**
 * Floating rest countdown. Sits above the bottom nav / sticky actions so it
 * never blocks them. Shows the time left with quick +15s and skip controls;
 * reads "Rest done" once it hits zero before auto-dismissing.
 */
export function RestTimerBar() {
  const { remaining, skip, addTime } = useRestTimer()
  if (remaining == null) return null

  const done = remaining === 0

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[96px] z-30 flex justify-center px-5">
      <div
        className={[
          'pointer-events-auto flex items-center gap-3 rounded-full border px-3 py-2 shadow-lg backdrop-blur-md',
          done ? 'border-neon/40 bg-neon/15' : 'border-white/10 bg-surface/95',
        ].join(' ')}
      >
        <span
          className={[
            'flex items-center gap-2 pl-2 text-[15px] font-semibold tnum',
            done ? 'text-neon' : 'text-white',
          ].join(' ')}
        >
          <Timer size={17} strokeWidth={2} className={done ? 'text-neon' : 'text-muted'} />
          {done ? 'Rest done' : formatDuration(remaining)}
        </span>
        {!done && (
          <button
            type="button"
            onClick={() => addTime(15)}
            className="inline-flex items-center gap-1 rounded-full bg-inset px-3 py-[7px] text-[13px] font-semibold text-soft active:scale-[0.96]"
          >
            <Plus size={14} strokeWidth={2.2} />
            15s
          </button>
        )}
        <button
          type="button"
          onClick={skip}
          aria-label="Skip rest"
          className="flex h-8 w-8 items-center justify-center rounded-full text-faint active:scale-[0.94]"
        >
          <X size={18} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
