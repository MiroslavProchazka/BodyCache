import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Providers } from './app/providers'

if (typeof window !== 'undefined') {
  // After a new deploy, a tab with an older app shell can reference removed
  // lazy chunks. Reload once to fetch the fresh index + chunk map.
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    window.location.reload()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
