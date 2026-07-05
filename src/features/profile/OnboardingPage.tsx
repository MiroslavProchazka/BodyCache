import { useBodyCacheMutations } from '@/evolu/mutations'
import { ProfileForm, type ProfileFormValues } from './ProfileForm'

/**
 * First-run onboarding. Shown by the root gate whenever no profile exists yet,
 * in place of the whole app shell. Saving creates the profile; the reactive
 * `userProfile` query then updates and the gate swaps in the app — no manual
 * navigation needed.
 */
export function OnboardingPage() {
  const { createProfile } = useBodyCacheMutations()

  const handleSubmit = (values: ProfileFormValues) => {
    createProfile(values)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-white">
      <div className="mx-auto w-full max-w-md px-[22px] pb-10 pt-12">
        <h1 className="font-display text-[32px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white">
          Welcome to BodyCache
        </h1>
        <p className="mb-8 mt-3 text-[14px] leading-relaxed text-muted">
          Your workout memory. Set up your profile to get started — you can change
          any of this later in Settings.
        </p>
        <ProfileForm submitLabel="Start lifting" onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
