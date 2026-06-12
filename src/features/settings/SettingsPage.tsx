import { useRef, useState } from 'react'
import {
  Cloud,
  Download,
  Upload,
  Copy,
  ChevronRight,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { Overline } from '@/shared/components/Overline'
import { useToast } from '@/shared/components/Toast'
import { useUnits } from '@/shared/units/UnitsContext'
import { useDataTransfer } from './useDataTransfer'

/** Settings — storage status, display units, and data management. */
export function SettingsPage() {
  const { unit, setUnit } = useUnits()
  const { showToast } = useToast()
  const { exportBackup, exportCsv, importBackup } = useDataTransfer()
  const fileInput = useRef<HTMLInputElement>(null)
  // Which data action is in flight, so we can disable the rows + show a spinner.
  const [busy, setBusy] = useState<null | 'backup' | 'restore' | 'csv'>(null)

  const run = async (kind: 'backup' | 'csv', fn: () => Promise<void>) => {
    if (busy) return
    setBusy(kind)
    try {
      await fn()
      showToast(kind === 'backup' ? 'Backup saved' : 'CSV exported')
    } catch {
      showToast('Something went wrong')
    } finally {
      setBusy(null)
    }
  }

  const onPickRestore = () => {
    if (busy) return
    fileInput.current?.click()
  }

  const onFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset so choosing the same file again re-triggers `change`.
    e.target.value = ''
    if (!file) return
    if (!window.confirm('Restore from this backup? It merges into your data.')) return

    setBusy('restore')
    try {
      const { rows } = await importBackup(file)
      showToast(`Restored ${rows} item${rows === 1 ? '' : 's'}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Restore failed')
    } finally {
      setBusy(null)
    }
  }

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
        <DataRow
          Icon={Download}
          label="Back up now"
          loading={busy === 'backup'}
          disabled={busy !== null}
          onClick={() => run('backup', exportBackup)}
        />
        <DataRow
          Icon={Upload}
          label="Restore from backup"
          loading={busy === 'restore'}
          disabled={busy !== null}
          onClick={onPickRestore}
        />
        <DataRow
          Icon={Copy}
          label="Export history (CSV)"
          loading={busy === 'csv'}
          disabled={busy !== null}
          onClick={() => run('csv', exportCsv)}
          last
        />
      </div>
      <p className="mt-[10px] px-1 text-[12px] leading-relaxed text-faint">
        A backup is a single file with all your exercises, workouts and photos.
        Keep it somewhere safe — it's the only copy off this device.
      </p>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={onFileChosen}
      />

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
  loading = false,
  disabled = false,
  last = false,
}: {
  Icon: LucideIcon
  label: string
  onClick: () => void
  loading?: boolean
  disabled?: boolean
  last?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'flex w-full items-center gap-[13px] px-4 py-[15px] text-left transition-opacity disabled:opacity-50',
        last ? '' : 'border-b border-white/[0.06]',
      ].join(' ')}
    >
      <Icon size={20} strokeWidth={1.75} className="text-muted" />
      <span className="flex-1 text-[14.5px] font-medium text-white">{label}</span>
      {loading ? (
        <Loader2 size={18} strokeWidth={2} className="animate-spin text-neon" />
      ) : (
        <ChevronRight size={17} strokeWidth={1.75} className="text-faint" />
      )}
    </button>
  )
}
