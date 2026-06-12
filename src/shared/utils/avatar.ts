/**
 * Deterministic, seeded avatar generation.
 *
 * A profile stores only a short `avatarSeed` string (never an image binary, per
 * the photo rules). These pure helpers turn that seed into a stable identicon:
 * a 5×5 vertically-mirrored cell grid plus a hue. The same seed always yields
 * the same avatar, so it syncs as plain text and renders identically anywhere.
 */

/** Grid is 5 columns wide; the left 3 columns are mirrored onto the right 2. */
const GRID = 5
const HALF = Math.ceil(GRID / 2) // 3 unique columns per row

/** Deterministic 32-bit FNV-1a hash of a string. */
export const hashSeed = (seed: string): number => {
  let h = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    // 32-bit FNV prime multiply via shifts, kept unsigned.
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** A hue (0–359) derived from the seed, for the avatar's gradient. */
export const avatarHue = (seed: string): number => hashSeed(seed) % 360

/**
 * A 25-length boolean grid (row-major, 5×5), symmetric across the vertical
 * axis so it reads as a face/figure rather than noise. Each of the 15 unique
 * cells is on/off from one bit of the hash.
 */
export const avatarCells = (seed: string): boolean[] => {
  const h = hashSeed(seed)
  const cells: boolean[] = new Array(GRID * GRID).fill(false)
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < HALF; col++) {
      const bit = (h >>> (row * HALF + col)) & 1
      const on = bit === 1
      cells[row * GRID + col] = on
      cells[row * GRID + (GRID - 1 - col)] = on // mirror
    }
  }
  return cells
}

/**
 * A fresh random seed for a brand-new (or shuffled) avatar. Uses the crypto RNG
 * when available, falling back to `Math.random`. Always a non-empty base-36
 * string so it satisfies the schema's `NonEmptyString100`.
 */
export const randomSeed = (): string => {
  const g = globalThis as { crypto?: { getRandomValues?: (a: Uint32Array) => Uint32Array } }
  if (g.crypto?.getRandomValues) {
    const a = new Uint32Array(2)
    g.crypto.getRandomValues(a)
    return `${a[0].toString(36)}${a[1].toString(36)}`
  }
  return `${Math.floor(Math.random() * 0xffffffff).toString(36)}${Date.now().toString(36)}`
}
