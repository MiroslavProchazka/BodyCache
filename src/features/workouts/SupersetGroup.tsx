import type { ReactNode } from 'react'
import { Link2, Unlink } from 'lucide-react'

/**
 * Flat container for a superset block (SPEC §5 — supersets get a rail, not a
 * box): a 3px cobalt left rail beside a "SUPERSET A" overline (with an Ungroup
 * action) and the member rows/editors. Used by the active logger, edit-session
 * and plan editors; members render as children.
 */
export function SupersetGroup({
  label,
  onUngroup,
  children,
}: {
  /** The superset's letter, e.g. "A". */
  label: string
  onUngroup: () => void
  children: ReactNode
}) {
  return (
    <div className="flex gap-[13px]">
      <div className="w-[3px] flex-none rounded-[2px] bg-neon" />
      <div className="min-w-0 flex-1">
        <div className="mb-[10px] flex items-center justify-between">
          <div
            className="flex items-center gap-[6px] text-[10.5px] font-semibold uppercase tracking-[0.09em]"
            style={{ color: '#8b90f7' }}
          >
            <Link2 size={12} strokeWidth={2.25} />
            Superset {label}
          </div>
          <button
            type="button"
            onClick={onUngroup}
            className="flex items-center gap-[4px] text-[12px] font-semibold text-muted active:scale-[0.97]"
          >
            <Unlink size={12} strokeWidth={2} />
            Ungroup
          </button>
        </div>
        <div className="flex flex-col gap-[16px]">{children}</div>
      </div>
    </div>
  )
}

/**
 * "Superset with next" link shown on a standalone card/editor when a following
 * exercise exists — assigns both rows a shared key. Dashed cobalt to read as an
 * optional, additive action.
 */
export function LinkNextButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 flex w-full items-center justify-center gap-[6px] rounded-[12px] border border-dashed py-[9px] text-[12.5px] font-semibold active:scale-[0.99]"
      style={{ borderColor: 'rgba(73,79,223,.45)', color: '#7c82f5' }}
    >
      <Link2 size={14} strokeWidth={2} />
      Superset with next
    </button>
  )
}

/** The A1/A2 badge worn by a superset member. */
export function SupersetBadge({ label }: { label: string }) {
  return (
    <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-neon font-display text-[13px] font-bold tnum text-white">
      {label}
    </span>
  )
}
