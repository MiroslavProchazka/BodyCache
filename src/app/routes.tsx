import { createBrowserRouter, Link, NavLink, Outlet } from 'react-router-dom'
import { Dumbbell, FileText, History, Home as HomeIcon, Settings, Sparkles } from 'lucide-react'
import { Home } from '../pages/Home'
import { WorkoutActive } from '../pages/WorkoutActive'
import { WorkoutDetail } from '../pages/WorkoutDetail'
import { Exercises } from '../pages/Exercises'
import { ExerciseDetail } from '../pages/ExerciseDetail'
import { Templates } from '../pages/Templates'
import { TemplateEditor } from '../pages/TemplateEditor'
import { SettingsPage } from '../pages/Settings'
import { Button } from '../components/ui/button'

const navItems = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/workout/active', label: 'Workout', icon: Dumbbell },
  { to: '/exercises', label: 'Exercises', icon: Sparkles },
  { to: '/templates', label: 'Templates', icon: FileText },
  { to: '/history', label: 'History', icon: History },
  { to: '/settings', label: 'Settings', icon: Settings }
]

const Shell = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link className="text-sm font-semibold tracking-wide text-primary" to="/">
            BodyCache
          </Link>
          <Button asChild size="sm" variant="secondary">
            <Link to="/workout/active">Start Workout</Link>
          </Button>
        </div>
      </header>
      <div className="container grid gap-6 py-6 md:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                  ].join(' ')
                }
                key={item.to}
                to={item.to}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'workout/active', element: <WorkoutActive /> },
      { path: 'workout/:sessionId', element: <WorkoutDetail /> },
      { path: 'exercises', element: <Exercises /> },
      { path: 'exercises/:exerciseId', element: <ExerciseDetail /> },
      { path: 'templates', element: <Templates /> },
      { path: 'templates/new', element: <TemplateEditor /> },
      { path: 'templates/:templateId', element: <TemplateEditor /> },
      { path: 'history', element: <WorkoutDetail mode="history" /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
])
