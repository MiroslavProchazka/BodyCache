import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Plus, Search, Dumbbell } from 'lucide-react'
import { allExercises } from '@/evolu/queries'
import { EXERCISE_TYPES, BODY_PARTS } from '@/evolu/schema'
import { Button } from '@/shared/components/Button'
import { EmptyState } from '@/shared/components/EmptyState'
import { ExerciseCard } from './ExerciseCard'

export function ExerciseLibraryPage() {
  const exercises = useQuery(allExercises)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [bodyPartFilter, setBodyPartFilter] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return exercises.filter((e) => {
      if (q && !String(e.name).toLowerCase().includes(q)) return false
      if (typeFilter && e.type !== typeFilter) return false
      if (bodyPartFilter && e.bodyPart !== bodyPartFilter) return false
      return true
    })
  }, [exercises, search, typeFilter, bodyPartFilter])

  const hasAny = exercises.length > 0

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-5">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">Library</h1>
        <Link to="/library/new">
          <Button className="px-3 py-2 text-sm">
            <Plus size={18} /> New
          </Button>
        </Link>
      </header>

      {hasAny && (
        <>
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="search"
              inputMode="search"
              placeholder="Search exercises"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-3 text-base text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <FilterRow
            label="Type"
            options={EXERCISE_TYPES}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <FilterRow
            label="Body part"
            options={BODY_PARTS}
            value={bodyPartFilter}
            onChange={setBodyPartFilter}
          />
        </>
      )}

      {!hasAny ? (
        <EmptyState
          Icon={Dumbbell}
          title="No exercises yet"
          description="Create your first exercise — snap a photo of the machine, name it, and you're set."
          action={
            <Link to="/library/new">
              <Button>
                <Plus size={18} /> Create exercise
              </Button>
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          No exercises match your search.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" aria-label={label}>
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(active ? null : opt)}
            className={[
              'shrink-0 rounded-full px-3 py-1.5 text-sm capitalize transition-colors',
              active
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
            ].join(' ')}
          >
            {opt.replace('_', ' ')}
          </button>
        )
      })}
    </div>
  )
}
