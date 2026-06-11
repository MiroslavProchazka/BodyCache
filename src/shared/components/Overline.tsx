import type { ReactNode } from 'react'

/** Uppercase, faint, wide-tracked section/overline label. */
export function Overline({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={[
        'text-[11px] font-semibold uppercase tracking-[0.09em] text-faint',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
