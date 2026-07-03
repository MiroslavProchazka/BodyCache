// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import type { ExerciseRow } from '@/evolu/rows'
import type { CompletedSetIndexRow } from '@/evolu/rows'
import { AddExercisePage } from './AddExercisePage'

const navigateMock = vi.fn()
const useQueryMock = vi.fn()

vi.mock('@/evolu/queries', () => ({
  activeWorkoutSession: 'active-session-query',
  allExercises: 'all-exercises-query',
  completedSetsIndex: 'completed-sets-index-query',
  performedExercises: 'performed-exercises-query',
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  Navigate: () => <div>redirect</div>,
}))

vi.mock('@evolu/react', () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}))

vi.mock('@/shared/units/UnitsContext', () => ({ useUnits: () => ({ unit: 'kg' }) }))

// Capture the props the page passes and render each exercise's computed subtitle
// so the test can assert the "last time" line came from the index map.
vi.mock('@/features/exercises/ExercisePickerList', () => ({
  ExercisePickerList: ({
    exercises,
    subtitleFor,
    header,
  }: {
    exercises: readonly ExerciseRow[]
    subtitleFor: (e: ExerciseRow) => string
    header?: ReactNode
  }) => (
    <div>
      {header}
      {exercises.map((e) => (
        <div key={e.id}>
          {e.name}: {subtitleFor(e)}
        </div>
      ))}
    </div>
  ),
}))

const exercise = (over: Record<string, unknown>): ExerciseRow =>
  ({
    id: 'ex-1',
    name: 'Bench Press',
    type: 'strength',
    bodyPart: 'chest',
    equipment: 'barbell',
    primaryPhotoId: null,
    notes: null,
    ...over,
  }) as ExerciseRow

const indexRow = (over: Record<string, unknown>): CompletedSetIndexRow =>
  ({
    id: 's1',
    orderIndex: 0,
    weightKg: 80,
    reps: 8,
    addedWeightKg: null,
    assistanceWeightKg: null,
    durationSec: null,
    distanceMeters: null,
    setType: null,
    rpe: null,
    exerciseId: 'ex-1',
    sessionId: 'sess-1',
    sessionStartedAt: '2026-01-01T00:00:00Z',
    ...over,
  }) as CompletedSetIndexRow

describe('AddExercisePage', () => {
  afterEach(cleanup)
  beforeEach(() => {
    navigateMock.mockReset()
    useQueryMock.mockReset()
  })

  it('renders each row with its last-performance label from the index map', () => {
    useQueryMock.mockImplementation((q: unknown) => {
      if (q === 'active-session-query') return [{ id: 'sess-1' }]
      if (q === 'all-exercises-query') return [exercise({})]
      if (q === 'completed-sets-index-query') return [indexRow({})]
      if (q === 'performed-exercises-query') return []
      return []
    })

    render(<AddExercisePage />)

    // The label is derived from the aggregate index, not a per-row query.
    expect(screen.getByText('Bench Press: 1×8 · 80 kg')).toBeTruthy()
  })

  it('shows "No history yet" for an exercise absent from the index', () => {
    useQueryMock.mockImplementation((q: unknown) => {
      if (q === 'active-session-query') return [{ id: 'sess-1' }]
      if (q === 'all-exercises-query') return [exercise({ id: 'ex-2', name: 'Squat' })]
      if (q === 'completed-sets-index-query') return []
      if (q === 'performed-exercises-query') return []
      return []
    })

    render(<AddExercisePage />)

    expect(screen.getByText('Squat: No history yet')).toBeTruthy()
  })

  it('redirects when there is no active session', () => {
    useQueryMock.mockImplementation((q: unknown) =>
      q === 'active-session-query' ? [] : [],
    )
    render(<AddExercisePage />)
    expect(screen.getByText('redirect')).toBeTruthy()
  })
})
