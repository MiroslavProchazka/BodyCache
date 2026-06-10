import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, X, ArrowLeft } from 'lucide-react'
import { useBodyCacheMutations } from '@/evolu/mutations'
import {
  EXERCISE_TYPES,
  BODY_PARTS,
  EQUIPMENT,
  type BodyPart,
  type Equipment,
  type ExerciseType,
} from '@/evolu/schema'
import { Button } from '@/shared/components/Button'
import { storePhoto } from '@/shared/utils/photos'

/**
 * Create a reusable exercise. Photo-first: the capture/upload control leads.
 * Name + type are required; everything else is optional. On success the photo
 * binary goes to IndexedDB and only its metadata is linked in Evolu.
 *
 * When opened with `?session=<id>` the new exercise is also appended to that
 * active workout (per spec §7.4) — wired in Milestone 4 via the session param.
 */
export function CreateExercisePage() {
  const navigate = useNavigate()
  const { createExercise, addExercisePhoto, setPrimaryPhoto } = useBodyCacheMutations()
  const fileRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState('')
  const [type, setType] = useState<ExerciseType>('strength')
  const [bodyPart, setBodyPart] = useState<BodyPart | ''>('')
  const [equipment, setEquipment] = useState<Equipment | ''>('')
  const [notes, setNotes] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const canSave = name.trim().length > 0 && !saving

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
        type,
        bodyPart: bodyPart || null,
        equipment: equipment || null,
        notes: notes.trim() || null,
      })
      if (!result.ok) {
        setSaving(false)
        return
      }
      const exerciseId = result.value.id

      if (photoFile) {
        const stored = await storePhoto(photoFile)
        const photoResult = addExercisePhoto(exerciseId, {
          localUri: stored.ref,
          thumbnailUri: stored.thumbnailRef,
        })
        if (photoResult.ok) setPrimaryPhoto(exerciseId, photoResult.value.id)
      }

      // Navigation unmounts this page, so we intentionally do NOT reset
      // `saving` afterwards (that would setState on an unmounted component).
      navigate(`/library/${exerciseId}`, { replace: true })
    } catch {
      // Storing the photo failed; let the user retry rather than hang.
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-5">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-200">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-gray-100">New exercise</h1>
      </header>

      {/* Photo capture / upload */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
        />
        {previewUrl ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            <button
              onClick={() => onPickPhoto(null)}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
              aria-label="Remove photo"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-700 bg-gray-900 text-gray-400 active:bg-gray-800"
          >
            <Camera size={32} strokeWidth={1.5} />
            <span className="text-sm">Add a photo of the machine</span>
          </button>
        )}
      </div>

      <Field label="Name" required>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chest Press"
          className={inputClass}
          autoFocus
        />
      </Field>

      <Field label="Type" required>
        <ChipSelect
          options={EXERCISE_TYPES}
          value={type}
          onChange={(v) => setType(v as ExerciseType)}
        />
      </Field>

      <Field label="Body part">
        <ChipSelect
          options={BODY_PARTS}
          value={bodyPart}
          onChange={(v) => setBodyPart(v === bodyPart ? '' : (v as BodyPart))}
          clearable
        />
      </Field>

      <Field label="Equipment">
        <ChipSelect
          options={EQUIPMENT}
          value={equipment}
          onChange={(v) => setEquipment(v === equipment ? '' : (v as Equipment))}
          clearable
        />
      </Field>

      <Field label="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Seat height, grip, settings…"
          className={inputClass}
        />
      </Field>

      <Button fullWidth disabled={!canSave} onClick={handleSubmit}>
        {saving ? 'Saving…' : 'Save exercise'}
      </Button>
    </div>
  )
}

const inputClass =
  'w-full rounded-xl border border-gray-800 bg-gray-900 px-3 py-3 text-base text-gray-100 placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none'

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-indigo-400"> *</span>}
      </span>
      {children}
    </label>
  )
}

function ChipSelect({
  options,
  value,
  onChange,
  clearable = false,
}: {
  options: readonly string[]
  value: string
  onChange: (v: string) => void
  clearable?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(clearable && active ? '' : opt)}
            className={[
              'rounded-full px-3 py-1.5 text-sm capitalize transition-colors',
              active ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700',
            ].join(' ')}
          >
            {opt.replace('_', ' ')}
          </button>
        )
      })}
    </div>
  )
}
