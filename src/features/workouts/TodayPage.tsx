import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Dumbbell, Play, ArrowRight, X, Trash2, ClipboardList } from 'lucide-react'
import {
  activeWorkoutSession,
  completedSetsForSession,
  finishedWorkoutSessions,
  performedExercises,
  sessionExercises,
} from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType, WorkoutSessionId } from '@/evolu/schema'
import {
  activeElapsedSec,
  formatDurationSec,
  isStaleAbandonedSession,
} from '@/shared/utils/workoutStats'
import { RecentExerciseCard } from '@/features/exercises/RecentExerciseCard'
import { LastWorkoutCard } from './LastWorkoutCard'
import { WeeklyMomentumCard } from './WeeklyMomentumCard'

/**
 * Home / Today — the launch point. Start or resume a workout, recall the last
 * session, and jump back into recent lifts. Logging never requires setup.
 */
export function TodayPage() {
  const navigate = useNavigate()
  const { startWorkoutSession } = useBodyCacheMutations()
  const active = useQuery(activeWorkoutSession)[0]
  const finished = useQuery(finishedWorkoutSessions)
  const performed = useQuery(performedExercises)

  const handleStart = () => {
    const started = startWorkoutSession()
    if (started.ok) navigate('/workout')
  }

  // De-duplicate performed rows (one per completed set) into a recency-ordered
  // unique exercise list for the rail.
  const seen = new Set<string>()
  const recent = performed.filter((e) => {
    const key = String(e.id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <header className="mb-[22px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div
            className="flex h-[34px] w-[34px] items-center justify-center bg-neon text-ink"
            style={{ borderRadius: '11px 11px 11px 4px' }}
          >
            <Dumbbell size={20} strokeWidth={1.75} />
          </div>
          <div className="font-display text-[19px] font-bold tracking-tight text-white">
            BodyCache
          </div>
        </div>
        <div className="text-[13px] font-medium text-muted">{today}</div>
      </header>

      <h1 className="mb-1 font-display text-[30px] font-semibold leading-[1.08] tracking-tight text-white">
        {active ? 'Back at it.' : 'Ready when you are.'}
      </h1>
      <p className="mb-[22px] text-[15px] text-muted">
        {active ? 'Pick up where you left off.' : 'Your last few lifts are below.'}
      </p>

      {active ? (
        <ActiveSessionCard session={active} />
      ) : (
        <button
          type="button"
          onClick={handleStart}
          className="mb-[14px] flex w-full items-center justify-between rounded-[24px] bg-gradient-to-br from-neon to-brand px-5 py-[22px] text-left text-ink transition-transform active:scale-[0.985]"
        >
          <div>
            <div className="font-display text-[24px] font-bold tracking-tight">Start workout</div>
            <div className="mt-1 text-[13.5px] font-medium opacity-[0.72]">
              Log sets as you go. No setup.
            </div>
          </div>
          <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-ink pl-[3px] text-neon">
            <Play size={20} fill="currentColor" stroke="none" />
          </div>
        </button>
      )}

      {!active && (
        <button
          type="button"
          onClick={() => navigate('/plans')}
          className="mb-[26px] flex w-full items-center gap-[11px] rounded-[18px] border border-white/[0.07] bg-surface px-[15px] py-[13px] text-left active:scale-[0.99]"
        >
          <div
            className="flex h-[38px] w-[38px] flex-none items-center justify-center bg-inset text-neon"
            style={{ borderRadius: '12px 12px 12px 4px' }}
          >
            <ClipboardList size={20} strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <div className="text-[14.5px] font-semibold text-white">Start from a plan</div>
            <div className="mt-[1px] text-[12.5px] text-muted">Load a saved routine</div>
          </div>
          <ArrowRight size={18} strokeWidth={1.9} className="flex-none text-faint" />
        </button>
      )}

      {finished[0] && (
        <div className="mb-[26px] mt-0">
          <LastWorkoutCard session={finished[0] as WorkoutSessionRow} />
        </div>
      )}

      {finished[0] && <WeeklyMomentumCard />}

      {recent.length > 0 && (
        <>
          <div className="mb-[14px] flex items-center justify-between">
            <h2 className="font-display text-[17px] font-semibold tracking-tight text-white">
              Recent exercises
            </h2>
            <button
              type="button"
              onClick={() => navigate('/library')}
              className="text-[13.5px] font-semibold text-neon"
            >
              All
            </button>
          </div>
          <div className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-1">
            {recent.slice(0, 10).map((ex) => (
              <RecentExerciseCard
                key={ex.id}
                id={ex.id as ExerciseId}
                name={String(ex.name)}
                type={ex.type as ExerciseType}
                bodyPart={ex.bodyPart as string | null}
                primaryPhotoId={ex.primaryPhotoId as ExercisePhotoId | null}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * The in-progress workout on Home. Normally the "Continue lifting" CTA with a
 * live exercise count + (pause-aware) elapsed time. If the session was left
 * open for hours with nothing logged, it switches to a stale prompt offering a
 * one-tap discard — so a forgotten empty workout never ticks on forever.
 */
function ActiveSessionCard({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const { discardWorkoutSession } = useBodyCacheMutations()
  const exercises = useQuery(sessionExercises(session.id))
  const completedSets = useQuery(completedSetsForSession(session.id as WorkoutSessionId))
  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [])

  const paused = session.status === 'paused'
  const elapsedSec = activeElapsedSec(session, now)
  const stale = isStaleAbandonedSession(elapsedSec, completedSets.length)

  const handleDiscard = () => {
    const message =
      completedSets.length > 0
        ? 'Discard this workout? Everything you logged will be lost. This can’t be undone.'
        : 'Discard this empty workout?'
    if (!window.confirm(message)) return
    discardWorkoutSession(session.id as WorkoutSessionId)
  }

  if (stale) {
    return (
      <div className="mb-[14px] rounded-[24px] border border-white/[0.08] bg-surface p-5">
        <div className="mb-[6px] text-xs font-semibold uppercase tracking-[0.08em] text-faint">
          Workout left open · {formatDurationSec(elapsedSec)}
        </div>
        <div className="font-display text-[20px] font-semibold tracking-tight text-white">
          Still going?
        </div>
        <div className="mt-[3px] text-[13.5px] text-muted">
          Nothing was logged. Discard it, or jump back in.
        </div>
        <div className="mt-4 flex gap-[10px]">
          <button
            type="button"
            onClick={handleDiscard}
            className="flex flex-1 items-center justify-center gap-[7px] rounded-[16px] border border-white/10 bg-inset py-[13px] text-[14.5px] font-semibold text-soft"
          >
            <Trash2 size={16} strokeWidth={1.85} />
            Discard
          </button>
          <button
            type="button"
            onClick={() => navigate('/workout')}
            className="flex flex-[1.2] items-center justify-center gap-[7px] rounded-[16px] bg-gradient-to-br from-neon to-brand py-[13px] text-[14.5px] font-bold text-ink"
          >
            Resume
            <ArrowRight size={17} strokeWidth={2} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mb-[14px]">
      <button
        type="button"
        onClick={() => navigate('/workout')}
        className="flex w-full items-center justify-between rounded-[24px] bg-gradient-to-br from-neon to-brand p-5 pr-[58px] text-left text-ink"
      >
        <div>
          <div className="mb-[6px] text-xs font-semibold uppercase tracking-[0.08em] opacity-[0.65]">
            {paused ? 'Workout paused' : 'Workout in progress'}
          </div>
          <div className="font-display text-[22px] font-semibold tracking-tight">
            {paused ? 'Resume lifting' : 'Continue lifting'}
          </div>
          <div className="mt-[3px] text-[13.5px] font-medium opacity-[0.7]">
            {exercises.length} {exercises.length === 1 ? 'exercise' : 'exercises'} ·{' '}
            {formatDurationSec(elapsedSec)}
          </div>
        </div>
        <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-full bg-ink/[0.16]">
          <ArrowRight size={22} strokeWidth={1.9} />
        </div>
      </button>
      <button
        type="button"
        onClick={handleDiscard}
        aria-label="Discard workout"
        className="absolute right-[14px] top-[14px] flex h-7 w-7 items-center justify-center rounded-full bg-ink/[0.16] text-ink"
      >
        <X size={16} strokeWidth={2.2} />
      </button>
    </div>
  )
}
