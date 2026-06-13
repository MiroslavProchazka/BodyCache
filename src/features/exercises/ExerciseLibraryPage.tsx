import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Plus, Dumbbell, ListPlus } from 'lucide-react'
import { allExercises } from '@/evolu/queries'
import { BODY_PARTS } from '@/evolu/schema'
import { SearchField } from '@/shared/components/SearchField'
import { FilterChips } from '@/shared/components/FilterChips'
import { Button } from '@/shared/components/Button'
import { humanize } from '@/shared/utils/bodyParts'
import { ExerciseCard } from './ExerciseCard'

const CHIP_OPTIONS = [
  { value: 'all', label: 'All' },
  ...BODY_PARTS.map((p) => ({ value: p, label: humanize(p) })),
]

/** Browse / search all exercises; entry to detail and create. */
export function ExerciseLibraryPage() {
  const navigate = useNavigate()
  const exercises = useQuery(allExercises)
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

  const hasAny = exercises.length > 0

  return (
    <div className="px-5 pb-[130px] pt-[6px]">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-[26px] font-semibold tracking-tight text-white">
          Exercises
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/library/starter')}
            aria-label="Add from starter library"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-white/10 bg-surface text-soft"
          >
            <ListPlus size={21} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => navigate('/library/new')}
            aria-label="Create exercise"
            className="flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-neon text-ink"
          >
            <Plus size={22} strokeWidth={2} />
          </button>
        </div>
      </header>

      {hasAny && (
        <>
          <div className="mb-[14px]">
            <SearchField value={search} onChange={setSearch} />
          </div>
          <div className="mb-[18px]">
            <FilterChips
              options={CHIP_OPTIONS}
              value={part}
              onChange={setPart}
              allValue="all"
              ariaLabel="Filter by body part"
            />
          </div>
        </>
      )}

      {!hasAny ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-inset text-neon">
            <Dumbbell size={28} strokeWidth={1.75} />
          </div>
          <h2 className="font-display text-lg font-semibold text-white">No exercises yet</h2>
          <p className="max-w-xs text-sm text-muted">
            Add the basics from the starter library, or create your own — snap a photo of the
            machine, name it, and you're set.
          </p>
          <Button className="mt-2" onClick={() => navigate('/library/starter')}>
            <ListPlus size={18} strokeWidth={2} /> Add starter exercises
          </Button>
          <Button variant="outline" onClick={() => navigate('/library/new')}>
            <Plus size={18} strokeWidth={2} /> Create exercise
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-faint">No exercises match.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  )
}
