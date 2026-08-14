import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, ChevronLeft, Plus } from 'lucide-react'
import { sessionById, sessionExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { SessionExerciseRow, WorkoutSessionRow } from '@/evolu/rows'
import type { WorkoutExerciseId, WorkoutSessionId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { ConfirmSheet } from '@/shared/components/ConfirmSheet'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { Overline } from '@/shared/components/Overline'
import { dayKey } from '@/shared/utils/dates'
import { SupersetGroup } from './SupersetGroup'
import { groupExercises, newSupersetKey, supersetLabel } from './supersets'
import { WorkoutExerciseEditor } from './WorkoutExerciseEditor'

/** Edit a finished workout: its date, ordered exercises, and their logged sets. */
export function EditSessionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const session = useQuery(sessionById((id ?? '') as WorkoutSessionId))[0] as
    | WorkoutSessionRow
    | undefined

  if (!session || session.status !== 'finished') {
    return (
      <div className="px-5 py-16 text-center text-muted">
        <p>Workout not found.</p>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="mt-3 font-semibold text-[#8b90f7]"
        >
          Back to history
        </button>
      </div>
    )
  }
  return <EditSessionInner session={session} />
}

function EditSessionInner({ session }: { session: WorkoutSessionRow }) {
  const navigate = useNavigate()
  const {
    updateWorkoutSession,
    removeExerciseFromWorkout,
    setWorkoutExerciseOrder,
    setWorkoutExerciseSuperset,
  } = useBodyCacheMutations()
  // Ordered by `orderIndex` (the query sorts), so grouping folds live.
  const exercises = useQuery(
    sessionExercises(session.id as WorkoutSessionId),
  ) as SessionExerciseRow[]
  const [removeTarget, setRemoveTarget] = useState<SessionExerciseRow | null>(null)

  const startedAt = session.startedAt as unknown as string | Date
  const sessionId = session.id as WorkoutSessionId

  // Re-date the workout while preserving the original time-of-day, and shift
  // `finishedAt` by the same amount so the recorded duration is unchanged.
  const handleDateChange = (value: string) => {
    if (!value) return
    const [y, m, d] = value.split('-').map(Number)
    const orig = new Date(startedAt)
    const next = new Date(orig)
    next.setFullYear(y, m - 1, d)
    const deltaMs = next.getTime() - orig.getTime()
    if (deltaMs === 0) return
    const nextIso = next.toISOString()
    const finishedAt = session.finishedAt as unknown as string | Date | null
    updateWorkoutSession(sessionId, {
      startedAt: nextIso,
      date: nextIso,
      ...(finishedAt
        ? { finishedAt: new Date(new Date(finishedAt).getTime() + deltaMs).toISOString() }
        : {}),
    })
  }

  const blocks = groupExercises(exercises)
  const indexOf = (entry: SessionExerciseRow) =>
    exercises.findIndex((e) => String(e.id) === String(entry.id))

  // Reorder by swapping the two rows' stored orderIndex values (mirrors plans).
  const move = (entry: SessionExerciseRow, dir: -1 | 1) => {
    const i = indexOf(entry)
    const other = exercises[i + dir]
    if (!other) return
    setWorkoutExerciseOrder(entry.id as WorkoutExerciseId, other.orderIndex as number)
    setWorkoutExerciseOrder(other.id as WorkoutExerciseId, entry.orderIndex as number)
  }

  // Link a standalone exercise with the next one (see ActiveWorkoutPage).
  const linkNext = (entry: SessionExerciseRow) => {
    const next = exercises[indexOf(entry) + 1]
    if (!next) return
    const key = next.supersetGroup ?? entry.supersetGroup ?? newSupersetKey()
    setWorkoutExerciseSuperset(entry.id as WorkoutExerciseId, key)
    setWorkoutExerciseSuperset(next.id as WorkoutExerciseId, key)
  }

  const ungroup = (items: readonly SessionExerciseRow[]) =>
    items.forEach((it) => setWorkoutExerciseSuperset(it.id as WorkoutExerciseId, null))

  const handleRemove = (entry: SessionExerciseRow) => {
    setRemoveTarget(entry)
  }

  const confirmRemove = () => {
    if (!removeTarget) return
    removeExerciseFromWorkout(removeTarget.id as WorkoutExerciseId)
    setRemoveTarget(null)
  }

  const completedAt = new Date(startedAt).toISOString()

  return (
    <>
      <div className="px-[22px] pb-[150px] pt-[14px]">
        <header className="mb-[22px] flex items-center gap-3">
          <CircleButton onClick={() => navigate(`/history/${sessionId}`)} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-white">
            Edit workout
          </h1>
        </header>

        <Overline className="mb-2">Date</Overline>
        <input
          type="date"
          value={dayKey(startedAt)}
          onChange={(e) => handleDateChange(e.target.value)}
          className="mb-6 w-full rounded-[14px] border border-white/[0.08] bg-surface px-4 py-[13px] text-[16px] font-semibold text-white focus:outline-none focus:ring-1 focus:ring-neon/40 [color-scheme:dark]"
        />

        <Overline className="mb-3">Exercises</Overline>
        {exercises.length === 0 ? (
          <p className="mb-3 rounded-[16px] border-[1.5px] border-dashed border-white/[0.14] px-5 py-7 text-center text-sm text-muted">
            No exercises yet. Add the ones you did in this workout.
          </p>
        ) : (
          <div className="mb-3 flex flex-col gap-3">
            {(() => {
              let supersetIndex = 0
              return blocks.map((block) => {
                const editor = (
                  entry: SessionExerciseRow,
                  badge: string | null,
                  linkable: boolean,
                ) => (
                  <WorkoutExerciseEditor
                    key={entry.id}
                    entry={entry}
                    index={indexOf(entry)}
                    total={exercises.length}
                    completedAt={completedAt}
                    onMoveUp={() => move(entry, -1)}
                    onMoveDown={() => move(entry, 1)}
                    onRemove={() => handleRemove(entry)}
                    badge={badge}
                    onLinkNext={linkable ? () => linkNext(entry) : undefined}
                  />
                )
                if (block.group === null) {
                  const entry = block.items[0]
                  const hasNext = indexOf(entry) < exercises.length - 1
                  return editor(entry, null, hasNext)
                }
                const sIdx = supersetIndex++
                return (
                  <SupersetGroup
                    key={block.items[0].id}
                    label={String.fromCharCode(65 + sIdx)}
                    onUngroup={() => ungroup(block.items)}
                  >
                    {block.items.map((entry, mi) => editor(entry, supersetLabel(sIdx, mi), false))}
                  </SupersetGroup>
                )
              })
            })()}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate(`/history/${sessionId}/add-exercise`)}
          className="mt-[18px] flex min-h-[44px] w-full items-center gap-[13px] text-left transition-transform active:scale-[0.99]"
        >
          <span className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[14px] border border-dashed border-white/[0.22] text-[#8b90f7]">
            <Plus size={20} strokeWidth={2} />
          </span>
          <span className="text-[14.5px] font-semibold text-[#8b90f7]">Add exercise</span>
        </button>
      </div>

      <FloatingAction>
        <ActionPill
          label="Done"
          icon={<Check size={19} strokeWidth={2} />}
          onClick={() => navigate(`/history/${sessionId}`)}
        />
      </FloatingAction>
      <ConfirmSheet
        open={removeTarget !== null}
        title={removeTarget ? `Remove ${removeTarget.exerciseName} from this workout?` : ''}
        confirmLabel="Remove"
        confirmVariant="destructive"
        onConfirm={confirmRemove}
        onClose={() => setRemoveTarget(null)}
      />
    </>
  )
}
