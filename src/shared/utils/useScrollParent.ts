import { useCallback, useEffect, useState, type RefObject } from 'react'

/** True when an element scrolls vertically (overflow auto/scroll/overlay). */
const scrolls = (el: Element): boolean => {
  const oy = getComputedStyle(el).overflowY
  return oy === 'auto' || oy === 'scroll' || oy === 'overlay'
}

/**
 * Resolve the nearest scrollable ancestor of `ref`, so a virtualizer can watch
 * the element the page actually scrolls in. In BodyCache that's the `<main>`
 * column in `AppShell` (`overflow-y-auto`), not the window — so a window
 * virtualizer would never fire. Re-resolves once after mount (the ref is null
 * on the first render) and keeps the result in state so the virtualizer picks
 * it up.
 */
export const useScrollParent = (ref: RefObject<HTMLElement | null>): HTMLElement | null => {
  const [parent, setParent] = useState<HTMLElement | null>(null)

  const resolve = useCallback((): HTMLElement | null => {
    let el = ref.current?.parentElement ?? null
    while (el) {
      if (scrolls(el)) return el
      el = el.parentElement
    }
    return null
  }, [ref])

  useEffect(() => {
    setParent(resolve())
  }, [resolve])

  return parent
}
