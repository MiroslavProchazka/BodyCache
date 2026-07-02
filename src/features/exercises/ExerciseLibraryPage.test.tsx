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

/** One `performedExercises` row (the page only reads `id` off it). */
const performedRow = (id: string) => ({ id })

const setQueries = ({
  exercises = [] as ExerciseRow[],
  performed = [] as Array<{ id: string }>,
}) => {
  useQueryMock.mockImplementation((query: unknown) =>
    query === 'performed-exercises-query' ? performed : exercises,
  )
}

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

  it('hides the Favourites section when nothing has been logged', () => {
    setQueries({
      exercises: [makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' })],
    })

    render(<ExerciseLibraryPage />)

    expect(screen.queryByRole('heading', { name: 'Favourites' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'All exercises' })).toBeNull()
  })

  it('shows logged exercises in Favourites, deduplicated and recency-ordered', () => {
    setQueries({
      exercises: [
        makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
        makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
        makeExercise({ id: '3', name: 'Squat', bodyPart: 'legs' }),
      ],
      // Rows repeat per completed set, newest session first.
      performed: [performedRow('2'), performedRow('2'), performedRow('1')],
    })

    render(<ExerciseLibraryPage />)

    expect(screen.getByRole('heading', { name: 'Favourites' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'All exercises' })).toBeTruthy()

    const favourites = screen.getByRole('region', { name: 'Favourites' })
    const names = Array.from(favourites.querySelectorAll('div div')).map((el) => el.textContent)
    expect(names).toEqual(['Leg Press', 'Bench Press'])

    // Never-logged exercise stays out of Favourites but remains in the grid.
    expect(favourites.textContent).not.toContain('Squat')
    expect(screen.getByText('Squat')).toBeTruthy()
  })

  it('applies search and body-part filters to Favourites too', async () => {
    setQueries({
      exercises: [
        makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
        makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
      ],
      performed: [performedRow('1'), performedRow('2')],
    })

    render(<ExerciseLibraryPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Legs' }))

    const favourites = screen.getByRole('region', { name: 'Favourites' })
    expect(favourites.textContent).toContain('Leg Press')
    expect(favourites.textContent).not.toContain('Bench Press')

    fireEvent.change(screen.getByPlaceholderText('Search exercises'), {
      target: { value: 'bench' },
    })

    // Chest exercise doesn't match the Legs chip — the whole section hides.
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Favourites' })).toBeNull(),
    )
  })
})
