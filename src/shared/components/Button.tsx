import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-[17px] text-base font-bold transition-transform active:scale-[0.99] disabled:pointer-events-none'

const variants: Record<Variant, string> = {
  // Neon CTA — the primary "do it" action (Save, Done, Start).
  primary: 'bg-neon text-ink disabled:bg-surface disabled:text-faint disabled:opacity-60',
  // Inset surface — quieter secondary action.
  secondary: 'bg-inset text-soft disabled:opacity-40',
  // Subtle neon-tinted outline — additive actions like "Add exercise".
  outline:
    'border-[1.5px] border-neon/35 bg-neon/10 text-neon font-semibold disabled:opacity-40',
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
