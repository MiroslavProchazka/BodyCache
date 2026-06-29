import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

type ModuleWithPages = Record<string, unknown>

const lazyNamed = (
  importer: () => Promise<ModuleWithPages>,
  exportName: string,
): LazyExoticComponent<ComponentType<object>> =>
  lazy(async () => {
    const mod = await importer()
    return { default: mod[exportName] as ComponentType<object> }
  })

export const TodayPage = lazyNamed(() => import('@/features/workouts/TodayPage'), 'TodayPage')
export const ActiveWorkoutPage = lazyNamed(
  () => import('@/features/workouts/ActiveWorkoutPage'),
  'ActiveWorkoutPage',
)
export const AddExercisePage = lazyNamed(
  () => import('@/features/workouts/AddExercisePage'),
  'AddExercisePage',
)
export const LogExercisePage = lazyNamed(
  () => import('@/features/workouts/LogExercisePage'),
  'LogExercisePage',
)
export const FinishPage = lazyNamed(() => import('@/features/workouts/FinishPage'), 'FinishPage')
export const HistoryPage = lazyNamed(() => import('@/features/workouts/HistoryPage'), 'HistoryPage')
export const SessionDetailPage = lazyNamed(
  () => import('@/features/workouts/SessionDetailPage'),
  'SessionDetailPage',
)
export const EditSessionPage = lazyNamed(
  () => import('@/features/workouts/EditSessionPage'),
  'EditSessionPage',
)
export const EditSessionAddExercisePage = lazyNamed(
  () => import('@/features/workouts/EditSessionAddExercisePage'),
  'EditSessionAddExercisePage',
)

export const ExerciseLibraryPage = lazyNamed(
  () => import('@/features/exercises/ExerciseLibraryPage'),
  'ExerciseLibraryPage',
)
export const CreateExercisePage = lazyNamed(
  () => import('@/features/exercises/CreateExercisePage'),
  'CreateExercisePage',
)
export const StarterLibraryPage = lazyNamed(
  () => import('@/features/exercises/StarterLibraryPage'),
  'StarterLibraryPage',
)
export const ExerciseDetailPage = lazyNamed(
  () => import('@/features/exercises/ExerciseDetailPage'),
  'ExerciseDetailPage',
)

export const PlanLibraryPage = lazyNamed(
  () => import('@/features/plans/PlanLibraryPage'),
  'PlanLibraryPage',
)
export const PlanDetailPage = lazyNamed(
  () => import('@/features/plans/PlanDetailPage'),
  'PlanDetailPage',
)
export const PlanEditorPage = lazyNamed(
  () => import('@/features/plans/PlanEditorPage'),
  'PlanEditorPage',
)
export const PlanAddExercisePage = lazyNamed(
  () => import('@/features/plans/PlanAddExercisePage'),
  'PlanAddExercisePage',
)

export const SettingsPage = lazyNamed(
  () => import('@/features/settings/SettingsPage'),
  'SettingsPage',
)
export const ProfilePage = lazyNamed(() => import('@/features/profile/ProfilePage'), 'ProfilePage')
