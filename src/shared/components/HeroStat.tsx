import type { ReactNode } from 'react'

interface HeroStatProps {
  /** Intro line above the number, e.g. "This week you've lifted". */
  intro?: ReactNode
  /** The one big tabular number for the screen. */
  value: ReactNode
  /** Unit shown beside the number, e.g. "kg". */
  unit?: ReactNode
  /** Chip row rendered under the number (TrendChip / PrChip / StreakChip). */
  chips?: ReactNode
  /** Hero font size in px (SPEC: 44–56). */
  size?: number
  className?: string
}

/**
 * The screen's single "hero number" (SPEC §5.3): an optional intro line, one
 * huge Inter-Tight tabular number with a muted unit beside it, and an optional
 * chip row. One per screen — secondary stats read as meta rows elsewhere.
 */
export function HeroStat({ intro, value, unit, chips, size = 56, className = '' }: HeroStatProps) {
  return (
    <div className={className}>
      {intro != null && (
        <div className="mb-[6px] text-[13.5px] font-medium text-muted">{intro}</div>
      )}
      <div className="flex items-baseline gap-[10px]">
        <span
          className="tnum font-display font-extrabold leading-none text-white"
          style={{ fontSize: size, letterSpacing: '-0.035em' }}
        >
          {value}
        </span>
        {unit != null && <span className="text-[16px] font-semibold text-muted">{unit}</span>}
      </div>
      {chips != null && <div className="mt-[14px] flex items-center gap-[6px]">{chips}</div>}
    </div>
  )
}
