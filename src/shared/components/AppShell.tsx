import { Suspense, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { ResumeBar } from './ResumeBar'
import { RestTimerBar } from '@/shared/rest/RestTimerBar'

/** Routes that show the bottom tab bar (the tab roots). */
const TAB_ROOTS = new Set(['/', '/plans', '/history', '/library', '/settings'])

interface AppShellProps {
  children: ReactNode
}

/**
 * Full-bleed mobile shell: a scrolling content column with a bottom tab bar on
 * the tab roots and a floating resume pill when a workout is in progress.
 * Content is centered to a phone-ish max width so it also looks right on
 * desktop.
 */
export function AppShell({ children }: AppShellProps) {
  const { pathname } = useLocation()
  const showTabBar = TAB_ROOTS.has(pathname)

  return (
    <div className="flex h-dvh flex-col bg-ink text-white">
      <main className="no-scrollbar relative flex-1 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>
      {/* Floating rest countdown — available on every in-app screen. */}
      <RestTimerBar />
      {showTabBar && (
        <>
          <Suspense fallback={null}>
            <ResumeBar />
          </Suspense>
          <BottomNav />
        </>
      )}
    </div>
  )
}
