import type { ReactNode } from 'react'
import { Link2, Unlink } from 'lucide-react'

/**
 * Visual container for a superset block: a cobalt-tinted bordered group with a
 * "Superset A" header (chain glyph) and an Ungroup action. Used by both the
 * active logger and the plan editor; the member cards/editors render as
 * children and carry their own A1/A2 badge.
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
    <div
      className="rounded-[22px] border p-[10px]"
      style={{ borderColor: 'rgba(73,79,223,.4)', backgroundColor: 'rgba(73,79,223,.06)' }}
    >
      <div className="mb-[10px] flex items-center justify-between px-[6px] pt-[2px]">
        <div
          className="flex items-center gap-[6px] text-[11px] font-semibold uppercase tracking-[0.09em]"
          style={{ color: '#7c82f5' }}
        >
          <Link2 size={13} strokeWidth={2.25} />
          Superset {label}
        </div>
        <button
          type="button"
          onClick={onUngroup}
          className="flex items-center gap-[5px] rounded-full border border-white/10 bg-inset px-[10px] py-[5px] text-[11.5px] font-semibold text-muted active:scale-[0.97]"
        >
          <Unlink size={13} strokeWidth={2} />
          Ungroup
        </button>
      </div>
      <div className="flex flex-col gap-[10px]">{children}</div>
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
