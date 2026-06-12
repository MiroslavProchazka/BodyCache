import { useState, type ReactNode } from 'react'
import { Minus, Plus, Shuffle } from 'lucide-react'
import { GENDERS, type Gender } from '@/evolu/schema'
import { Overline } from '@/shared/components/Overline'
import { useUnits } from '@/shared/units/UnitsContext'
import { toDisplayWeight } from '@/shared/utils/units'
import { randomSeed } from '@/shared/utils/avatar'
import { genderLabel } from './profile'
import { Avatar } from './Avatar'

export interface ProfileFormValues {
  name: string
  gender: Gender
  weightKg: number
  heightCm: number
  age: number
  avatarSeed: string
}

interface ProfileFormProps {
  initial?: Partial<ProfileFormValues>
  submitLabel: string
  onSubmit: (values: ProfileFormValues) => void
}

/**
 * The profile editor, shared by first-run onboarding and the Settings editor.
 * Weight steps in kg (shown in the active unit, mirroring the set logger);
 * height and age are plain integer steppers. The avatar is generated from a
 * seed the user can shuffle.
 */
export function ProfileForm({ initial, submitLabel, onSubmit }: ProfileFormProps) {
  const { unit } = useUnits()
  const [name, setName] = useState(initial?.name ?? '')
  const [gender, setGender] = useState<Gender | ''>(initial?.gender ?? '')
  const [weightKg, setWeightKg] = useState(initial?.weightKg ?? 70)
  const [heightCm, setHeightCm] = useState(initial?.heightCm ?? 175)
  const [age, setAge] = useState(initial?.age ?? 30)
  const [avatarSeed, setAvatarSeed] = useState(initial?.avatarSeed ?? randomSeed())

  const canSave = name.trim().length > 0 && gender !== ''

  const submit = () => {
    if (!canSave) return
    onSubmit({ name: name.trim(), gender: gender as Gender, weightKg, heightCm, age, avatarSeed })
  }

  return (
    <div className="flex flex-col">
      {/* Avatar + shuffle */}
      <div className="mb-6 flex flex-col items-center">
        <Avatar seed={avatarSeed} size={92} />
        <button
          type="button"
          onClick={() => setAvatarSeed(randomSeed())}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-[14px] py-2 text-[13px] font-semibold text-soft active:scale-[0.97]"
        >
          <Shuffle size={15} strokeWidth={1.9} />
          Shuffle avatar
        </button>
      </div>

      <Overline className="mb-2">Name</Overline>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="What should we call you?"
        autoComplete="name"
        className="mb-[18px] w-full rounded-2xl border border-white/10 bg-surface p-[14px] text-[15px] text-white placeholder:text-faint focus:outline-none"
      />

      <Overline className="mb-2">Gender</Overline>
      <div className="mb-[18px] flex gap-2">
        {GENDERS.map((g) => {
          const active = gender === g
          return (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              aria-pressed={active}
              className={[
                'flex-1 rounded-full border py-[10px] text-center text-[13.5px] font-semibold transition-colors',
                active
                  ? 'border-neon bg-neon text-ink'
                  : 'border-white/10 bg-surface text-muted',
              ].join(' ')}
            >
              {genderLabel(g)}
            </button>
          )
        })}
      </div>

      <Stepper
        label={`Weight (${unit})`}
        display={toDisplayWeight(weightKg, unit)}
        onStep={(dir) => setWeightKg((w) => Math.max(0, Math.round((w + dir) * 10) / 10))}
      />
      <Stepper
        label="Height (cm)"
        display={heightCm}
        onStep={(dir) => setHeightCm((h) => Math.max(0, h + dir))}
      />
      <Stepper
        label="Age"
        display={age}
        onStep={(dir) => setAge((a) => Math.max(0, a + dir))}
      />

      <button
        type="button"
        onClick={submit}
        disabled={!canSave}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-neon py-[17px] text-base font-bold text-ink transition-transform active:scale-[0.99] disabled:bg-surface disabled:text-faint disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </div>
  )
}

/** One labelled −/+ stepper row used for weight, height and age. */
function Stepper({
  label,
  display,
  onStep,
}: {
  label: string
  display: ReactNode
  onStep: (dir: 1 | -1) => void
}) {
  return (
    <div className="mb-[14px] flex items-center justify-between rounded-2xl border border-white/[0.07] bg-surface px-[15px] py-[13px]">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-faint">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <StepButton onClick={() => onStep(-1)} label={`Decrease ${label}`}>
          <Minus size={18} strokeWidth={2} />
        </StepButton>
        <span className="min-w-[44px] text-center font-display text-[24px] font-semibold tnum text-white">
          {display}
        </span>
        <StepButton onClick={() => onStep(1)} label={`Increase ${label}`}>
          <Plus size={18} strokeWidth={2} />
        </StepButton>
      </div>
    </div>
  )
}

function StepButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/10 bg-inset text-neon transition-transform active:scale-[0.94]"
    >
      {children}
    </button>
  )
}
