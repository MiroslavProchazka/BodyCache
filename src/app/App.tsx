import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/shared/components/AppShell'
import { TodayPage } from '@/features/workouts/TodayPage'
import { ExerciseLibraryPage } from '@/features/exercises/ExerciseLibraryPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/library" element={<ExerciseLibraryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  )
}
