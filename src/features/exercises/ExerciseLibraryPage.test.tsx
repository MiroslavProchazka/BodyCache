// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ExerciseRow } from '@/evolu/rows'
import { ExerciseLibraryPage } from './ExerciseLibraryPage'

const navigateMock = vi.fn()
const useQueryMock = vi.fn()

vi.mock('@/evolu/queries', () => ({
  allExercises: {},
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

describe('ExerciseLibraryPage', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    navigateMock.mockReset()
    useQueryMock.mockReset()
  })

  it('renders empty state and routes to starter and create actions', () => {
    useQueryMock.mockReturnValue([])

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

  it('filters exercises by search query', () => {
    useQueryMock.mockReturnValue([
      makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
      makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
    ])

    render(<ExerciseLibraryPage />)

    expect(screen.getByText('Bench Press')).toBeTruthy()
    expect(screen.getByText('Leg Press')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('Search exercises'), {
      target: { value: 'bench' },
    })

    expect(screen.getByText('Bench Press')).toBeTruthy()
    expect(screen.queryByText('Leg Press')).toBeNull()
  })

  it('filters exercises by selected body-part chip', () => {
    useQueryMock.mockReturnValue([
      makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
      makeExercise({ id: '2', name: 'Leg Press', bodyPart: 'legs' }),
    ])

    render(<ExerciseLibraryPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Legs' }))

    expect(screen.queryByText('Bench Press')).toBeNull()
    expect(screen.getByText('Leg Press')).toBeTruthy()
  })

  it('shows no-match message when search/filter result is empty', () => {
    useQueryMock.mockReturnValue([
      makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
    ])

    render(<ExerciseLibraryPage />)

    fireEvent.change(screen.getByPlaceholderText('Search exercises'), {
      target: { value: 'xyz' },
    })

    expect(screen.getByText('No exercises match.')).toBeTruthy()
  })
})
