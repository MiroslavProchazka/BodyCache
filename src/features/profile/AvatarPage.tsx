import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@evolu/react'
import { Check, ChevronLeft, Shuffle } from 'lucide-react'
import { userProfile } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import { type Gender, type ProfileId } from '@/evolu/schema'
import type { ProfileRow } from '@/evolu/rows'
import { CircleButton } from '@/shared/components/CircleButton'
import { Overline } from '@/shared/components/Overline'
import { ActionPill, FloatingAction } from '@/shared/components/FloatingAction'
import { useToast } from '@/shared/components/Toast'
import { randomSeed } from '@/shared/utils/avatar'
import { Avatar } from './Avatar'
import { narrowGender } from './profile'

/** How many candidate avatars to offer in the shuffle grid (4×2). */
const CANDIDATE_COUNT = 8

/** Style chips: "Any" maps to the non-gendered variant set. */
const STYLES: { value: Gender; label: string }[] = [
  { value: 'other', label: 'Any' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
]

/** Customize the seed-based Toon Head avatar (TWEAK T5). Reached from Profile. */
export function AvatarPage() {
  const navigate = useNavigate()
  const profile = useQuery(userProfile)[0]
  if (!profile) {
    navigate('/settings/profile', { replace: true })
    return null
  }
  return <AvatarInner profile={profile as ProfileRow} />
}

function AvatarInner({ profile }: { profile: ProfileRow }) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { updateProfile } = useBodyCacheMutations()

  const [seed, setSeed] = useState<string>(profile.avatarSeed ?? profile.id)
  const [gender, setGender] = useState<Gender>(narrowGender(profile.gender))
  const [candidates, setCandidates] = useState<string[]>(() =>
    Array.from({ length: CANDIDATE_COUNT }, () => randomSeed()),
  )

  // Shuffle regenerates both the live preview seed and the candidate grid.
  const shuffle = () => {
    setSeed(randomSeed())
    setCandidates(Array.from({ length: CANDIDATE_COUNT }, () => randomSeed()))
  }

  const save = () => {
    updateProfile(profile.id as ProfileId, { avatarSeed: seed, gender })
    showToast('Avatar saved')
    navigate('/settings/profile')
  }

  return (
    <>
      <div className="px-[22px] pb-[130px] pt-[14px]">
        <header className="mb-6 flex items-center gap-3">
          <CircleButton onClick={() => navigate('/settings/profile')} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <h1 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-white">
            Your avatar
          </h1>
        </header>

        <div className="mb-6 flex flex-col items-center">
          <Avatar seed={seed} gender={gender} size={112} />
          <button
            type="button"
            onClick={shuffle}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-[16px] py-[10px] text-[13.5px] font-semibold text-soft active:scale-[0.97]"
          >
            <Shuffle size={16} strokeWidth={1.9} />
            Shuffle
          </button>
        </div>

        <Overline className="mb-[10px]">Style</Overline>
        <div className="mb-6 flex gap-2">
          {STYLES.map((s) => {
            const active = gender === s.value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setGender(s.value)}
                aria-pressed={active}
                className={[
                  'flex-1 rounded-full border py-[10px] text-center text-[13.5px] font-semibold transition-colors',
                  active ? 'border-neon bg-neon text-white' : 'border-transparent bg-inset text-soft',
                ].join(' ')}
              >
                {s.label}
              </button>
            )
          })}
        </div>

        <Overline className="mb-3">Pick one</Overline>
        <div className="grid grid-cols-4 gap-3">
          {candidates.map((candidate) => {
            const selected = candidate === seed
            return (
              <button
                key={candidate}
                type="button"
                onClick={() => setSeed(candidate)}
                aria-label="Choose this avatar"
                aria-pressed={selected}
                className={[
                  'flex items-center justify-center rounded-[16px] p-1 transition-transform active:scale-[0.96]',
                  selected ? 'ring-2 ring-neon' : '',
                ].join(' ')}
              >
                <Avatar seed={candidate} gender={gender} size={64} />
              </button>
            )
          })}
        </div>
      </div>

      <FloatingAction>
        <ActionPill label="Save avatar" icon={<Check size={19} strokeWidth={2} />} onClick={save} />
      </FloatingAction>
    </>
  )
}
