import type { ReactNode } from 'react'
import { Flame, TrendingDown, TrendingUp, Trophy } from 'lucide-react'

const base =
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-[10px] py-1 text-[12px] font-bold'

/** Accent-tinted info chip base (cobalt). Small accent text uses #8b90f7. */
const accent = 'bg-neon/[0.16] text-[#8b90f7]'

/**
 * Info chips shown under a hero number (SPEC §5.3). All are pill-shaped with a
 * leading Lucide glyph; color is rationed — cobalt tint for trend/streak, amber
 * for PRs. These are read-only marks, not interactive filters.
 */

/** Week-over-week (or similar) delta chip, e.g. "+12% vs last week". */
export function TrendChip({ children, dir = 'up' }: { children: ReactNode; dir?: 'up' | 'down' }) {
  const Icon = dir === 'down' ? TrendingDown : TrendingUp
  return (
    <span className={[base, accent].join(' ')}>
      <Icon size={13} strokeWidth={2} />
      {children}
    </span>
  )
}

/** Personal-record count chip (amber), e.g. "1 PR". */
export function PrChip({ children }: { children: ReactNode }) {
  return (
    <span className={[base, 'bg-[rgba(234,164,74,0.14)] text-pr'].join(' ')}>
      <Trophy size={13} strokeWidth={2} />
      {children}
    </span>
  )
}

/** Active-days / streak chip (cobalt tint), e.g. "2 days". */
export function StreakChip({ children }: { children: ReactNode }) {
  return (
    <span className={[base, accent].join(' ')}>
      <Flame size={13} strokeWidth={2} />
      {children}
    </span>
  )
}
