import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ArrowRight } from 'lucide-react'
import { activeWorkoutSession } from '@/evolu/queries'
import { formatElapsed } from '@/shared/utils/workoutStats'

/**
 * Floating pill shown above the tab bar when a workout is active but the user
 * is on a tab root (off the Active/Log screens). Tap to jump back in.
 */
export function ResumeBar() {
  const navigate = useNavigate()
  const sessions = useQuery(activeWorkoutSession)
  const session = sessions[0]

  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    if (!session) return
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [session])

  if (!session) return null

  return (
    <button
      type="button"
      onClick={() => navigate('/workout')}
      className="fixed inset-x-0 bottom-[100px] z-30 mx-auto flex max-w-md items-center gap-[11px] rounded-2xl bg-gradient-to-br from-neon to-brand px-4 py-[13px] text-ink shadow-resume"
      style={{ width: 'calc(100% - 28px)' }}
    >
      <span className="h-[9px] w-[9px] rounded-full bg-ink" />
      <span className="flex-1 text-left text-[14.5px] font-semibold">
        Workout in progress · {formatElapsed(session.startedAt ?? now, now)}
      </span>
      <span className="inline-flex items-center gap-[5px] text-[13.5px] font-semibold">
        Resume
        <ArrowRight size={16} strokeWidth={1.9} />
      </span>
    </button>
  )
}
