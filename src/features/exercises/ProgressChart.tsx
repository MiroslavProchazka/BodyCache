import { useId } from 'react'
import { scalePoints, linePath, type ProgressPoint } from '@/shared/utils/progress'

const WIDTH = 320
const HEIGHT = 120
const PAD = 14

/**
 * A dependency-free SVG line chart of an exercise's progress (one point per
 * session). Draws a soft filled area, the trend line and a dot per session,
 * with the latest point emphasized. `format` renders metric values for labels.
 */
export function ProgressChart({
  points,
  format,
}: {
  points: readonly ProgressPoint[]
  format: (value: number) => string
}) {
  const gradId = useId()
  const values = points.map((p) => p.value)
  const xy = scalePoints(values, WIDTH, HEIGHT, PAD)
  const line = linePath(xy)
  const area = `${line} L${xy[xy.length - 1].x} ${HEIGHT - PAD} L${xy[0].x} ${HEIGHT - PAD} Z`

  const max = Math.max(...values)
  const min = Math.min(...values)
  const last = points[points.length - 1]

  return (
    <div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Progress over time"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#60E198" stopOpacity="0.28" />
            <stop offset="1" stopColor="#60E198" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke="#60E198" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {xy.map((p, i) => (
          <circle
            key={points[i].sessionId}
            cx={p.x}
            cy={p.y}
            r={i === xy.length - 1 ? 4.5 : 3}
            fill={i === xy.length - 1 ? '#60E198' : '#0F3322'}
            stroke="#60E198"
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-[12px] text-muted">
        <span>
          Low <span className="font-semibold text-soft">{format(min)}</span>
        </span>
        {last && (
          <span>
            Now <span className="font-semibold text-neon">{format(last.value)}</span>
          </span>
        )}
        <span>
          High <span className="font-semibold text-soft">{format(max)}</span>
        </span>
      </div>
    </div>
  )
}
