import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ArrowRight, X } from 'lucide-react'
import { activeWorkoutSession } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionId } from '@/evolu/schema'
import { ConfirmSheet } from '@/shared/components/ConfirmSheet'
import { activeElapsedSec, formatDurationSec } from '@/shared/utils/workoutStats'

/**
 * Floating pill shown above the tab bar when a workout is in progress but the
 * user is on a tab root (off the Active/Log screens). Tap to jump back in, or
 * dismiss with the × to discard a session you didn't mean to leave running.
 */
export function ResumeBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { discardWorkoutSession } = useBodyCacheMutations()
  const sessions = useQuery(activeWorkoutSession)
  const session = sessions[0]

  const [now, setNow] = useState(() => new Date().toISOString())
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  useEffect(() => {
    if (!session) return
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [session])

  // Today owns its own "Continue lifting" floating pill; don't stack a second.
  if (!session || pathname === '/') return null

  const paused = session.status === 'paused'

  const handleDiscard = () => {
    setConfirmDiscard(true)
  }

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-[100px] z-30 mx-auto flex max-w-md items-center gap-[6px] rounded-full bg-gradient-to-br from-neon to-brand pl-5 pr-[6px] py-[7px] text-white shadow-pill"
        style={{ width: 'calc(100% - 28px)' }}
      >
        <button
          type="button"
          onClick={() => navigate('/workout')}
          className="flex flex-1 items-center gap-[11px] py-[6px] text-left"
        >
          <span className="h-[9px] w-[9px] rounded-full bg-ink" />
          <span className="flex-1 text-[14.5px] font-semibold">
            {paused ? 'Workout paused' : 'Workout in progress'} ·{' '}
            {formatDurationSec(activeElapsedSec(session, now))}
          </span>
          <span className="inline-flex items-center gap-[5px] text-[13.5px] font-semibold">
            Resume
            <ArrowRight size={16} strokeWidth={1.9} />
          </span>
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          aria-label="Discard workout"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ink/[0.16] text-white"
        >
          <X size={16} strokeWidth={2.2} />
        </button>
      </div>
      <ConfirmSheet
        open={confirmDiscard}
        title="Discard this workout?"
        body="This can’t be undone."
        confirmLabel="Discard"
        confirmVariant="destructive"
        onConfirm={() => {
          discardWorkoutSession(session.id as WorkoutSessionId)
          setConfirmDiscard(false)
        }}
        onClose={() => setConfirmDiscard(false)}
      />
    </>
  )
}
