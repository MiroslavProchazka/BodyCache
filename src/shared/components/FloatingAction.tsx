import type { ReactNode } from 'react'

interface FloatingActionProps {
  children: ReactNode
  /**
   * Tab-root screens sit the pill above the BottomNav (84px); sub-screens pin
   * it to the very bottom (SPEC §5.4).
   */
  raised?: boolean
  className?: string
}

/**
 * Fixed floating action area (SPEC §5.4) — replaces `StickyAction`. A black
 * fade lets content scroll under one or two pills (`ActionPill` primary +
 * `SecondaryPill` ghost). Centered to the app's max width. Consumers must clear
 * `pb-[130px]` under it so nothing hides behind the pill.
 */
export function FloatingAction({ children, raised = false, className = '' }: FloatingActionProps) {
  return (
    <div
      className={['pointer-events-none fixed inset-x-0 z-20', raised ? 'bottom-[84px]' : 'bottom-0']
        .join(' ')}
    >
      <div
        className={[
          'mx-auto flex max-w-md gap-[10px] bg-gradient-to-t from-black via-black/55 to-transparent px-[22px] pt-[28px]',
          raised ? 'pb-[14px]' : 'pb-[22px]',
          className,
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}

interface ActionPillProps {
  label: string
  /** Optional second line, e.g. "3 exercises · 12:34". */
  sublabel?: ReactNode
  /** Trailing Lucide glyph, rendered inside a black circle. */
  icon: ReactNode
  onClick: () => void
  ariaLabel?: string
  className?: string
}

/**
 * The primary gradient action pill: label (+ optional sublabel) on the left, a
 * black icon circle on the right. The one place the cobalt gradient lives.
 */
export function ActionPill({
  label,
  sublabel,
  icon,
  onClick,
  ariaLabel,
  className = '',
}: ActionPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={[
        'pointer-events-auto flex flex-1 items-center justify-between rounded-full bg-gradient-to-br from-neon to-brand py-2 pl-6 pr-2 shadow-pill transition-transform active:scale-[0.985]',
        className,
      ].join(' ')}
    >
      <span className="flex flex-col text-left">
        <span
          className={[
            'font-display font-bold leading-[1.15] tracking-[-0.01em] text-white',
            sublabel != null ? 'text-[16px]' : 'text-[17px]',
          ].join(' ')}
        >
          {label}
        </span>
        {sublabel != null && (
          <span className="tnum text-[12px] font-semibold text-white/70">{sublabel}</span>
        )}
      </span>
      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink text-[#8b90f7]">
        {icon}
      </span>
    </button>
  )
}

interface SecondaryPillProps {
  label: string
  icon?: ReactNode
  onClick: () => void
  ariaLabel?: string
  /** Flex-grow ratio next to the primary pill (default 1). */
  className?: string
}

/**
 * The ghost secondary pill for split actions (e.g. Pause | Finish) — surface
 * fill + hairline border, no gradient.
 */
export function SecondaryPill({
  label,
  icon,
  onClick,
  ariaLabel,
  className = '',
}: SecondaryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel ?? label}
      className={[
        'pointer-events-auto flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-surface py-[17px] text-[14.5px] font-semibold text-soft transition-transform active:scale-[0.985]',
        className,
      ].join(' ')}
    >
      {icon}
      {label}
    </button>
  )
}
