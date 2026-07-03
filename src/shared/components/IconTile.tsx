import type { ReactNode } from 'react'

interface IconTileProps {
  children: ReactNode
  /** 42px list tile (default) or 30px header tile (SPEC §5.5). */
  size?: 'list' | 'header'
  /** Cobalt icon (accent rows) vs. soft white (neutral). */
  tone?: 'accent' | 'neutral'
  className?: string
}

/**
 * Rounded surface tile that holds a Lucide glyph (SPEC §5.5) — the flat-row
 * leading element. Surface + hairline border; icon color is the only accent.
 */
export function IconTile({
  children,
  size = 'list',
  tone = 'accent',
  className = '',
}: IconTileProps) {
  return (
    <div
      className={[
        'flex flex-none items-center justify-center rounded-[14px] border border-white/[0.08] bg-surface',
        size === 'list' ? 'h-[42px] w-[42px]' : 'h-[30px] w-[30px]',
        tone === 'accent' ? 'text-[#8b90f7]' : 'text-soft',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
