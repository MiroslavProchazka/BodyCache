export interface BarWeekDay {
  /** Single-letter weekday label. */
  readonly label: string
  /** Magnitude driving the bar height (e.g. daily volume in kg). */
  readonly value: number
  /** Whether anything was logged that day. */
  readonly active: boolean
  /** Whether this column is today. */
  readonly isToday: boolean
}

interface BarWeekProps {
  days: readonly BarWeekDay[]
  /** Track height in px (SPEC §5.7 — up to ~84). */
  trackPx?: number
  className?: string
}

const REST_PX = 6
const MIN_ACTIVE_PX = 12

/**
 * Full-width 7-day bar chart (SPEC §5.7): inactive days are short `track`
 * stubs, active days scale up as a cobalt gradient fill, and today-if-empty
 * gets a dashed outline so the current day is always visible.
 */
export function BarWeek({ days, trackPx = 84, className = '' }: BarWeekProps) {
  const max = Math.max(...days.map((d) => d.value), 0)
  const range = trackPx - MIN_ACTIVE_PX

  return (
    <div
      className={['flex items-end justify-between gap-2', className].join(' ')}
      style={{ height: trackPx }}
    >
      {days.map((d, i) => {
        const height =
          d.active && max > 0 ? Math.round(MIN_ACTIVE_PX + (d.value / max) * range) : REST_PX
        const labelColor = d.isToday ? 'text-white' : d.active ? 'text-muted' : 'text-faint'
        const dashedToday = d.isToday && !d.active
        return (
          <div
            key={i}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              className="w-full rounded-[7px]"
              style={{
                height,
                background: d.active ? 'linear-gradient(180deg,#7c82f5,#494fdf)' : '#1c1e22',
                ...(dashedToday
                  ? { outline: '1px dashed rgba(255,255,255,0.25)', outlineOffset: '2px' }
                  : {}),
              }}
            />
            <div
              className={`text-[10.5px] ${d.isToday ? 'font-bold' : 'font-semibold'} ${labelColor}`}
            >
              {d.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
