import { useQuery } from '@evolu/react'
import { userProfile } from '@/evolu/queries'
import { OnboardingPage } from '@/features/profile/OnboardingPage'
import { App } from './App'

/**
 * Gates the whole app behind first-run onboarding. While there is no profile,
 * the onboarding screen replaces the app shell entirely; once a profile exists
 * (created locally or arriving via sync), the app renders. `userProfile` is a
 * reactive query, so creating the profile flips this automatically.
 */
export function RootGate() {
  const profile = useQuery(userProfile)[0]
  return profile ? <App /> : <OnboardingPage />
}
