import type { ReactNode } from 'react'

interface CircleButtonProps {
  onClick: () => void
  label: string
  children: ReactNode
}

/** 40px circular surface button used for back / header controls. */
export function CircleButton({ onClick, label, children }: CircleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/10 bg-surface text-white"
    >
      {children}
    </button>
  )
}
