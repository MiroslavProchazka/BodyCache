import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, ChevronLeft, Dumbbell, Layers, Pause, Play, Plus } from 'lucide-react'
import { activeWorkoutSession, completedSetsForSession, sessionExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { SessionExerciseRow, WorkoutSessionRow } from '@/evolu/rows'
import type { WorkoutExerciseId, WorkoutSessionId } from '@/evolu/schema'
import { Button } from '@/shared/components/Button'
import { CircleButton } from '@/shared/components/CircleButton'
import { Divider } from '@/shared/components/Divider'
import { HeroStat } from '@/shared/components/HeroStat'
import { Overline } from '@/shared/components/Overline'
import { FloatingAction, SecondaryPill } from '@/shared/components/FloatingAction'
import { activeElapsedSec, formatDurationSec, totalVolumeKg } from '@/shared/utils/workoutStats'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { WorkoutEntryCard } from './WorkoutEntryCard'
import { SupersetGroup } from './SupersetGroup'
import { groupExercises, newSupersetKey } from './supersets'
import { MuscleDistributionCard } from './MuscleDistributionCard'

/** The live session: elapsed timer, logged exercises, add, pause, and finish. */
export function ActiveWorkoutPage() {
  const navigate = useNavigate()
  const active = useQuery(activeWorkoutSession)[0]

  // Evolu's WASM worker processes INSERTs asynchronously: the reactive query
  // returns [] on the very first render after navigate('/workout'). Delay the
  // redirect so the worker has time to propagate the just-written session row.
  useEffect(() => {
    if (active) return
    const id = setTimeout(() => navigate('/', { replace: true }), 500)
    return () => clearTimeout(id)
  }, [active, navigate])

  if (!active) return null
  return <ActiveWorkoutInner session={active as WorkoutSessionRow} />
}

function ActiveWorkoutInner({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const { unit } = useUnits()
  const {
    finishWorkoutSession,
    discardWorkoutSession,
    pauseWorkoutSession,
    resumeWorkoutSession,
    setWorkoutExerciseOrder,
    setWorkoutExerciseSuperset,
    removeExerciseFromWorkout,
  } = useBodyCacheMutations()
  // Already ordered by `orderIndex` (the query sorts), so grouping folds live.
  const entries = useQuery(sessionExercises(session.id as WorkoutSessionId)) as SessionExerciseRow[]
  const completedSets = useQuery(completedSetsForSession(session.id as WorkoutSessionId))

  const [now, setNow] = useState(() => new Date().toISOString())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date().toISOString()), 1000)
    return () => clearInterval(t)
  }, [])

  const empty = entries.length === 0
  // Finishing requires at least one confirmed set — starting a plan adds
  // exercises (and ghost target sets) but nothing is logged until the user
  // confirms a set, so exercise count alone mustn't unlock Finish.
  const canFinish = completedSets.length > 0
  const paused = session.status === 'paused'
  const elapsedSec = activeElapsedSec(session, now)
  const volumeKg = totalVolumeKg(completedSets)

  const blocks = groupExercises(entries)
  const indexOf = (entry: SessionExerciseRow) =>
    entries.findIndex((e) => String(e.id) === String(entry.id))

  // Reorder by swapping two adjacent rows in the displayed order, then renumber
  // the whole list 0..n-1. Renumbering (vs swapping the two stored values) is
  // resilient: if older data left two rows sharing an `orderIndex`, a plain
  // swap of equal values is a no-op and the move silently fails — this always
  // moves and self-heals any duplicate indices on the way.
  const move = (entry: SessionExerciseRow, dir: -1 | 1) => {
    const i = indexOf(entry)
    const j = i + dir
    if (j < 0 || j >= entries.length) return
    const reordered = [...entries]
    ;[reordered[i], reordered[j]] = [reordered[j], reordered[i]]
    reordered.forEach((e, idx) => {
      if ((e.orderIndex as number) !== idx) {
        setWorkoutExerciseOrder(e.id as WorkoutExerciseId, idx)
      }
    })
  }

  // Link a standalone exercise with the next one: reuse a neighbour's key if it
  // has one, else mint a fresh key, then assign both rows. Adjacency makes them
  // a superset block on the next render.
  const linkNext = (entry: SessionExerciseRow) => {
    const next = entries[indexOf(entry) + 1]
    if (!next) return
    const key = next.supersetGroup ?? entry.supersetGroup ?? newSupersetKey()
    setWorkoutExerciseSuperset(entry.id as WorkoutExerciseId, key)
    setWorkoutExerciseSuperset(next.id as WorkoutExerciseId, key)
  }

  const ungroup = (items: readonly SessionExerciseRow[]) =>
    items.forEach((it) => setWorkoutExerciseSuperset(it.id as WorkoutExerciseId, null))

  // Drop an exercise the user decided to skip. Soft delete cascades nothing —
  // any sets logged under it are filtered out by the session's queries since
  // they join on a live `workoutExercise`.
  const handleRemove = (entry: SessionExerciseRow) => {
    if (!window.confirm(`Remove ${entry.exerciseName} from this workout?`)) return
    removeExerciseFromWorkout(entry.id as WorkoutExerciseId)
  }

  const handleFinish = () => {
    if (!canFinish) return
    finishWorkoutSession(session.id, elapsedSec)
    navigate('/workout/finish', { state: { sessionId: session.id } })
  }

  const handlePauseToggle = () => {
    if (paused) resumeWorkoutSession(session.id)
    else pauseWorkoutSession(session.id, elapsedSec)
  }

  const handleDiscard = () => {
    const message = empty
      ? 'Discard this empty workout?'
      : 'Discard this workout? Everything you logged will be lost. This can’t be undone.'
    if (!window.confirm(message)) return
    discardWorkoutSession(session.id)
    navigate('/', { replace: true })
  }

  const chip =
    'inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-neon/[0.16] px-[10px] py-1 text-[12px] font-bold text-[#8b90f7]'

  return (
    <>
      <div className="px-[22px] pb-[130px] pt-[12px]">
        <header className="mb-6 flex items-center justify-between">
          <CircleButton onClick={() => navigate('/')} label="Back to home">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <button
            type="button"
            onClick={handleDiscard}
            aria-label="Discard workout"
            className="text-[13px] font-semibold text-muted active:scale-[0.97]"
          >
            Discard
          </button>
        </header>

        <HeroStat
          intro={paused ? 'Workout paused' : 'Workout in progress'}
          value={formatDurationSec(elapsedSec)}
          size={52}
          chips={
            <>
              <span className={chip}>
                <Dumbbell size={13} strokeWidth={2} />
                {entries.length} {entries.length === 1 ? 'exercise' : 'exercises'}
              </span>
              <span className={chip}>
                <Layers size={13} strokeWidth={2} />
                {completedSets.length} {completedSets.length === 1 ? 'set' : 'sets'}
              </span>
              <span className={`${chip} tnum`}>
                {formatVolume(volumeKg, unit)} {unit}
              </span>
            </>
          }
        />

        <Divider className="my-[18px]" />
        <Overline className="mb-[14px]">Exercises</Overline>

        {empty ? (
          <p className="mb-5 text-[13.5px] leading-[1.45] text-muted">
            Add the first exercise you’re about to do. We’ll show what you did last time.
          </p>
        ) : (
          <div className="mb-[18px] flex flex-col gap-[18px]">
            {(() => {
              let supersetIndex = 0
              return blocks.map((block) => {
                const card = (entry: SessionExerciseRow, linkable: boolean) => (
                  <WorkoutEntryCard
                    key={entry.id}
                    entry={entry}
                    index={indexOf(entry)}
                    total={entries.length}
                    onMoveUp={() => move(entry, -1)}
                    onMoveDown={() => move(entry, 1)}
                    onRemove={() => handleRemove(entry)}
                    onLinkNext={linkable ? () => linkNext(entry) : undefined}
                  />
                )
                if (block.group === null) {
                  const entry = block.items[0]
                  const hasNext = indexOf(entry) < entries.length - 1
                  return card(entry, hasNext)
                }
                const sIdx = supersetIndex++
                return (
                  <SupersetGroup
                    key={block.items[0].id}
                    label={String.fromCharCode(65 + sIdx)}
                    variant="flat"
                    onUngroup={() => ungroup(block.items)}
                  >
                    {block.items.map((entry) => card(entry, false))}
                  </SupersetGroup>
                )
              })
            })()}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/workout/add-exercise')}
          className="flex items-center gap-[13px] active:scale-[0.99]"
        >
          <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[14px] border border-dashed border-white/[0.22] text-[#8b90f7]">
            <Plus size={20} strokeWidth={2} />
          </span>
          <span className="text-[14.5px] font-semibold text-[#8b90f7]">Add exercise</span>
        </button>

        <MuscleDistributionCard sessionId={session.id as WorkoutSessionId} />
      </div>

      <FloatingAction>
        <SecondaryPill
          label={paused ? 'Resume' : 'Pause'}
          icon={
            paused ? (
              <Play size={17} strokeWidth={1.9} fill="currentColor" stroke="none" />
            ) : (
              <Pause size={17} strokeWidth={1.9} />
            )
          }
          onClick={handlePauseToggle}
        />
        <Button
          variant="primary"
          onClick={handleFinish}
          disabled={!canFinish}
          aria-label="Finish workout"
          className="pointer-events-auto flex-[1.3]"
        >
          Finish
          <Check size={17} strokeWidth={2} />
        </Button>
      </FloatingAction>
    </>
  )
}
