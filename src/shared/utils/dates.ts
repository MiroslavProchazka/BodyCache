/** Date helpers. Dates are stored as ISO strings via Evolu's `DateIso`. */

/** Local YYYY-MM-DD key for a date, used to group workouts by day. */
export const dayKey = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** True when two dates fall on the same local calendar day. */
export const isSameDay = (a: Date | string, b: Date | string): boolean =>
  dayKey(a) === dayKey(b)

/** "Mon 10 Jun" style short date for headers. */
export const formatShortDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

/** Local YYYY-MM key for a date, used to group workouts by month. */
export const monthKey = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Month header label: "June" within the current year, "June 2025" otherwise.
 * `now` is injectable for testing.
 */
export const formatMonth = (date: Date | string, now: Date = new Date()): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const opts: Intl.DateTimeFormatOptions =
    d.getFullYear() === now.getFullYear()
      ? { month: 'long' }
      : { month: 'long', year: 'numeric' }
  return d.toLocaleDateString(undefined, opts)
}

/** Compact relative label: "Today", "Yesterday", or a short date. */
export const formatRelativeDay = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)
  if (isSameDay(d, today)) return 'Today'
  if (isSameDay(d, yesterday)) return 'Yesterday'
  return formatShortDate(d)
}
