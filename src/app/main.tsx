import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { AppProviders } from './providers'
import { router } from './routes'
import '../styles/globals.css'

registerSW({
  onNeedRefresh() {
    window.dispatchEvent(new CustomEvent('bodycache:update-available'))
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </React.StrictMode>
)
