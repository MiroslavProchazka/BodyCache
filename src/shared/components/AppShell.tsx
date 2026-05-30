import type { ReactNode } from 'react'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col bg-gray-950 text-gray-100">
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
