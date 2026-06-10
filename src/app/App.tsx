import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/shared/components/AppShell'
import { TodayPage } from '@/features/workouts/TodayPage'
import { ExerciseLibraryPage } from '@/features/exercises/ExerciseLibraryPage'
import { ExerciseDetailPage } from '@/features/exercises/ExerciseDetailPage'
import { CreateExercisePage } from '@/features/exercises/CreateExercisePage'
import { SettingsPage } from '@/features/settings/SettingsPage'

function PageFallback() {
  return (
    <div className="flex min-h-full items-center justify-center py-20 text-gray-500">
      Loading…
    </div>
  )
}

export function App() {
  return (
    <AppShell>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/library" element={<ExerciseLibraryPage />} />
          <Route path="/library/new" element={<CreateExercisePage />} />
          <Route path="/library/:id" element={<ExerciseDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}
