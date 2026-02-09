import { type ReactNode, useEffect } from 'react'
import { EvoluProvider } from '@evolu/react'
import { evolu } from '../db/evolu'
import { seedExercisesOnFirstRun } from '../db/mutations'

type AppProvidersProps = {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  useEffect(() => {
    void seedExercisesOnFirstRun().catch(() => {
      // Keep the shell usable even when seed bootstrap is unavailable
    })
  }, [])

  return <EvoluProvider value={evolu}>{children}</EvoluProvider>
}
