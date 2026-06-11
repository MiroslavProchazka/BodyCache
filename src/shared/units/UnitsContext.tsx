import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Unit } from '@/shared/utils/units'

interface UnitsContextValue {
  readonly unit: Unit
  readonly setUnit: (unit: Unit) => void
}

const STORAGE_KEY = 'bodycache:unit'

const readStored = (): Unit => {
  if (typeof localStorage === 'undefined') return 'kg'
  return localStorage.getItem(STORAGE_KEY) === 'lb' ? 'lb' : 'kg'
}

const UnitsContext = createContext<UnitsContextValue | null>(null)

/** Provides the display-unit preference (kg/lb), persisted to localStorage. */
export function UnitsProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<Unit>(readStored)

  const setUnit = useCallback((next: Unit) => {
    setUnitState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode / storage disabled — preference is in-memory only.
    }
  }, [])

  const value = useMemo(() => ({ unit, setUnit }), [unit, setUnit])
  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>
}

/** Read the active display unit and its setter. */
export const useUnits = (): UnitsContextValue => {
  const ctx = useContext(UnitsContext)
  if (!ctx) throw new Error('useUnits must be used within a UnitsProvider')
  return ctx
}
