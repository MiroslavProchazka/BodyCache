import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  Icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

/** Centered guidance shown when a list/screen has no data yet. */
export function EmptyState({ Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {Icon && (
        <div className="rounded-2xl bg-gray-800/60 p-4 text-gray-400">
          <Icon size={32} strokeWidth={1.75} />
        </div>
      )}
      <h2 className="text-lg font-semibold text-gray-100">{title}</h2>
      {description && <p className="max-w-xs text-sm text-gray-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
