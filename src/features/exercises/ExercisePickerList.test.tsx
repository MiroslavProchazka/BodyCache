// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ExerciseRow } from '@/evolu/rows'
import { ExercisePickerList } from './ExercisePickerList'

// happy-dom has no layout, so a real virtualizer renders nothing. Render every
// row instead — these assertions are about filtering + pick callbacks, not
// windowing.
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 72,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({ key: index, index, start: index * 72 })),
    measureElement: () => {},
    options: { scrollMargin: 0 },
  }),
}))

vi.mock('@/evolu/schema', () => ({ BODY_PARTS: ['chest', 'legs'] }))

vi.mock('./ExerciseTile', () => ({ ExerciseTile: () => <div data-testid="tile" /> }))

const makeExercise = (over: Record<string, unknown>): ExerciseRow =>
  ({
    id: 'id',
    name: 'Bench Press',
    type: 'strength',
    bodyPart: 'chest',
    equipment: 'barbell',
    primaryPhotoId: null,
    notes: null,
    ...over,
  }) as ExerciseRow

const subtitleFor = (e: ExerciseRow) => `sub-${e.name}`

describe('ExercisePickerList', () => {
  afterEach(cleanup)
  beforeEach(() => vi.clearAllMocks())

  it('renders each exercise with its subtitle', () => {
    render(
      <ExercisePickerList
        exercises={[
          makeExercise({ id: '1', name: 'Bench Press' }),
          makeExercise({ id: '2', name: 'Squat', bodyPart: 'legs' }),
        ]}
        onPick={vi.fn()}
        subtitleFor={subtitleFor}
      />,
    )
    expect(screen.getByText('Bench Press')).toBeTruthy()
    expect(screen.getByText('sub-Bench Press')).toBeTruthy()
    expect(screen.getByText('Squat')).toBeTruthy()
  })

  it('filters by debounced search', async () => {
    render(
      <ExercisePickerList
        exercises={[
          makeExercise({ id: '1', name: 'Bench Press' }),
          makeExercise({ id: '2', name: 'Squat', bodyPart: 'legs' }),
        ]}
        onPick={vi.fn()}
        subtitleFor={subtitleFor}
      />,
    )
    fireEvent.change(screen.getByPlaceholderText('Search exercises'), {
      target: { value: 'squat' },
    })
    await waitFor(() => expect(screen.queryByText('Bench Press')).toBeNull())
    expect(screen.getByText('Squat')).toBeTruthy()
  })

  it('filters by body-part chip', async () => {
    render(
      <ExercisePickerList
        exercises={[
          makeExercise({ id: '1', name: 'Bench Press', bodyPart: 'chest' }),
          makeExercise({ id: '2', name: 'Squat', bodyPart: 'legs' }),
        ]}
        onPick={vi.fn()}
        subtitleFor={subtitleFor}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Legs' }))
    await waitFor(() => expect(screen.queryByText('Bench Press')).toBeNull())
    expect(screen.getByText('Squat')).toBeTruthy()
  })

  it('calls onPick with the exercise id when a row is tapped', () => {
    const onPick = vi.fn()
    render(
      <ExercisePickerList
        exercises={[makeExercise({ id: 'ex-9', name: 'Bench Press' })]}
        onPick={onPick}
        subtitleFor={subtitleFor}
      />,
    )
    fireEvent.click(screen.getByText('Bench Press').closest('button') as HTMLButtonElement)
    expect(onPick).toHaveBeenCalledWith('ex-9')
  })

  it('shows the empty-library message when there are no exercises', () => {
    render(<ExercisePickerList exercises={[]} onPick={vi.fn()} subtitleFor={subtitleFor} />)
    expect(screen.getByText(/library is empty/i)).toBeTruthy()
  })

  it('shows the no-match message when a search filters everything out', async () => {
    render(
      <ExercisePickerList
        exercises={[makeExercise({ id: '1', name: 'Bench Press' })]}
        onPick={vi.fn()}
        subtitleFor={subtitleFor}
      />,
    )
    fireEvent.change(screen.getByPlaceholderText('Search exercises'), { target: { value: 'zzz' } })
    await waitFor(() => expect(screen.getByText('No exercises match.')).toBeTruthy())
  })

  it('renders a header slot between filters and the list', () => {
    render(
      <ExercisePickerList
        exercises={[makeExercise({ id: '1', name: 'Bench Press' })]}
        onPick={vi.fn()}
        subtitleFor={subtitleFor}
        header={<div>Create new exercise</div>}
      />,
    )
    expect(screen.getByText('Create new exercise')).toBeTruthy()
  })
})
