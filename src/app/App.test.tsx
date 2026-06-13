// @vitest-environment happy-dom
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/shared/components/AppShell', () => ({
  AppShell: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('./routes.lazy', () => ({
  TodayPage: () => <h1>Today</h1>,
  ActiveWorkoutPage: () => <h1>Active Workout</h1>,
  AddExercisePage: () => <h1>Add Exercise</h1>,
  LogExercisePage: () => <h1>Log Exercise</h1>,
  FinishPage: () => <h1>Finish</h1>,
  HistoryPage: () => <h1>History</h1>,
  SessionDetailPage: () => <h1>Session Detail</h1>,
  ExerciseLibraryPage: () => <h1>Exercise Library</h1>,
  ExerciseDetailPage: () => <h1>Exercise Detail</h1>,
  CreateExercisePage: () => <h1>Create Exercise</h1>,
  StarterLibraryPage: () => <h1>Starter Library</h1>,
  SettingsPage: () => <h1>Settings</h1>,
  ProfilePage: () => <h1>Profile</h1>,
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