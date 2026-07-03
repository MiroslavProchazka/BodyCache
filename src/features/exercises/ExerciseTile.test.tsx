// @vitest-environment happy-dom
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ExercisePhotoId } from '@/evolu/schema'
import { ExerciseTile } from './ExerciseTile'

const useQueryMock = vi.hoisted(() => vi.fn())

vi.mock('@evolu/react', () => ({
  useQuery: (...args: unknown[]) => useQueryMock(...args),
}))

vi.mock('@/evolu/queries', () => ({
  photoById: (id: unknown) => ({ type: 'photo-by-id', id }),
}))

vi.mock('lucide-react', () => ({
  Dumbbell: () => <span data-testid="tile-placeholder" />,
}))

describe('ExerciseTile', () => {
  beforeEach(() => {
    useQueryMock.mockReset()
  })

  it('keeps photo query suspension inside the tile placeholder', () => {
    useQueryMock.mockImplementation(() => {
      throw new Promise(() => {})
    })

    render(
      <ExerciseTile
        photoId={'photo-1' as ExercisePhotoId}
        bodyPart="chest"
        radius="14px"
      />,
    )

    expect(screen.getByTestId('tile-placeholder')).toBeTruthy()
  })
})
