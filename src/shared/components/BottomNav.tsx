import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, CalendarDays, Settings } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Today', Icon: Home },
  { to: '/history', label: 'History', Icon: CalendarDays },
  { to: '/library', label: 'Library', Icon: LayoutGrid },
  { to: '/settings', label: 'Settings', Icon: Settings },
] as const

/** Bottom tab bar — shown only on the three tab roots (Today/Library/Settings). */
export function BottomNav() {
  return (
    <nav className="h-[84px] flex-none border-t border-white/[0.07] bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-md items-start px-7 pt-[10px]">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              [
                'flex flex-1 flex-col items-center gap-[5px]',
                isActive ? 'text-neon' : 'text-faint',
              ].join(' ')
            }
          >
            <Icon size={24} strokeWidth={1.75} />
            <span className="text-[10.5px] font-semibold">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
