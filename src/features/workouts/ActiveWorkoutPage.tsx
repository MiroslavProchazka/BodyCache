import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Plus, Dumbbell } from 'lucide-react'
import { activeWorkoutSession, sessionExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { WorkoutSessionId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { StickyAction } from '@/shared/components/StickyAction'
import { formatElapsed } from '@/shared/utils/workoutStats'
import { WorkoutEntryCard } from './WorkoutEntryCard'

/** The live session: elapsed timer, logged exercises, add, and finish. */
export function ActiveWorkoutPage() {
  const active = useQuery(activeWorkoutSession)[0]
  if (!active) return <Navigate to="/" replace />
  return <ActiveWorkoutInner session={active as WorkoutSessionRow} />
}

function ActiveWorkoutInner({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const { finishWorkoutSession, discardWorkoutSession } = useBodyCacheMutations()
  const entries = useQuery(sessionExercises(session.id as WorkoutSessionId))

  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [])

  const empty = entries.length === 0

  const handleFinish = () => {
    if (empty) return
    finishWorkoutSession(session.id)
    navigate('/workout/finish', { state: { sessionId: session.id } })
  }

  const handleDiscard = () => {
    if (!window.confirm('Discard this empty workout?')) return
    discardWorkoutSession(session.id)
    navigate('/', { replace: true })
  }

  return (
    <>
      <div className="px-5 pb-[150px] pt-[6px]">
        <header className="mb-5 flex items-start justify-between">
          <div>
            <div className="mb-[7px] flex items-center gap-[7px] text-xs font-semibold uppercase tracking-[0.08em] text-neon">
              <span
                className="h-[7px] w-[7px] rounded-full bg-neon"
                style={{ boxShadow: '0 0 0 4px rgba(96,225,152,.18)' }}
              />
              Live workout
            </div>
            <div className="font-display text-[30px] font-semibold leading-none tracking-tight tnum text-white">
              {formatElapsed(session.startedAt ?? now, now)}
            </div>
          </div>
          <CircleButton onClick={() => navigate('/')} label="Back to home">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
        </header>

        {empty ? (
          <div className="mb-4 rounded-[22px] border-[1.5px] border-dashed border-white/[0.14] px-6 py-[38px] text-center">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-inset text-neon"
              style={{ borderRadius: '18px 18px 18px 5px' }}
            >
              <Dumbbell size={26} strokeWidth={1.75} />
            </div>
            <div className="mb-[6px] font-display text-lg font-semibold text-white">
              Nothing logged yet
            </div>
            <div className="text-sm leading-[1.45] text-muted">
              Add the first exercise you're about to do.
              <br />
              We'll show what you did last time.
            </div>
            <button
              type="button"
              onClick={handleDiscard}
              className="mt-4 text-[13px] font-medium text-faint underline-offset-2 hover:underline"
            >
              Discard workout
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => (
              <WorkoutEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/workout/add-exercise')}
          className="mt-[14px] flex w-full items-center justify-center gap-2 rounded-[18px] border-[1.5px] border-neon/35 bg-neon/10 p-4 text-[15.5px] font-semibold text-neon"
        >
          <Plus size={20} strokeWidth={2} />
          Add exercise
        </button>
      </div>

      <StickyAction>
        <button
          type="button"
          onClick={handleFinish}
          disabled={empty}
          className={[
            'w-full rounded-2xl border py-[17px] text-base font-bold',
            empty
              ? 'border-white/[0.08] bg-surface text-faint opacity-60'
              : 'border-neon bg-neon text-ink',
          ].join(' ')}
        >
          Finish workout
        </button>
      </StickyAction>
    </>
  )
}
