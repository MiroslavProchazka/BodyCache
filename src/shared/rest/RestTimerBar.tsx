import { Plus, Timer, X } from 'lucide-react'
import { formatDuration } from '@/shared/utils/units'
import { useRestTimer } from './RestTimerContext'

/**
 * Floating rest countdown (SPEC §5.4 pill language). A full-width surface pill
 * with a translucent cobalt gradient fill that drains left-to-right as the
 * remaining time counts down; quick +15s and skip controls sit on the right.
 * Reads "Rest done" once it hits zero, then auto-dismisses. Sits above the
 * bottom nav / floating actions so it never blocks them.
 */
export function RestTimerBar() {
  const { remaining, total, skip, addTime } = useRestTimer()
  if (remaining == null) return null

  const done = remaining === 0
  const pct = done ? 100 : total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[100px] z-30 px-[22px]">
      <div className="mx-auto max-w-md">
        <div className="pointer-events-auto relative flex items-center justify-between overflow-hidden rounded-full border border-white/10 bg-surface px-[18px] py-3">
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${pct}%`,
              background: done
                ? 'rgba(73,79,223,0.22)'
                : 'linear-gradient(90deg, rgba(73,79,223,0.35), rgba(124,130,245,0.18))',
              transition: 'width 250ms linear',
            }}
          />
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
                <button
                  type="button"
                  onClick={() => addTime(15)}
                  className="inline-flex items-center gap-[2px] rounded-full bg-inset px-[10px] py-[6px] text-[12.5px] font-semibold text-soft active:scale-[0.96]"
                >
                  <Plus size={13} strokeWidth={2.2} />
                  15s
                </button>
                <span className="font-display text-[17px] font-extrabold tnum text-white">
                  {formatDuration(remaining)}
                </span>
              </>
            )}
            <button
              type="button"
              onClick={skip}
              aria-label="Skip rest"
              className="flex h-7 w-7 items-center justify-center rounded-full text-faint active:scale-[0.94]"
            >
              <X size={17} strokeWidth={2} />
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
