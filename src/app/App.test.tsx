import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/features/exercises/ExerciseLibraryPage', () => ({
  ExerciseLibraryPage: () => <h1>Exercise Library</h1>,
}))

import { App } from './App'

describe('App', () => {
  it('renders Today page on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /today/i })).toBeTruthy()
  })

  it('renders Exercise Library page on library route', () => {
    render(
      <MemoryRouter initialEntries={['/library']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /exercise library/i })).toBeTruthy()
  })
})