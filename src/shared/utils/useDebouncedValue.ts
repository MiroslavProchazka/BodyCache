import { useEffect, useState } from 'react'

/**
 * Debounce a fast-changing value (e.g. a search box) so expensive work keyed
 * off it — filtering 1,000+ exercises on every keystroke — runs only once the
 * value settles. Returns the latest value after `delay` ms of quiet.
 */
export const useDebouncedValue = <T,>(value: T, delay = 150): T => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
