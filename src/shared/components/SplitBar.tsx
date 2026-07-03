interface SplitBarProps {
  /** Left label (52px column), e.g. "Chest". */
  label: string
  /** Fill width as a percentage 0–100. */
  percent: number
  /** Strongest values use solid `neon`; lesser values use lighter `brand`. */
  strong?: boolean
  className?: string
}

/**
 * Labeled horizontal split bar (SPEC §5.7): a fixed label column, a `track`
 * rail with a cobalt fill, and a right-aligned tabular percent. Used for the
 * muscle-split sections.
 */
export function SplitBar({ label, percent, strong = true, className = '' }: SplitBarProps) {
  return (
    <div className={['flex items-center gap-[10px]', className].join(' ')}>
      <span className="w-[52px] flex-none text-[12.5px] font-semibold text-white/80">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-[5px] bg-track">
        <div
          className="h-full rounded-[5px]"
          style={{
            width: `${Math.max(0, Math.min(100, percent))}%`,
            background: strong ? '#494fdf' : '#7c82f5',
          }}
        />
      </div>
      <span className="tnum w-[34px] flex-none text-right text-[12px] font-semibold text-white/55">
        {Math.round(percent)}%
      </span>
    </div>
  )
}
