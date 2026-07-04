import { Plus, Timer, X } from 'lucide-react'
import { formatDuration } from '@/shared/utils/units'
import { useRestTimer } from './RestTimerContext'

/**
 * Floating rest countdown (mock 3b): a full-width pill whose translucent cobalt
 * fill drains left-to-right as the remaining time counts down. Sits above the
 * bottom nav / floating actions so it never blocks them. Keeps quick +15s and
 * skip controls; reads "Rest done" at zero before auto-dismissing.
 */
export function RestTimerBar() {
  const { remaining, total, skip, addTime } = useRestTimer()
  if (remaining == null) return null

  const done = remaining === 0
  const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[96px] z-30 flex justify-center px-[22px]">
      <div
        className={[
          'pointer-events-auto relative flex w-full max-w-md items-center justify-between overflow-hidden rounded-full border px-[18px] py-3 backdrop-blur-md',
          done ? 'border-neon/40 bg-neon/15' : 'border-white/10 bg-surface/95',
        ].join(' ')}
      >
        {!done && (
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, rgba(73,79,223,0.35), rgba(124,130,245,0.18))',
            }}
          />
        )}
        <span
          className={[
            'relative flex items-center gap-2 text-[14px] font-semibold',
            done ? 'text-[#8b90f7]' : 'text-white',
          ].join(' ')}
        >
          <Timer size={16} strokeWidth={2} className="text-[#8b90f7]" />
          {done ? 'Rest done' : 'Rest'}
        </span>
        <span className="relative flex items-center gap-3">
          {!done && (
            <>
              <span className="font-display text-[17px] font-extrabold tnum text-white">
                {formatDuration(remaining)}
              </span>
              <button
                type="button"
                onClick={() => addTime(15)}
                className="inline-flex items-center gap-1 rounded-full bg-inset px-[10px] py-[6px] text-[12.5px] font-semibold text-soft active:scale-[0.96]"
              >
                <Plus size={13} strokeWidth={2.2} />
                15s
              </button>
            </>
          )}
          <button
            type="button"
            onClick={skip}
            aria-label="Skip rest"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/55 active:scale-[0.94]"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </span>
      </div>
    </div>
  )
}
