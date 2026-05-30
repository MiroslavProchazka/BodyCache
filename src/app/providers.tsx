import { BrowserRouter } from 'react-router-dom'
import { EvoluProvider } from '@evolu/react'
import { evolu } from '@/evolu/evolu'
import { App } from './App'

export function Providers() {
  return (
    <EvoluProvider value={evolu}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </EvoluProvider>
  )
}
