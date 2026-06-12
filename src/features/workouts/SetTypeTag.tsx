import {
  narrowSetType,
  SET_TYPE_CLASS,
  SET_TYPE_LABEL,
  SET_TYPE_SHORT,
} from './setTypes'

/**
 * A small colored chip naming a set's type. Renders nothing for a normal
 * (null) set. `full` shows the label ("Warm-up"); otherwise a single letter
 * ("W") for compact set chips.
 */
export function SetTypeTag({
  value,
  full = false,
}: {
  value: string | null | undefined
  full?: boolean
}) {
  const t = narrowSetType(value)
  if (!t) return null
  return (
    <span
      className={[
        'inline-flex items-center whitespace-nowrap rounded-md px-[7px] py-[2px] text-[10.5px] font-bold uppercase tracking-[0.04em]',
        SET_TYPE_CLASS[t],
      ].join(' ')}
    >
      {full ? SET_TYPE_LABEL[t] : SET_TYPE_SHORT[t]}
    </span>
  )
}
