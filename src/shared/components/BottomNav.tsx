import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Settings } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Today', Icon: Home },
  { to: '/library', label: 'Library', Icon: BookOpen },
  { to: '/settings', label: 'Settings', Icon: Settings },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-800 bg-gray-950 pb-safe">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            [
              'flex flex-col items-center gap-0.5 px-6 py-1 text-xs transition-colors',
              isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300',
            ].join(' ')
          }
        >
          <Icon size={22} strokeWidth={1.75} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
