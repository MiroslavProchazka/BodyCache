import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-500 text-white hover:bg-indigo-400',
  secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700',
  ghost: 'bg-transparent text-gray-300 hover:bg-gray-800',
  danger: 'bg-red-600 text-white hover:bg-red-500',
}

/** Mobile-first button with large tap target. */
export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[base, variants[variant], fullWidth ? 'w-full' : '', className].join(' ')}
      {...rest}
    >
      {children}
    </button>
  )
}
