import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/shared/components/AppShell'
import {
  ActiveWorkoutPage,
  AddExercisePage,
  CreateExercisePage,
  EditSessionAddExercisePage,
  EditSessionPage,
  ExerciseDetailPage,
  ExerciseLibraryPage,
  FinishPage,
  HistoryPage,
  LogExercisePage,
  PlanAddExercisePage,
  PlanDetailPage,
  PlanEditorPage,
  PlanLibraryPage,
  ProfilePage,
  SessionDetailPage,
  SettingsPage,
  StarterLibraryPage,
  TodayPage,
} from './routes.lazy'

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
          <Route path="/history/:id/edit" element={<EditSessionPage />} />
          <Route path="/history/:id/add-exercise" element={<EditSessionAddExercisePage />} />
          <Route path="/library" element={<ExerciseLibraryPage />} />
          <Route path="/library/new" element={<CreateExercisePage />} />
          <Route path="/library/starter" element={<StarterLibraryPage />} />
          <Route path="/library/:id" element={<ExerciseDetailPage />} />
          <Route path="/plans" element={<PlanLibraryPage />} />
          <Route path="/plans/:id" element={<PlanDetailPage />} />
          <Route path="/plans/:id/edit" element={<PlanEditorPage />} />
          <Route path="/plans/:id/add-exercise" element={<PlanAddExercisePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/profile" element={<ProfilePage />} />
          {/* Unknown routes fall back to Today rather than a blank shell. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  )
}
