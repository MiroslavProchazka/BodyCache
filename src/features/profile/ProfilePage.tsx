import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { ChevronLeft } from 'lucide-react'
import { userProfile } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import type { ProfileId } from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { useToast } from '@/shared/components/Toast'
import { narrowGender } from './profile'
import { ProfileForm, type ProfileFormValues } from './ProfileForm'

/** Edit the existing profile (reached from Settings). */
export function ProfilePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { updateProfile } = useBodyCacheMutations()
  const profile = useQuery(userProfile)[0]

  if (!profile) {
    // The root gate guarantees a profile before the app renders; this is only a
    // defensive fallback.
    navigate('/settings', { replace: true })
    return null
  }

  const handleSubmit = (values: ProfileFormValues) => {
    updateProfile(profile.id as ProfileId, values)
    showToast('Profile updated')
    navigate('/settings')
  }

  return (
    <div className="px-5 pb-[60px] pt-[6px]">
      <header className="mb-5 flex items-center gap-3">
        <CircleButton onClick={() => navigate('/settings')} label="Back">
          <ChevronLeft size={18} strokeWidth={1.75} />
        </CircleButton>
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-white">
          Edit profile
        </h1>
      </header>
      <ProfileForm
        submitLabel="Save profile"
        onSubmit={handleSubmit}
        initial={{
          name: profile.name ?? '',
          gender: narrowGender(profile.gender),
          weightKg: profile.weightKg ?? undefined,
          heightCm: profile.heightCm ?? undefined,
          age: profile.age ?? undefined,
          avatarSeed: profile.avatarSeed ?? undefined,
        }}
      />
    </div>
  )
}
