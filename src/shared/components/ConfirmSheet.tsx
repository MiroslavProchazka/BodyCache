import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ConfirmSheetProps {
  open: boolean
  title: string
  body?: ReactNode
  confirmLabel: string
  confirmVariant?: 'primary' | 'destructive'
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onClose: () => void
  secondaryLabel?: string
  onSecondary?: () => void | Promise<void>
}

const focusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * App-native confirmation sheet for destructive and high-consequence actions.
 * Controlled by the caller so the mutation stays beside the intent.
 */
export function ConfirmSheet({
  open,
  title,
  body,
  confirmLabel,
  confirmVariant = 'primary',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  secondaryLabel,
  onSecondary,
}: ConfirmSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) {
      setBusy(false)
      return
    }
    triggerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const id = requestAnimationFrame(() => cancelRef.current?.focus())
    return () => {
      cancelAnimationFrame(id)
      triggerRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  if (!open) return null

  const run = async (fn: () => void | Promise<void>) => {
    if (busy) return
    setBusy(true)
    await fn()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      if (!busy) onClose()
      return
    }
    if (event.key !== 'Tab') return
    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 px-3"
      onKeyDown={onKeyDown}
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close confirmation"
        className="absolute inset-0"
        onClick={() => {
          if (!busy) onClose()
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-sheet-title"
        className="relative mb-0 w-full max-w-md rounded-t-[28px] border border-white/[0.08] bg-surface px-5 pt-3 shadow-pill"
        style={{
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          animation: 'bc-confirm-sheet 180ms ease-out both',
        }}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />
        <h2
          id="confirm-sheet-title"
          className="font-display text-[21px] font-semibold leading-tight tracking-[-0.01em] text-white"
        >
          {title}
        </h2>
        {body && (
          <div className="mt-3 text-[14px] leading-relaxed text-muted">
            {typeof body === 'string' ? <p>{body}</p> : body}
          </div>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void run(onConfirm)}
            className={[
              'min-h-[52px] rounded-full px-5 text-[15px] font-bold text-white transition-transform active:scale-[0.99] disabled:opacity-60',
              confirmVariant === 'destructive'
                ? 'bg-[#fa757e]'
                : 'bg-gradient-to-br from-neon to-brand shadow-pill',
            ].join(' ')}
          >
            {confirmLabel}
          </button>
          {secondaryLabel && onSecondary && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void run(onSecondary)}
              className="min-h-[48px] rounded-full border border-white/10 bg-inset px-5 text-[14px] font-bold text-soft transition-transform active:scale-[0.99] disabled:opacity-60"
            >
              {secondaryLabel}
            </button>
          )}
          <button
            ref={cancelRef}
            type="button"
            disabled={busy}
            onClick={onClose}
            className="min-h-[48px] rounded-full px-5 text-[14px] font-bold text-muted transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
