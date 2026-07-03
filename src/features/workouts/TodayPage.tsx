import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ArrowRight, ClipboardList, Play, Trash2, User } from 'lucide-react'
import {
  activeWorkoutSession,
  completedSetsForSession,
  finishedSessionSets,
  finishedWorkoutSessions,
  performedExercises,
  sessionExercises,
  userProfile,
} from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { WorkoutSessionRow } from '@/evolu/rows'
import type { ExerciseId, ExercisePhotoId, ExerciseType, WorkoutSessionId } from '@/evolu/schema'
import {
  activeElapsedSec,
  formatDurationSec,
  isStaleAbandonedSession,
} from '@/shared/utils/workoutStats'
import { formatRelativeDay } from '@/shared/utils/dates'
import { Button } from '@/shared/components/Button'
import { Divider } from '@/shared/components/Divider'
import { Overline } from '@/shared/components/Overline'
import { SectionHeader } from '@/shared/components/SectionHeader'
import { IconTile } from '@/shared/components/IconTile'
import { ListRow } from '@/shared/components/ListRow'
import { SplitBar } from '@/shared/components/SplitBar'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { Avatar } from '@/features/profile/Avatar'
import { narrowGender } from '@/features/profile/profile'
import { RecentExerciseCard } from '@/features/exercises/RecentExerciseCard'
import { useLastPerformanceIndex } from '@/features/exercises/useLastPerformanceIndex'
import { LastWorkoutCard } from './LastWorkoutCard'
import { WeeklyMomentumCard } from './WeeklyMomentumCard'
import { muscleSplit7Days } from './weeklyStats'

/**
 * Home / Today — the launch point (mocks 1b + 3a). Flat sections on black: an
 * overline date + avatar, the weekly-volume hero, a 7-day bar chart, the last
 * workout, a 7-day muscle split and recent lifts, with the primary action as a
 * floating pill. Start or resume a workout; logging never requires setup.
 */
export function TodayPage() {
  const navigate = useNavigate()
  const { startWorkoutSession } = useBodyCacheMutations()
  const active = useQuery(activeWorkoutSession)[0]
  const finished = useQuery(finishedWorkoutSessions)
  const performed = useQuery(performedExercises)
  const weekSets = useQuery(finishedSessionSets)
  const profile = useQuery(userProfile)[0]
  const performanceIndex = useLastPerformanceIndex()

  const handleStart = () => {
    const started = startWorkoutSession()
    if (started.ok) navigate('/workout')
  }

  // De-duplicate performed rows (one per completed set) into a recency-ordered
  // unique exercise list.
  const seen = new Set<string>()
  const recent = performed.filter((e) => {
    const key = String(e.id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  const split = muscleSplit7Days(weekSets)
  const lastSession = finished[0] as WorkoutSessionRow | undefined

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <>
      <div className="px-[22px] pb-[130px] pt-[14px]">
        <header className="mb-[26px] flex items-center justify-between">
          <Overline>{today}</Overline>
          <button
            type="button"
            onClick={() => navigate('/settings/profile')}
            aria-label="Profile"
            className="flex h-[30px] w-[30px] flex-none items-center justify-center overflow-hidden rounded-full border border-white/10 bg-surface text-soft"
          >
            {profile?.avatarSeed ? (
              <Avatar seed={String(profile.avatarSeed)} gender={narrowGender(profile.gender)} size={30} />
            ) : (
              <User size={15} strokeWidth={1.75} />
            )}
          </button>
        </header>

        {/* Stale prompt (if any) renders in-flow here; the live pill is fixed. */}
        {active && <ActiveSession session={active} />}

        <WeeklyMomentumCard />

        {lastSession && (
          <>
            <Divider className="mb-5" />
            <SectionHeader>
              Last workout · {lastSession.startedAt ? formatRelativeDay(lastSession.startedAt) : '—'}
            </SectionHeader>
            <LastWorkoutCard session={lastSession} />
          </>
        )}

        {split.length > 0 && (
          <>
            <Divider className="my-5" />
            <SectionHeader>Muscle split · 7 days</SectionHeader>
            <div className="flex flex-col gap-[10px]">
              {split.map((s) => (
                <SplitBar key={s.key} label={s.label} percent={s.percent} strong={s.strong} />
              ))}
            </div>
          </>
        )}

        {recent.length > 0 && (
          <>
            <Divider className="my-5" />
            <SectionHeader action={{ label: 'All', onClick: () => navigate('/library') }}>
              Recent exercises
            </SectionHeader>
            <div className="flex flex-col gap-[18px]">
              {recent.slice(0, 6).map((ex) => (
                <RecentExerciseCard
                  key={ex.id}
                  id={ex.id as ExerciseId}
                  name={String(ex.name)}
                  type={ex.type as ExerciseType}
                  bodyPart={ex.bodyPart as string | null}
                  primaryPhotoId={ex.primaryPhotoId as ExercisePhotoId | null}
                  summary={performanceIndex.get(ex.id as ExerciseId)}
                />
              ))}
            </div>
          </>
        )}

        {!active && (
          <>
            <Divider className="my-5" />
            <ListRow
              onClick={() => navigate('/plans')}
              leading={
                <IconTile>
                  <ClipboardList size={20} strokeWidth={1.75} />
                </IconTile>
              }
              title="Start from a plan"
              meta="Load a saved routine"
            />
          </>
        )}
      </div>

      {!active && (
        <FloatingAction raised>
          <ActionPill
            label="Start workout"
            icon={<Play size={18} fill="currentColor" stroke="none" className="ml-[2px]" />}
            onClick={handleStart}
          />
        </FloatingAction>
      )}
    </>
  )
}

/**
 * The in-progress workout on Home. Normally a "Continue lifting" floating pill
 * with a live exercise count + (pause-aware) elapsed time. If the session was
 * left open for hours with nothing logged, it instead shows a flat stale
 * prompt (in-flow at the top of the page) offering a one-tap discard — so a
 * forgotten empty workout never ticks on forever.
 */
function ActiveSession({ session }: { session: WorkoutSessionRow }) {
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
      <>
        <div className="mb-7">
          <Overline className="mb-[10px]">
            Workout left open · {formatDurationSec(elapsedSec)}
          </Overline>
          <div className="mb-[6px] font-display text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            Still going?
          </div>
          <p className="mb-[18px] text-[13.5px] text-muted">
            Nothing was logged. Discard it, or jump back in.
          </p>
          <div className="flex gap-[10px]">
            <Button variant="secondary" className="flex-1 !py-[14px] text-[14.5px]" onClick={handleDiscard}>
              <Trash2 size={16} strokeWidth={1.85} />
              Discard
            </Button>
            <Button
              variant="primary"
              className="flex-[1.2] !py-[14px] text-[14.5px]"
              onClick={() => navigate('/workout')}
            >
              Resume
              <ArrowRight size={17} strokeWidth={2} />
            </Button>
          </div>
        </div>
        <Divider className="mb-5" />
      </>
    )
  }

  return (
    <FloatingAction raised>
      <ActionPill
        label={paused ? 'Resume lifting' : 'Continue lifting'}
        sublabel={`${exercises.length} ${exercises.length === 1 ? 'exercise' : 'exercises'} · ${formatDurationSec(elapsedSec)}`}
        icon={<ArrowRight size={19} strokeWidth={1.9} />}
        onClick={() => navigate('/workout')}
      />
    </FloatingAction>
  )
}
