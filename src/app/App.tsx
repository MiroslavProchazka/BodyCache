import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/shared/components/AppShell'
import { TodayPage } from '@/features/workouts/TodayPage'
import { ActiveWorkoutPage } from '@/features/workouts/ActiveWorkoutPage'
import { AddExercisePage } from '@/features/workouts/AddExercisePage'
import { LogExercisePage } from '@/features/workouts/LogExercisePage'
import { FinishPage } from '@/features/workouts/FinishPage'
import { HistoryPage } from '@/features/workouts/HistoryPage'
import { SessionDetailPage } from '@/features/workouts/SessionDetailPage'
import { ExerciseLibraryPage } from '@/features/exercises/ExerciseLibraryPage'
import { ExerciseDetailPage } from '@/features/exercises/ExerciseDetailPage'
import { CreateExercisePage } from '@/features/exercises/CreateExercisePage'
import { SettingsPage } from '@/features/settings/SettingsPage'

function PageFallback() {
  return <div className="flex min-h-[50vh] items-center justify-center text-faint">Loading…</div>
}

export function App() {
  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/workout" element={<ActiveWorkoutPage />} />
          <Route path="/workout/add-exercise" element={<AddExercisePage />} />
          <Route path="/workout/log/:exerciseId" element={<LogExercisePage />} />
          <Route path="/workout/finish" element={<FinishPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<SessionDetailPage />} />
          <Route path="/library" element={<ExerciseLibraryPage />} />
          <Route path="/library/new" element={<CreateExercisePage />} />
          <Route path="/library/:id" element={<ExerciseDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}
