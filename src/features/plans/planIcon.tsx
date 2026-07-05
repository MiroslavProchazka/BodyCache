import { ClipboardList } from 'lucide-react'
import { IconTile } from '@/shared/components/IconTile'

/**
 * Curated quick-pick emoji for a plan's icon (TWEAK T4). Plus a "none" option
 * (the clipboard fallback) in the editor. Emoji are user content — the one
 * sanctioned exception to the app's no-emoji-in-chrome rule.
 */
export const PLAN_ICON_PRESETS = ['💪', '🏋️', '🦵', '🔥', '🏃'] as const

/**
 * The plan's leading tile: the chosen emoji glyph, or the clipboard icon when
 * none is set. Sizes match `IconTile` (42px list / 30px header).
 */
export function PlanIconTile({
  icon,
  size = 'list',
}: {
  icon?: string | null
  size?: 'list' | 'header'
}) {
  return (
    <IconTile size={size}>
      {icon ? (
        <span className="text-[20px] leading-none" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <ClipboardList size={size === 'list' ? 20 : 16} strokeWidth={1.75} />
      )}
    </IconTile>
  )
}
