import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Check } from 'lucide-react'

interface ToastContextValue {
  /** Show a transient confirmation pill (e.g. "Set saved"). */
  readonly showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/**
 * Centered confirmation toast above the tab bar. Auto-dismisses after ~1.9s,
 * matching the design. Pointer-events are off so it never blocks taps.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  // Re-key the node so re-showing the same message restarts the animation.
  const [seq, setSeq] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const showToast = useCallback((next: string) => {
    if (timer.current) clearTimeout(timer.current)
    setMessage(next)
    setSeq((s) => s + 1)
    timer.current = setTimeout(() => setMessage(null), 1900)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[104px] z-50 flex justify-center px-4">
          <div
            key={seq}
            className="flex items-center gap-2 rounded-full bg-white px-[18px] py-[11px] text-sm font-semibold text-ink shadow-toast"
            style={{ animation: 'bc-toast 1.9s ease both' }}
          >
            <Check size={17} className="text-[#36AB66]" />
            {message}
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
