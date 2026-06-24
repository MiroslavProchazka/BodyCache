import { useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Camera, ChevronLeft, X } from 'lucide-react'
import { evolu } from '@/evolu/evolu'
import { planExercises } from '@/evolu/queries'
import { useBodyCacheMutations } from '@/evolu/mutations'
import {
  BODY_PARTS,
  EQUIPMENT,
  type BodyPart,
  type Equipment,
  type PlanId,
  type WorkoutSessionId,
} from '@/evolu/schema'
import { CircleButton } from '@/shared/components/CircleButton'
import { Overline } from '@/shared/components/Overline'
import { StickyAction } from '@/shared/components/StickyAction'
import { humanize } from '@/shared/utils/bodyParts'
import { storePhoto } from '@/shared/utils/photos'

/**
 * Create a reusable exercise. Photo-first: the capture/upload control leads, so
 * you recognise the machine next time. Created exercises default to the
 * strength (weight × reps) type — the common gym-machine case.
 */
export function CreateExercisePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session') as WorkoutSessionId | null
  // When launched from a plan's exercise picker, the new exercise is appended
  // to that plan and we return to its editor.
  const planId = searchParams.get('plan') as PlanId | null
  const { createExercise, addExercisePhoto, setPrimaryPhoto, addExerciseToPlan } =
    useBodyCacheMutations()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [bodyPart, setBodyPart] = useState<BodyPart | ''>('')
  const [equipment, setEquipment] = useState<Equipment | ''>('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const canSave = name.trim().length > 0 && !saving
  const goBack = () =>
    navigate(
      planId ? `/plans/${planId}/add-exercise` : sessionId ? '/workout/add-exercise' : '/library',
    )

  const onPickPhoto = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPhotoFile(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      const result = createExercise({
        name: name.trim(),
        type: 'strength',
        bodyPart: bodyPart || null,
        equipment: equipment || null,
      })
      if (!result.ok) {
        setSaving(false)
        return
      }
      const exerciseId = result.value.id

      if (photoFile) {
        const stored = await storePhoto(photoFile)
        const photo = addExercisePhoto(exerciseId, {
          localUri: stored.ref,
          thumbnailUri: stored.thumbnailRef,
        })
        if (photo.ok) setPrimaryPhoto(exerciseId, photo.value.id)
      }

      // From a plan: append to the plan and return to its editor. From the
      // workout picker: jump straight into logging. Otherwise land on the
      // exercise's detail page. Navigation unmounts this page, so we don't
      // reset `saving` on the happy path.
      if (planId) {
        const existing = await evolu.loadQuery(planExercises(planId))
        addExerciseToPlan(planId, exerciseId, existing.length)
        navigate(`/plans/${planId}/edit`, { replace: true })
        return
      }
      navigate(sessionId ? `/workout/log/${exerciseId}` : `/library/${exerciseId}`, {
        replace: true,
      })
    } catch {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="px-5 pb-[150px] pt-[6px]">
        <header className="mb-[18px] flex items-center gap-3">
          <CircleButton onClick={goBack} label="Back">
            <ChevronLeft size={18} strokeWidth={1.75} />
          </CircleButton>
          <h1 className="font-display text-[22px] font-semibold tracking-tight text-white">
            New exercise
          </h1>
        </header>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
        />
        {previewUrl ? (
          <div
            className="relative mb-[18px] h-[150px] w-full overflow-hidden"
            style={{ borderRadius: '20px' }}
          >
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onPickPhoto(null)}
              aria-label="Remove photo"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mb-[18px] flex h-[150px] w-full flex-col items-center justify-center gap-[10px] border-[1.5px] border-dashed border-white/[0.18] bg-surface"
            style={{ borderRadius: '20px' }}
          >
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-inset text-neon">
              <Camera size={26} strokeWidth={1.75} />
            </div>
            <div className="text-[14.5px] font-semibold text-soft">
              Add a photo of the machine
            </div>
            <div className="text-xs text-faint">Helps you recognise it next time</div>
          </button>
        )}

        <Overline className="mb-2">Name</Overline>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chest Press Machine"
          autoFocus
          className="mb-[18px] w-full rounded-2xl border border-white/10 bg-surface p-[14px] text-[15px] text-white placeholder:text-faint focus:outline-none"
        />

        <Overline className="mb-[10px]">Body part</Overline>
        <SelectChips
          options={BODY_PARTS}
          value={bodyPart}
          onChange={(v) => setBodyPart((v === bodyPart ? '' : v) as BodyPart | '')}
        />

        <div className="h-[18px]" />

        <Overline className="mb-[10px]">Equipment</Overline>
        <SelectChips
          options={EQUIPMENT}
          value={equipment}
          onChange={(v) => setEquipment((v === equipment ? '' : v) as Equipment | '')}
        />
      </div>

      <StickyAction>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSave}
          className="w-full rounded-2xl bg-white py-[17px] text-base font-bold text-ink transition-transform active:scale-[0.99] disabled:bg-surface disabled:text-faint disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save exercise'}
        </button>
      </StickyAction>
    </>
  )
}

/** Single-select pill group (deselect by tapping the active chip). */
function SelectChips({
  options,
  value,
  onChange,
}: {
  options: readonly string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              'rounded-full border px-[15px] py-[9px] text-[13.5px] font-semibold transition-colors',
              active ? 'border-neon bg-neon text-ink' : 'border-white/10 bg-surface text-muted',
            ].join(' ')}
          >
            {humanize(opt)}
          </button>
        )
      })}
    </div>
  )
}
