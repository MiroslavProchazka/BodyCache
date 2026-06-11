import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Trend } from '@/shared/utils/exerciseStats'
import { toDisplayWeight, type Unit } from '@/shared/utils/units'

/** Format a trend's signed delta in the active unit ("+2.5 kg", "−1 reps"). */
const trendLabel = (trend: Trend, unit: Unit): string => {
  if (trend.dir === 'new') return 'New'
  if (trend.dir === 'flat') return 'Same'
  const abs = Math.abs(trend.delta)
  const value =
    trend.field === 'weight'
      ? `${toDisplayWeight(abs, unit)} ${unit}`
      : trend.field === 'reps'
        ? `${abs} reps`
        : trend.field === 'duration'
          ? `${abs}s`
          : `${abs} m`
  return `${trend.dir === 'up' ? '+' : '−'}${value}`
}

interface TrendBadgeProps {
  trend: Trend
  unit: Unit
  /** Library grid uses just the arrow; everywhere else shows the label. */
  iconOnly?: boolean
  size?: number
}

/**
 * Compares the top-set of the latest session vs. the one before: neon "up",
 * orange "down", muted "Same"/"New". Always nowrap.
 */
export function TrendBadge({ trend, unit, iconOnly = false, size = 14 }: TrendBadgeProps) {
  const color =
    trend.dir === 'up' ? 'text-neon' : trend.dir === 'down' ? 'text-down' : 'text-faint'

  if (iconOnly) {
    if (trend.dir === 'up') return <TrendingUp size={size} className="text-neon" />
    if (trend.dir === 'down') return <TrendingDown size={size} className="text-down" />
    return null
  }

  return (
    <span
      className={['inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold', color].join(
        ' ',
      )}
    >
      {trend.dir === 'up' && <TrendingUp size={size} />}
      {trend.dir === 'down' && <TrendingDown size={size} />}
      {trendLabel(trend, unit)}
    </span>
  )
}
