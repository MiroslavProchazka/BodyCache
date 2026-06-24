/**
 * RPE (Rate of Perceived Exertion) presentation + clamping. RPE is an optional
 * per-set 1–10 value the logger surfaces as a tap chip; `null` means unset. It
 * is deliberately *not* a `SET_FIELDS` stepper column — it's a single felt
 * value, not a metric that ranks toward records. Pure and UI-free (mirrors
 * `setTypes.ts`); tested in `rpe.test.ts`.
 */

/** Lowest / highest selectable RPE. */
export const RPE_MIN = 1
export const RPE_MAX = 10

/** Selectable RPE values for the picker (integers 1–10), in display order. */
export const RPE_VALUES: readonly number[] = Array.from(
  { length: RPE_MAX - RPE_MIN + 1 },
  (_, i) => RPE_MIN + i,
)

/**
 * Clamp an arbitrary value to a valid integer RPE, or null. `null`/`undefined`
 * and non-finite numbers become null; finite numbers are rounded and clamped to
 * the [RPE_MIN, RPE_MAX] range so a stored out-of-range value still renders.
 */
export const clampRpe = (value: number | null | undefined): number | null => {
  if (value == null || !Number.isFinite(value)) return null
  return Math.min(RPE_MAX, Math.max(RPE_MIN, Math.round(value)))
}

/** Chip label for an RPE value: "RPE" when unset, "RPE 8" when set. */
export const formatRpe = (value: number | null | undefined): string =>
  value == null ? 'RPE' : `RPE ${value}`
