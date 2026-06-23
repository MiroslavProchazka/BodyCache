import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './app/providers'

if (typeof window !== 'undefined') {
  // After a new deploy, a tab with an older app shell can reference removed
  // lazy chunks. Reload once to fetch the fresh index + chunk map. Skip the
  // reload when offline: the chunk isn't coming back over the network, so
  // reloading would only loop into a blank screen instead of letting the
  // cached shell render.
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    if (navigator.onLine) window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
