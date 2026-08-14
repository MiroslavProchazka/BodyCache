import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastOptions {
  action?: ToastAction
  durationMs?: number
}

interface ToastContextValue {
  /** Show a transient confirmation pill (e.g. "Set saved"). */
  readonly showToast: (message: string, options?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
type RenderedToast = { message: string; action?: ToastAction; durationMs: number } | null

/**
 * Centered confirmation toast above the tab bar. Auto-dismisses after ~1.9s,
 * matching the design. It only receives pointer events when an action is shown.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<RenderedToast>(null)
  // Re-key the node so re-showing the same message restarts the animation.
  const [seq, setSeq] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setToast(null)
  }, [])

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    if (timer.current) clearTimeout(timer.current)
    const durationMs = options.durationMs ?? 1900
    setToast({ message, action: options.action, durationMs })
    setSeq((s) => s + 1)
    timer.current = setTimeout(() => setToast(null), durationMs)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[104px] z-50 flex justify-center px-4">
          <div
            key={seq}
            className={[
              'flex max-w-[calc(100vw-32px)] items-center gap-2 rounded-full bg-white px-[18px] py-[11px] text-sm font-semibold text-ink shadow-toast',
              toast.action ? 'pointer-events-auto' : '',
            ].join(' ')}
            style={{ animation: `bc-toast ${toast.durationMs}ms ease both` }}
          >
            <Check size={17} className="text-[#36AB66]" />
            <span className="min-w-0 truncate">{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  const action = toast.action
                  dismiss()
                  action?.onClick()
                }}
                className="ml-1 flex-none text-[13px] font-bold text-[#494fdf]"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
