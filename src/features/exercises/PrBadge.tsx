import { Trophy } from 'lucide-react'

/**
 * Inline "PR" badge shown when a set beats the stored best for an exercise.
 * Cheap and motivating — see the PR-badge UX rule. Styled to match the neon
 * "Set N" chip in the logger.
 */
export function PrBadge({ size = 13 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-lg bg-neon/[0.12] px-[9px] py-1 text-[11.5px] font-bold uppercase tracking-[0.06em] text-neon">
      <Trophy size={size} strokeWidth={2} />
      PR
    </span>
  )
}
