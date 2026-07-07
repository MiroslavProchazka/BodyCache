import { useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { clearRestoreFlag, isRecentlyRestored } from '@/features/settings/restoreState'
import { useOnlineStatus } from '@/shared/utils/useOnlineStatus'

/**
 * Shown after a recovery-phrase restore. A restored device starts empty and
 * fills in from the relay in the background, so this reassures the user that
 * missing exercises/history are on their way rather than lost — and, when
 * offline, that they need to connect for the pull to happen.
 *
 * Evolu exposes no completion signal (see `restoreState.ts`), so the banner is
 * time-boxed and dismissible rather than tied to actual sync progress.
 */
export function RestoreSyncBanner() {
  const online = useOnlineStatus()
  const [visible, setVisible] = useState(() => isRecentlyRestored())

  if (!visible) return null

  const dismiss = () => {
    clearRestoreFlag()
    setVisible(false)
  }

  return (
    <div className="mx-auto w-full max-w-md px-[22px] pt-3">
      <div className="flex items-start gap-3 rounded-[14px] border border-neon/25 bg-neon/[0.08] px-3 py-[11px]">
        <RefreshCw
          size={17}
          strokeWidth={2}
          className={['mt-[2px] flex-none text-[#8b90f7]', online ? 'animate-spin' : ''].join(' ')}
        />
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-white">
            {online ? 'Restoring your data' : 'Connect to finish restoring'}
          </div>
          <p className="mt-[2px] text-[12.5px] leading-relaxed text-muted">
            {online
              ? 'Your exercises and history are downloading from the relay in the background. Keep the app open a moment — items appear as they arrive. Photos stay on their original device.'
              : "You're offline. Reconnect and keep BodyCache open so your data can download from the relay."}
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 flex-none rounded-full p-1 text-faint transition-colors active:text-white"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
