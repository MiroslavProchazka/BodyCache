import type { ReactNode } from 'react'
import { Overline } from './Overline'

interface SectionHeaderProps {
  /** Overline label, e.g. "LAST WORKOUT · YESTERDAY". */
  children: ReactNode
  /** Optional trailing action (13px accent text button). */
  action?: { label: string; onClick: () => void }
  className?: string
}

/**
 * Flat-section header (SPEC §5.1): an uppercase overline with an optional
 * trailing accent action, replacing boxed card headers. 12px of space below.
 */
export function SectionHeader({ children, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={['mb-3 flex items-center justify-between', className].join(' ')}>
      <Overline>{children}</Overline>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-[13px] font-semibold text-[#8b90f7]"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
