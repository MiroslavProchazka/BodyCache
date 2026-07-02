import { useEffect, useState, type RefObject } from 'react'

/**
 * Distance from the top of `scrollParent`'s scrollable content to the top of
 * the virtualized `list`. The library/starter lists sit *below* a header,
 * search box and chips inside the same scrolling column, so the virtualizer
 * needs this offset (`scrollMargin`) to place items at the right scroll
 * position. Recomputed when the scroll parent resolves or `ready` flips
 * (e.g. the list appears once results are non-empty). When content above the
 * list can change height after mount (e.g. the library's Favourites section
 * growing or shrinking with the active filter), pass a `revision` value that
 * changes with it to trigger a re-measure.
 */
export const useListScrollMargin = (
  list: RefObject<HTMLElement | null>,
  scrollParent: HTMLElement | null,
  ready: boolean,
  revision: unknown = null,
): number => {
  const [margin, setMargin] = useState(0)

  useEffect(() => {
    if (!ready || !scrollParent || !list.current) return
    const top =
      list.current.getBoundingClientRect().top -
      scrollParent.getBoundingClientRect().top +
      scrollParent.scrollTop
    setMargin(top)
  }, [list, scrollParent, ready, revision])

  return margin
}
