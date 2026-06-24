import { useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft, Plus } from 'lucide-react'
import { allExercises, planById, planExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ExerciseRow } from '@/evolu/rows'
import { BODY_PARTS } from '@/evolu/schema'
import type { ExerciseId, ExercisePhotoId, PlanId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { SearchField } from '@/shared/components/SearchField'
import { FilterChips } from '@/shared/components/FilterChips'
import { humanize, metaLine } from '@/shared/utils/bodyParts'
import { ExerciseTile } from '@/features/exercises/ExerciseTile'

const CHIP_OPTIONS = [
  { value: 'all', label: 'All' },
  ...BODY_PARTS.map((p) => ({ value: p, label: humanize(p) })),
]

/** Pick an exercise to add to a plan, or create a new one. */
export function PlanAddExercisePage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <Navigate to="/plans" replace />
  return <PlanAddExerciseInner planId={id as PlanId} />
}

function PlanAddExerciseInner({ planId }: { planId: PlanId }) {
  const navigate = useNavigate()
  const { addExerciseToPlan } = useBodyCacheMutations()
  const plan = useQuery(planById(planId))[0]
  const exercises = useQuery(allExercises)
  const inPlan = useQuery(planExercises(planId))
  const [search, setSearch] = useState('')
  const [part, setPart] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return exercises.filter((e) => {
      if (part && e.bodyPart !== part) return false
      if (!q) return true
      return [e.name, e.bodyPart, e.equipment]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    })
  }, [exercises, search, part])

  if (!plan) return <Navigate to="/plans" replace />

  const add = (exerciseId: ExerciseId) => {
    addExerciseToPlan(planId, exerciseId, inPlan.length)
    navigate(`/plans/${planId}/edit`)
  }

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <header className="mb-[18px] flex items-center gap-3">
        <CircleButton onClick={() => navigate(`/plans/${planId}/edit`)} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-white">
          Add exercise
        </h1>
      </header>

      <div className="mb-[14px]">
        <SearchField value={search} onChange={setSearch} />
      </div>

      <div className="mb-4">
        <FilterChips
          options={CHIP_OPTIONS}
          value={part}
          onChange={setPart}
          allValue="all"
          ariaLabel="Filter by body part"
        />
      </div>

      <button
        type="button"
        onClick={() => navigate(`/library/new?plan=${planId}`)}
        className="mb-[18px] flex w-full items-center gap-[13px] rounded-2xl border border-neon/30 bg-gradient-to-br from-neon/[0.16] to-neon/[0.05] p-[15px] text-left"
      >
        <div
          className="flex h-[42px] w-[42px] flex-none items-center justify-center bg-neon text-white"
          style={{ borderRadius: '14px' }}
        >
          <Plus size={22} strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-white">Create new exercise</div>
          <div className="mt-[2px] text-[12.5px] text-muted">Snap a photo of the machine</div>
        </div>
      </button>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-faint">
          {exercises.length === 0
            ? 'Your library is empty — create your first exercise.'
            : 'No exercises match.'}
        </p>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {filtered.map((exercise) => (
            <PickerRow key={exercise.id} exercise={exercise} onAdd={add} />
          ))}
        </div>
      )}
    </div>
  )
}

function PickerRow({
  exercise,
  onAdd,
}: {
  exercise: ExerciseRow
  onAdd: (id: ExerciseId) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onAdd(exercise.id as ExerciseId)}
      className="flex w-full items-center gap-[13px] rounded-2xl border border-white/[0.07] bg-surface p-3 text-left"
    >
      <ExerciseTile
        photoId={exercise.primaryPhotoId as ExercisePhotoId | null}
        bodyPart={exercise.bodyPart}
        radius="14px"
        className="h-[46px] w-[46px] flex-none"
        glyphSize={23}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15.5px] font-semibold tracking-tight text-white">
          {exercise.name}
        </div>
        <div className="mt-[2px] truncate text-[12.5px] text-muted">
          {metaLine(exercise.bodyPart, exercise.equipment) || '—'}
        </div>
      </div>
      <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-neon/[0.12] text-neon">
        <Plus size={18} strokeWidth={2} />
      </div>
    </button>
  )
}
