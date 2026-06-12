import { avatarCells, avatarHue } from '@/shared/utils/avatar'

/**
 * A generated identicon avatar from a profile's `avatarSeed`. Renders inline
 * SVG (no image binary, no network) — a 5×5 mirrored cell grid on a hue-derived
 * gradient. Deterministic: the same seed always draws the same avatar.
 */
export function Avatar({
  seed,
  size = 44,
  className = '',
}: {
  seed: string
  size?: number
  className?: string
}) {
  const hue = avatarHue(seed)
  const cells = avatarCells(seed)
  const cell = 100 / 5
  const fg = `hsl(${hue} 70% 62%)`
  const bgFrom = `hsl(${hue} 45% 22%)`
  const bgTo = `hsl(${(hue + 40) % 360} 45% 14%)`
  const gradId = `av-${hue}`

  return (
    <svg
      role="img"
      aria-label="Profile avatar"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: size * 0.28, display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bgFrom} />
          <stop offset="1" stopColor={bgTo} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#${gradId})`} />
      {cells.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={(i % 5) * cell}
            y={Math.floor(i / 5) * cell}
            width={cell}
            height={cell}
            fill={fg}
          />
        ) : null,
      )}
    </svg>
  )
}
