import type { ProgressPoint } from '@/shared/utils/progress'

const TRACK_PX = 120
const MIN_PX = 20

/**
 * A dependency-free bar chart of an exercise's progress (one bar per session,
 * oldest → newest). Bars sit on the flat black canvas: every bar is `track`
 * gray except the latest session, which gets the cobalt gradient (SPEC §5.7).
 * `format` renders metric values for the low / now / high labels.
 */
export function ProgressChart({
  points,
  format,
}: {
  points: readonly ProgressPoint[]
  format: (value: number) => string
}) {
  const values = points.map((p) => p.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min
  const last = points[points.length - 1]

  return (
    <div>
      <div className="flex items-end gap-[6px]" style={{ height: TRACK_PX }}>
        {points.map((p, i) => {
          const pct = range > 0 ? (p.value - min) / range : 1
          const height = Math.round(MIN_PX + pct * (TRACK_PX - MIN_PX))
          const latest = i === points.length - 1
          return (
            <div
              key={p.sessionId}
              className="flex-1 rounded-[5px]"
              style={{
                height,
                background: latest ? 'linear-gradient(180deg,#7c82f5,#494fdf)' : '#1c1e22',
              }}
            />
          )
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px] text-faint">
        <span>
          Low <span className="font-semibold tnum text-soft">{format(min)}</span>
        </span>
        {last && (
          <span>
            Now <span className="font-semibold tnum text-[#8b90f7]">{format(last.value)}</span>
          </span>
        )}
        <span>
          High <span className="font-semibold tnum text-soft">{format(max)}</span>
        </span>
      </div>
    </div>
  )
}
