import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ArrowRight, X } from 'lucide-react'
import { activeWorkoutSession } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionId } from '@/evolu/schema'
import { activeElapsedSec, formatDurationSec } from '@/shared/utils/workoutStats'

/**
 * Floating pill shown above the tab bar when a workout is in progress but the
 * user is on a tab root (off the Active/Log screens). Tap to jump back in, or
 * dismiss with the × to discard a session you didn't mean to leave running.
 */
export function ResumeBar() {
  const navigate = useNavigate()
  const { discardWorkoutSession } = useBodyCacheMutations()
  const sessions = useQuery(activeWorkoutSession)
  const session = sessions[0]

  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    if (!session) return
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [session])

  if (!session) return null

  const paused = session.status === 'paused'

  const handleDiscard = () => {
    if (!window.confirm('Discard this workout? This can’t be undone.')) return
    discardWorkoutSession(session.id as WorkoutSessionId)
  }

  return (
    <div
      className="fixed inset-x-0 bottom-[100px] z-30 mx-auto flex max-w-md items-center gap-[6px] rounded-2xl bg-gradient-to-br from-neon to-brand pl-4 pr-[6px] py-[7px] text-ink shadow-resume"
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
        className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-ink/[0.16] text-ink"
      >
        <X size={16} strokeWidth={2.2} />
      </button>
    </div>
  )
}
