import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-[17px] text-base font-bold transition-transform active:scale-[0.99] disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  // Cobalt gradient pill — the primary "do it" action (Save, Done, Start).
  primary:
    'bg-gradient-to-br from-neon to-brand text-white shadow-pill disabled:bg-none disabled:bg-surface disabled:text-faint disabled:opacity-60 disabled:shadow-none',
  // Surface ghost pill — quieter secondary action.
  secondary: 'border border-white/10 bg-surface text-soft disabled:opacity-40',
  // Subtle neon-tinted outline — additive actions like "Add exercise".
  outline:
    'border-[1.5px] border-neon/35 bg-neon/10 text-[#8b90f7] font-semibold disabled:opacity-40',
}

/** Mobile-first button with a large tap target. */
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
