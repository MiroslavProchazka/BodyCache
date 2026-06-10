import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/** Card surface used across library, workout and detail screens. */
export function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-gray-800 bg-gray-900',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
