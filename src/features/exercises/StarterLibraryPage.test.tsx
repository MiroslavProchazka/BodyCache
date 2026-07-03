// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { StarterExercise } from './starterCatalog'
import { StarterLibraryPage } from './StarterLibraryPage'

const navigateMock = vi.fn()
const createExercise = vi.fn()
const addExercisePhoto = vi.fn()
const setPrimaryPhoto = vi.fn()
const enqueueMock = vi.fn()

const CATALOG: StarterExercise[] = [
  { name: 'Bench Press', type: 'strength', bodyPart: 'chest', equipment: 'barbell', animation: 'https://x/1.gif', cues: 'c' },
  { name: 'Squat', type: 'strength', bodyPart: 'legs', equipment: 'barbell', animation: 'https://x/2.gif', cues: 'c' },
  { name: 'Plank', type: 'timed', bodyPart: 'core', equipment: 'bodyweight', animation: 'https://x/3.gif', cues: 'c' },
]

vi.mock('@/evolu/queries', () => ({ allExercises: 'all-exercises-query' }))
vi.mock('@evolu/react', () => ({ useQuery: () => [] }))
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }))
vi.mock('@/evolu/mutations', () => ({
  useBodyCacheMutations: () => ({
    createExercise: (...args: unknown[]) => {
      createExercise(...args)
      return { ok: true, value: { id: `id-${createExercise.mock.calls.length}` } }
    },
    addExercisePhoto,
    setPrimaryPhoto,
  }),
}))
vi.mock('@/shared/components/Toast', () => ({ useToast: () => ({ showToast: vi.fn() }) }))
vi.mock('./starterMedia', () => ({ enqueueStarterMedia: (...a: unknown[]) => enqueueMock(...a) }))

// The catalog is loaded lazily; resolve it synchronously from the fixture.
vi.mock('./starterCatalog', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./starterCatalog')>()
  return { ...actual, loadStarterCatalog: () => Promise.resolve(CATALOG) }
})

// Render every row (no layout in happy-dom).
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 64,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({ key: index, index, start: index * 64 })),
    measureElement: () => {},
    options: { scrollMargin: 0 },
  }),
}))

// A minimal StarterRow: a button that toggles selection on click.
vi.mock('./StarterRow', () => ({
  StarterRow: ({
    exercise,
    onToggle,
  }: {
    exercise: StarterExercise
    onToggle: (e: StarterExercise) => void
  }) => (
    <button type="button" onClick={() => onToggle(exercise)}>
      row:{exercise.name}
    </button>
  ),
}))

describe('StarterLibraryPage handleAdd', () => {
  afterEach(cleanup)
  beforeEach(() => {
    navigateMock.mockReset()
    createExercise.mockReset()
    enqueueMock.mockReset()
  })

  it('creates every selected exercise synchronously, navigates, and enqueues media', async () => {
    render(<StarterLibraryPage />)

    // Wait for the lazily-loaded catalog rows to appear.
    await waitFor(() => expect(screen.getByText('row:Bench Press')).toBeTruthy())

    fireEvent.click(screen.getByText('row:Bench Press'))
    fireEvent.click(screen.getByText('row:Squat'))
    fireEvent.click(screen.getByText('row:Plank'))

    fireEvent.click(screen.getByRole('button', { name: 'Add 3 exercises' }))

    // Inserts happen synchronously; navigation is immediate (not awaiting fetch).
    expect(createExercise).toHaveBeenCalledTimes(3)
    expect(navigateMock).toHaveBeenCalledWith('/library', { replace: true })

    // Media is handed off to the background queue as 3 jobs — no fetch awaited.
    expect(enqueueMock).toHaveBeenCalledTimes(1)
    const jobs = enqueueMock.mock.calls[0][0] as Array<{ exerciseId: string; animationUrl: string }>
    expect(jobs).toHaveLength(3)
    expect(jobs.map((j) => j.animationUrl)).toEqual(['https://x/1.gif', 'https://x/2.gif', 'https://x/3.gif'])
  })
})
