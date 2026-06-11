import { BrowserRouter } from 'react-router-dom'
import { EvoluProvider } from '@evolu/react'
import { evolu } from '@/evolu/evolu'
import { UnitsProvider } from '@/shared/units/UnitsContext'
import { ToastProvider } from '@/shared/components/Toast'
import { App } from './App'

export function Providers() {
  return (
    <EvoluProvider value={evolu}>
      <UnitsProvider>
        <ToastProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ToastProvider>
      </UnitsProvider>
    </EvoluProvider>
  )
}
