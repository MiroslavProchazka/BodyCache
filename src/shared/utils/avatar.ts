/**
 * Avatar seed generation.
 *
 * A profile stores only a short `avatarSeed` string. The profile UI turns that
 * seed into a deterministic DiceBear avatar at render time, so sync never needs
 * to store image binaries.
 */

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
