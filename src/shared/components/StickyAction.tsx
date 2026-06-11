import type { ReactNode } from 'react'

/**
 * Bottom-pinned action area (Save / Finish). A gradient fade lets content
 * scroll under it. Centered to the app's max width.
 */
export function StickyAction({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20">
      <div className="action-fade mx-auto max-w-md px-5 pb-[22px] pt-[14px]">{children}</div>
    </div>
  )
}
