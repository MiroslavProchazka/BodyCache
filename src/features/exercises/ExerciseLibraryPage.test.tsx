// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ExerciseRow } from '@/evolu/rows'
import { ExerciseLibraryPage } from './ExerciseLibraryPage'

const navigateMock = vi.fn()
const useQueryMock = vi.fn()

vi.mock('@/evolu/queries', () => ({
  allExercises: 'all-exercises-query',
  performedExercises: 'performed-exercises-query',
  completedSetsIndex: 'completed-sets-index-query',
}))

// happy-dom has no layout, so a real virtualizer would render nothing. Render
// every row instead — the assertions here are about filtering, not windowing.
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 212,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({ key: index, index, start: index * 212 })),
    measureElement: () => {},
    options: { scrollMargin: 0 },
  }),
}))

vi.mock('@/evolu/schema', () => ({
  BODY_PARTS: ['chest', 'legs'],
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('@evolu/react', () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}))

vi.mock('./ExerciseCard', () => ({
  ExerciseCard: ({ exercise }: { exercise: { name: string } }) => <div>{exercise.name}</div>,
}))

const makeExercise = (overrides: Record<string, unknown>): ExerciseRow =>
  ({
    id: 'exercise-id',
    name: 'Bench Press',
    type: 'strength',
    bodyPart: 'chest',
    equipment: 'barbell',
    primaryPhotoId: null,
    notes: null,
    ...overrides,
  }) as ExerciseRow

const setQueries = ({
  exercises = [] as ExerciseRow[],
  performed = [] as Array<{ id: string }>,
  completedSets = [] as Array<Record<string, unknown>>,
}) => {
  useQueryMock.mockImplementation((query: unknown) => {
    if (query === 'performed-exercises-query') return performed
    // The last-performance index query is exercised in lastPerformance.test.ts;
    // here the mocked ExerciseCard ignores the summary, so an empty set is fine.
    if (query === 'completed-sets-index-query') return completedSets
    return exercises
  })
}

/** One `performedExercises` row (the page only reads `id` off it). */
const performedRow = (id: string) => ({ id })

const completedSetIndexRow = (exerciseId: string, sessionStartedAt: string) => ({
  id: `${exerciseId}-${sessionStartedAt}`,
  exerciseId,
  sessionId: `session-${sessionStartedAt}`,
  sessionStartedAt,
  orderIndex: 0,
  weightKg: 1,
  reps: 1,
  addedWeightKg: null,
  assistanceWeightKg: null,
  durationSec: null,
  distanceMeters: null,
  setType: null,
  rpe: null,
})

describe('ExerciseLibraryPage', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    navigateMock.mockReset()
    useQueryMock.mockReset()
  })

  it('renders empty state and routes to starter and create actions', () => {
    setQueries({})

    render(<ExerciseLibraryPage />)

    expect(screen.getByRole('heading', { name: 'No exercises yet' })).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Add from starter library' }))
    expect(navigateMock).toHaveBeenLastCalledWith('/library/starter')

    fireEvent.click(screen.getByRole('button', { name: 'Add starter exercises' }))
    expect(navigateMock).toHaveBeenLastCalledWith('/library/starter')

    const createText = screen.getByText('Create exercise')
    fireEvent.click(createText.closest('button') as HTMLButtonElement)
    expect(navigateMock).toHaveBeenLastCalledWith('/library/new')
  })

  it('filters exercises by search query', async () => {
    setQueries({
      exercises: [
        makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
        makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
      ],
    })

    render(<ExerciseLibraryPage />)

    expect(screen.getByText('Bench Press')).toBeTruthy()
    expect(screen.getByText('Leg Press')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('Search exercises'), {
      target: { value: 'bench' },
    })

    // Search is debounced — wait for the filtered result to settle.
    await waitFor(() => expect(screen.queryByText('Leg Press')).toBeNull())
    expect(screen.getByText('Bench Press')).toBeTruthy()
  })

  it('filters exercises by selected body-part chip', () => {
    setQueries({
      exercises: [
        makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
        makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
      ],
    })

    render(<ExerciseLibraryPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Legs' }))

    expect(screen.queryByText('Bench Press')).toBeNull()
    expect(screen.getByText('Leg Press')).toBeTruthy()
  })

  it('shows no-match message when search/filter result is empty', async () => {
    setQueries({
      exercises: [makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' })],
    })

    render(<ExerciseLibraryPage />)

    fireEvent.change(screen.getByPlaceholderText('Search exercises'), {
      target: { value: 'xyz' },
    })

    await waitFor(() => expect(screen.getByText('No exercises match.')).toBeTruthy())
  })

  it('hides the Favorites section when nothing has been logged', () => {
    setQueries({
      exercises: [makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' })],
    })

    render(<ExerciseLibraryPage />)

    expect(screen.queryByRole('heading', { name: 'Favorites' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'All exercises' })).toBeNull()
  })

  it('shows logged exercises in Favorites, deduplicated and recency-ordered', () => {
    setQueries({
      exercises: [
        makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
        makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
        makeExercise({ id: '3', name: 'Squat', bodyPart: 'legs' }),
      ],
      // Rows repeat per completed set, newest finished session first.
      performed: [performedRow('2'), performedRow('2'), performedRow('1')],
    })

    render(<ExerciseLibraryPage />)

    expect(screen.getByRole('heading', { name: 'Favorites' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'All exercises' })).toBeTruthy()

    const favorites = screen.getByRole('region', { name: 'Favorites' })
    const names = Array.from(favorites.querySelectorAll('div div')).map((el) => el.textContent)
    expect(names).toEqual(['Leg Press', 'Bench Press'])

    // Never-logged exercise stays out of Favorites but remains in the grid.
    expect(favorites.textContent).not.toContain('Squat')
    expect(screen.getByText('Squat')).toBeTruthy()
  })

  it('applies search and body-part filters to Favorites too', async () => {
    setQueries({
      exercises: [
        makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
        makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
      ],
      performed: [performedRow('1'), performedRow('2')],
    })

    render(<ExerciseLibraryPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Legs' }))

    const favorites = screen.getByRole('region', { name: 'Favorites' })
    expect(favorites.textContent).toContain('Leg Press')
    expect(favorites.textContent).not.toContain('Bench Press')

    fireEvent.change(screen.getByPlaceholderText('Search exercises'), {
      target: { value: 'bench' },
    })

    // Chest exercise doesn't match the Legs chip — the whole section hides.
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Favorites' })).toBeNull(),
    )
  })

  it('does not use completed-set index rows as the Favorites source', () => {
    setQueries({
      exercises: [
        makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
        makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
      ],
      performed: [performedRow('1')],
      completedSets: [completedSetIndexRow('2', '2026-03-01T00:00:00Z')],
    })

    render(<ExerciseLibraryPage />)

    const favorites = screen.getByRole('region', { name: 'Favorites' })
    expect(favorites.textContent).toContain('Bench Press')
    expect(favorites.textContent).not.toContain('Leg Press')
  })
})
