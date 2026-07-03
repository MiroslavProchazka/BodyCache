/**
 * Hairline that separates flat sections on the true-black canvas — the 1b
 * redesign's replacement for boxed card edges (SPEC §5.2). Spans the full width
 * of the padded content column.
 */
export function Divider({ className = '' }: { className?: string }) {
  return <div className={['h-px bg-divider', className].join(' ')} />
}
