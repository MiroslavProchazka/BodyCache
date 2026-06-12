import { BrowserRouter } from 'react-router-dom'
import { EvoluContext } from '@evolu/react'
import { evolu } from '@/evolu/evolu'
import { UnitsProvider } from '@/shared/units/UnitsContext'
import { ToastProvider } from '@/shared/components/Toast'
import { App } from './App'

// NOTE: We provide the Evolu context via `EvoluContext.Provider` rather than
// `@evolu/react`'s `EvoluProvider`. That helper uses React 19's
// `<Context value>` provider syntax (`_jsx(EvoluContext, { value, children })`),
// but this project is pinned to React 18, where a context object renders as a
// *Consumer* and calls `children` as a render-prop function. With our element
// tree as children that throws "children is not a function", crashing the app
// on mount (only visible in the production build). Using `.Provider` is the
// React 18-correct way and is read identically by Evolu's `useContext` hooks.
export function Providers() {
  return (
    <EvoluContext.Provider value={evolu}>
      <UnitsProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </UnitsProvider>
    </EvoluContext.Provider>
  )
}
