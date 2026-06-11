interface ChipOption {
  readonly value: string
  readonly label: string
}

interface FilterChipsProps {
  options: readonly ChipOption[]
  /** Currently selected value (null = first/"All"). */
  value: string | null
  onChange: (value: string | null) => void
  /** Value that represents "no filter" (rendered as an always-on chip). */
  allValue?: string
  ariaLabel?: string
}

/**
 * Horizontal pill filter row (body parts, etc.). Active chip = neon bg /
 * deep-green text; inactive = surface bg / muted text / hairline border.
 * Hides its scrollbar and bleeds to the screen edges.
 */
export function FilterChips({
  options,
  value,
  onChange,
  allValue,
  ariaLabel,
}: FilterChipsProps) {
  return (
    <div
      className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5"
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const isAll = allValue != null && opt.value === allValue
        const active = isAll ? value == null : value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(isAll ? null : active ? null : opt.value)}
            className={[
              'shrink-0 rounded-full border px-[15px] py-[9px] text-[13.5px] font-semibold transition-colors',
              active
                ? 'border-neon bg-neon text-ink'
                : 'border-white/10 bg-surface text-muted',
            ].join(' ')}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
