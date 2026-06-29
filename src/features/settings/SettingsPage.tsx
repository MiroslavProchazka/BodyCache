import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import {
  Cloud,
  CloudOff,
  Download,
  Upload,
  Copy,
  Eraser,
  ChevronRight,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { useEvolu } from '@/evolu/evolu'
import { allExercises, userProfile } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseId } from '@/evolu/schema'
import { legacyExercises } from '@/features/exercises/legacyExercises'
import { Overline } from '@/shared/components/Overline'
import { useToast } from '@/shared/components/Toast'
import { useUnits } from '@/shared/units/UnitsContext'
import { useRestTimer, REST_PRESETS } from '@/shared/rest/RestTimerContext'
import { formatDuration } from '@/shared/utils/units'
import { useOnlineStatus } from '@/shared/utils/useOnlineStatus'
import { Avatar } from '@/features/profile/Avatar'
import { formatProfileMeta } from '@/features/profile/profile'
import { parseRestoreMnemonic } from './mnemonic'
import { useDataTransfer } from './useDataTransfer'

/** Settings — storage status, display units, and data management. */
export function SettingsPage() {
  const evolu = useEvolu()
  const { unit, setUnit } = useUnits()
  const { defaultSec, setDefaultSec } = useRestTimer()
  const online = useOnlineStatus()
  const navigate = useNavigate()
  const profile = useQuery(userProfile)[0]
  const { showToast } = useToast()
  const { exportBackup, exportCsv, importBackup } = useDataTransfer()
  const { softDeleteExercise } = useBodyCacheMutations()
  const fileInput = useRef<HTMLInputElement>(null)
  // Which data action is in flight, so we can disable the rows + show a spinner.
  const [busy, setBusy] = useState<null | 'backup' | 'restore' | 'csv'>(null)
  const [cleaning, setCleaning] = useState(false)

  // "Legacy" exercises are the old-design ones that render the purple muscle-map
  // placeholder because they have no demo photo/GIF. Removing them leaves only
  // the GIF-style entries.
  const exercises = useQuery(allExercises)
  const legacy = useMemo(() => legacyExercises(exercises), [exercises])
  const [currentMnemonic, setCurrentMnemonic] = useState('')
  const [ownerReady, setOwnerReady] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [mnemonicInput, setMnemonicInput] = useState('')
  const [mnemonicError, setMnemonicError] = useState('')
  const [mnemonicBusy, setMnemonicBusy] = useState<null | 'restore' | 'reset'>(null)

  useEffect(() => {
    let active = true
    evolu.appOwner
      .then((owner) => {
        if (!active) return
        setCurrentMnemonic(owner.mnemonic ?? '')
        setOwnerReady(true)
      })
      .catch(() => {
        if (!active) return
        setOwnerReady(true)
      })

    return () => {
      active = false
    }
  }, [evolu])

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

  const toggleMnemonic = () => {
    setShowMnemonic((v) => !v)
  }

  const copyMnemonic = async () => {
    if (!currentMnemonic) {
      showToast('Recovery phrase is not ready yet')
      return
    }
    try {
      if (typeof navigator === 'undefined' || !navigator.clipboard) {
        throw new Error('clipboard_unavailable')
      }
      await navigator.clipboard.writeText(currentMnemonic)
      showToast('Recovery phrase copied')
    } catch {
      showToast('Copy failed - copy the phrase manually')
    }
  }

  const handleMnemonicInputChange = (value: string) => {
    setMnemonicInput(value)
    if (mnemonicError) setMnemonicError('')
  }

  const restoreFromMnemonic = async () => {
    if (mnemonicBusy) return

    const parsed = parseRestoreMnemonic(currentMnemonic, mnemonicInput)
    if (!parsed.ok) {
      setMnemonicError(parsed.error)
      return
    }

    if (
      !window.confirm(
        'Restore this recovery phrase? The app will reload and switch to that synced owner. Photos stay on this device.',
      )
    ) {
      return
    }

    setMnemonicBusy('restore')
    try {
      await evolu.restoreAppOwner(parsed.value)
    } catch {
      setMnemonicBusy(null)
      setMnemonicError('Restore failed. Check the phrase and try again.')
    }
  }

  const generateNewMnemonic = async () => {
    if (mnemonicBusy) return
    if (
      !window.confirm(
        'Generate a new recovery phrase? This starts a new owner and reloads the app.',
      )
    ) {
      return
    }

    setMnemonicBusy('reset')
    try {
      await evolu.resetAppOwner()
    } catch {
      setMnemonicBusy(null)
      showToast('Could not generate a new phrase')
    }
  }

  /**
   * Soft-delete the legacy (no-photo, purple-placeholder) exercises, keeping
   * only the GIF-style ones. Past workouts still render — the history queries
   * join on the exercise regardless of its `isDeleted` flag — and any of these
   * can be re-added with its animation from the starter library.
   */
  const removeLegacy = () => {
    if (cleaning || legacy.length === 0) return
    const n = legacy.length
    if (
      !window.confirm(
        `Remove ${n} exercise${n === 1 ? '' : 's'} with no demo image? ` +
          'Your logged workouts stay intact, and you can re-add any of them with their ' +
          'animation from the starter library.',
      )
    ) {
      return
    }

    setCleaning(true)
    try {
      for (const e of legacy) softDeleteExercise(e.id as ExerciseId)
      showToast(`Removed ${n} exercise${n === 1 ? '' : 's'}`)
    } catch {
      showToast('Something went wrong')
    } finally {
      setCleaning(false)
    }
  }

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <h1 className="mb-5 font-display text-[26px] font-semibold tracking-tight text-white">
        Settings
      </h1>

      {/* Profile — tap to edit name, body metrics and avatar. */}
      {profile && (
        <button
          type="button"
          onClick={() => navigate('/settings/profile')}
          className="mb-[18px] flex w-full items-center gap-[13px] rounded-[18px] border border-white/[0.07] bg-surface p-4 text-left active:scale-[0.99]"
        >
          <Avatar seed={profile.avatarSeed ?? profile.id} size={52} className="flex-none" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-semibold text-white">{profile.name}</div>
            <div className="mt-[2px] truncate text-[12.5px] text-muted">
              {formatProfileMeta(profile, unit)}
            </div>
          </div>
          <ChevronRight size={18} strokeWidth={1.75} className="flex-none text-faint" />
        </button>
      )}

      {/* Sync status — local-first writes, encrypted relay sync in the
          background. Connectivity is our honest status proxy: Evolu doesn't
          expose a live SyncState yet, and saving never blocks on the network. */}
      <SyncStatusCard online={online} />

      <Overline className="mb-[10px]">Recovery phrase</Overline>
      <div className="mb-[22px] rounded-[18px] border border-white/[0.07] bg-surface p-4">
        <p className="text-[13px] leading-relaxed text-muted">
          Use your recovery phrase to restore the same synced owner on another device. Keep it
          private. Photos remain local to each device.
        </p>

        <div className="mt-3 rounded-[14px] border border-white/[0.08] bg-inset p-3">
          {!ownerReady ? (
            <p className="text-[12.5px] text-faint">Loading recovery phrase...</p>
          ) : showMnemonic ? (
            <p className="select-text break-words font-mono text-[13px] leading-relaxed text-soft">
              {currentMnemonic}
            </p>
          ) : (
            <p className="text-[12.5px] text-faint">
              Hidden for safety. Reveal it only when you need to restore another device.
            </p>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={toggleMnemonic}
            disabled={!ownerReady}
            className="rounded-[12px] border border-white/[0.09] bg-inset px-3 py-[10px] text-[13.5px] font-semibold text-soft disabled:opacity-50"
          >
            {showMnemonic ? 'Hide phrase' : 'Reveal phrase'}
          </button>
          <button
            type="button"
            onClick={copyMnemonic}
            disabled={!ownerReady || !showMnemonic || !currentMnemonic}
            className="rounded-[12px] border border-neon/30 bg-neon/10 px-3 py-[10px] text-[13.5px] font-semibold text-neon disabled:opacity-50"
          >
            Copy phrase
          </button>
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <label
            htmlFor="mnemonic-restore"
            className="mb-2 block text-[12px] font-semibold text-faint"
          >
            Restore from phrase
          </label>
          <textarea
            id="mnemonic-restore"
            value={mnemonicInput}
            onChange={(e) => handleMnemonicInputChange(e.target.value)}
            rows={2}
            placeholder="word1 word2 ... word12"
            className="w-full rounded-[12px] border border-white/[0.08] bg-inset px-3 py-[10px] text-[13px] leading-relaxed text-soft placeholder:text-faint focus:outline-none"
          />
          {mnemonicError ? (
            <p className="mt-2 text-[12px] font-medium text-[#F5B45A]">{mnemonicError}</p>
          ) : null}

          <button
            type="button"
            onClick={restoreFromMnemonic}
            disabled={mnemonicBusy !== null || !mnemonicInput.trim()}
            className="mt-3 w-full rounded-[12px] bg-neon px-4 py-[11px] text-[13.5px] font-semibold text-ink disabled:opacity-50"
          >
            {mnemonicBusy === 'restore' ? 'Restoring...' : 'Restore phrase'}
          </button>
        </div>

        <button
          type="button"
          onClick={generateNewMnemonic}
          disabled={mnemonicBusy !== null}
          className="mt-3 w-full rounded-[12px] border border-white/[0.09] bg-transparent px-4 py-[11px] text-[13px] font-semibold text-faint disabled:opacity-50"
        >
          {mnemonicBusy === 'reset' ? 'Generating...' : 'Generate new phrase'}
        </button>
      </div>

      <Overline className="mb-[10px]">Units</Overline>
      <div className="mb-[22px] flex rounded-2xl border border-white/[0.08] bg-surface p-1">
        <Segment label="Kilograms" active={unit === 'kg'} onClick={() => setUnit('kg')} />
        <Segment label="Pounds" active={unit === 'lb'} onClick={() => setUnit('lb')} />
      </div>

      <Overline className="mb-[10px]">Default rest timer</Overline>
      <div className="mb-[22px] flex gap-1 rounded-2xl border border-white/[0.08] bg-surface p-1">
        {REST_PRESETS.map((sec) => (
          <Segment
            key={sec}
            label={formatDuration(sec)}
            active={defaultSec === sec}
            onClick={() => setDefaultSec(sec)}
          />
        ))}
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
        A backup is a single file with all your exercises, workouts and photos. Keep it somewhere
        safe — it's the only copy off this device.
      </p>

      <Overline className="mb-[10px] mt-[22px]">Library cleanup</Overline>
      <div className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-surface">
        <DataRow
          Icon={Eraser}
          label={
            legacy.length > 0
              ? `Remove ${legacy.length} legacy exercise${legacy.length === 1 ? '' : 's'}`
              : 'No legacy exercises'
          }
          loading={cleaning}
          disabled={cleaning || legacy.length === 0}
          onClick={removeLegacy}
          last
        />
      </div>
      <p className="mt-[10px] px-1 text-[12px] leading-relaxed text-faint">
        Older exercises with no demo image show a purple muscle-map placeholder instead of an
        animation. This removes them so only the animated, GIF-style exercises remain — your logged
        workouts are kept, and you can re-add any from the starter library.
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

/**
 * Storage + sync status. Always reassures that data is saved on the device;
 * the connectivity line tells the user whether background sync is reaching the
 * relay right now. Photos stay device-local (cross-device image sync is out of
 * MVP scope), so the copy promises sync of "workouts", not photos.
 */
function SyncStatusCard({ online }: { online: boolean }) {
  const Icon = online ? Cloud : CloudOff
  return (
    <div className="mb-[18px] flex items-center gap-[13px] rounded-[18px] border border-white/[0.07] bg-surface p-4">
      <div
        className={[
          'flex h-11 w-11 flex-none items-center justify-center rounded-[14px]',
          online ? 'bg-neon/[0.14] text-neon' : 'bg-white/[0.06] text-muted',
        ].join(' ')}
      >
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <div className="flex-1">
        <div className="text-[15px] font-semibold text-white">
          {online ? 'Syncing your workouts' : 'Saved on this device'}
        </div>
        <div className="mt-[2px] text-[12.5px] text-muted">
          {online
            ? 'Encrypted · across your devices · photos stay here'
            : "Offline — changes sync once you're back online"}
        </div>
      </div>
      <span
        aria-hidden
        className={['h-[9px] w-[9px] rounded-full', online ? 'bg-neon' : 'bg-muted'].join(' ')}
        style={online ? { boxShadow: '0 0 0 4px rgba(73,79,223,.22)' } : undefined}
      />
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
