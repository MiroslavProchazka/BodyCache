import { LayoutGrid, List } from 'lucide-react'

export type ViewMode = 'grid' | 'list'

/**
 * Segmented grid/list icon toggle (SPEC §5.8 pill language, TWEAK T1). Sits
 * right-aligned on the filter row; the active mode gets the accent tint.
 */
export function ViewToggle({
  view,
  onChange,
}: {
  view: ViewMode
  onChange: (view: ViewMode) => void
}) {
  return (
    <div className="flex flex-none items-center gap-1 rounded-full bg-inset p-1" role="group" aria-label="View">
      <Btn label="Grid view" active={view === 'grid'} onClick={() => onChange('grid')}>
        <LayoutGrid size={17} strokeWidth={2} />
      </Btn>
      <Btn label="List view" active={view === 'list'} onClick={() => onChange('list')}>
        <List size={17} strokeWidth={2} />
      </Btn>
    </div>
  )
}

function Btn({
  label,
  active,
  onClick,
  children,
}: {
  label: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={[
        'flex h-8 w-9 items-center justify-center rounded-full transition-colors',
        active ? 'bg-neon text-white' : 'text-muted',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
