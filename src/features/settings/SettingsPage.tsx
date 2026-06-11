import { Cloud, Download, Upload, Copy, ChevronRight, type LucideIcon } from 'lucide-react'
import { Overline } from '@/shared/components/Overline'
import { useToast } from '@/shared/components/Toast'
import { useUnits } from '@/shared/units/UnitsContext'

/** Settings — storage status, display units, and data management. */
export function SettingsPage() {
  const { unit, setUnit } = useUnits()
  const { showToast } = useToast()

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <h1 className="mb-5 font-display text-[26px] font-semibold tracking-tight text-white">
        Settings
      </h1>

      {/* Storage status — local-first today; relay sync is a later addition. */}
      <div className="mb-[18px] flex items-center gap-[13px] rounded-[18px] border border-white/[0.07] bg-surface p-4">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] bg-neon/[0.14] text-neon">
          <Cloud size={22} strokeWidth={1.75} />
        </div>
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-white">Saved on this device</div>
          <div className="mt-[2px] text-[12.5px] text-muted">
            Works offline · encrypted sync coming soon
          </div>
        </div>
        <span
          className="h-[9px] w-[9px] rounded-full bg-neon"
          style={{ boxShadow: '0 0 0 4px rgba(96,225,152,.16)' }}
        />
      </div>

      <Overline className="mb-[10px]">Units</Overline>
      <div className="mb-[22px] flex rounded-2xl border border-white/[0.08] bg-surface p-1">
        <Segment label="Kilograms" active={unit === 'kg'} onClick={() => setUnit('kg')} />
        <Segment label="Pounds" active={unit === 'lb'} onClick={() => setUnit('lb')} />
      </div>

      <Overline className="mb-[10px]">Your data</Overline>
      <div className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-surface">
        <DataRow Icon={Download} label="Back up now" onClick={() => showToast('Coming soon')} />
        <DataRow
          Icon={Upload}
          label="Restore from backup"
          onClick={() => showToast('Coming soon')}
        />
        <DataRow
          Icon={Copy}
          label="Export / import (CSV)"
          onClick={() => showToast('Coming soon')}
          last
        />
      </div>

      <div className="mt-6 text-center text-xs leading-relaxed text-faint">
        BodyCache · your workout memory
        <br />
        v1.0 — not your coach
      </div>
    </div>
  )
}

function Segment({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'flex-1 rounded-[11px] p-3 text-[14.5px] font-semibold transition-colors',
        active ? 'bg-neon text-ink' : 'bg-transparent text-muted',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function DataRow({
  Icon,
  label,
  onClick,
  last = false,
}: {
  Icon: LucideIcon
  label: string
  onClick: () => void
  last?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-[13px] px-4 py-[15px] text-left',
        last ? '' : 'border-b border-white/[0.06]',
      ].join(' ')}
    >
      <Icon size={20} strokeWidth={1.75} className="text-muted" />
      <span className="flex-1 text-[14.5px] font-medium text-white">{label}</span>
      <ChevronRight size={17} strokeWidth={1.75} className="text-faint" />
    </button>
  )
}
