import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface ListRowProps {
  /** Leading element — usually an `IconTile` or exercise photo tile. */
  leading?: ReactNode
  /** Row title (14–15px/600 white). */
  title: ReactNode
  /** `·`-separated meta line (12.5px muted). */
  meta?: ReactNode
  /**
   * Trailing element. Omit for a chevron indicator (when `onClick` is set);
   * pass a value/chip to end the row with data instead.
   */
  trailing?: ReactNode
  onClick?: () => void
  className?: string
  /** Overrides the title's size/family (base is `font-semibold text-white`). */
  titleClassName?: string
}

/**
 * Flat list row (SPEC §5.6): leading tile + title/meta stack + trailing
 * chevron or value. Not boxed — the whole row is the tap target (≥44px), rows
 * separated by whitespace, groups by a `Divider`.
 */
export function ListRow({
  leading,
  title,
  meta,
  trailing,
  onClick,
  className = '',
  titleClassName = 'text-[15px]',
}: ListRowProps) {
  const inner = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className={['truncate font-semibold text-white', titleClassName].join(' ')}>
          {title}
        </div>
        {meta != null && <div className="mt-[2px] truncate text-[12.5px] text-muted">{meta}</div>}
      </div>
      {trailing ?? (onClick && <ChevronRight size={17} strokeWidth={1.9} className="flex-none text-faint" />)}
    </>
  )

  const shared = 'flex min-h-[44px] w-full items-center gap-[13px] text-left'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[shared, 'transition-transform active:scale-[0.99]', className].join(' ')}
      >
        {inner}
      </button>
    )
  }
  return <div className={[shared, className].join(' ')}>{inner}</div>
}
