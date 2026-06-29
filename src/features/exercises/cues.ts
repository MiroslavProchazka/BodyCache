/**
 * Per-exercise form cues for the exercise-detail "How to" tab. These are short,
 * general movement reminders — BodyCache is a memory aid, not a coach, so the
 * UI pairs them with a disclaimer and keeps the list to a few plain steps.
 *
 * Resolution order, most-specific first:
 *   1. The exercise's own `notes`. Starter-library adds store the dataset's
 *      detailed, exercise-specific instructions here (see `StarterLibraryPage`),
 *      so for seeded exercises this is the richest, truest "how to" we have.
 *      Split into one step per sentence.
 *   2. A hand-curated cue list keyed by the *normalized exercise name* (see
 *      `normalizeExerciseName`) — kept from the design prototype for a few
 *      common lifts.
 *   3. A generic 5-step fallback for anything else.
 *
 * Pure data + lookup — kept UI-free so it can be tested.
 */
import { normalizeExerciseName } from './starterCatalog'

/** Cues for seeded exercises, keyed by normalized name. */
const CUES: Record<string, readonly string[]> = {
  [normalizeExerciseName('Barbell Bench Press')]: [
    'Lie flat, feet planted, slight arch in your lower back.',
    'Grip just wider than shoulder-width, wrists stacked over elbows.',
    'Unrack and lower the bar to mid-chest under control.',
    'Drive up and slightly back toward your face. Breathe out at the top.',
    'Keep your shoulder blades pinned back the whole set.',
  ],
  [normalizeExerciseName('Lat Pulldown')]: [
    'Set the knee pad snug against your thighs.',
    'Grab the bar slightly wider than shoulder-width, palms forward.',
    'Pull your shoulders back and down before you start.',
    'Drive the bar to your collarbone through your elbows.',
    'Control the bar back up until your arms are fully extended.',
  ],
  [normalizeExerciseName('Leg Press')]: [
    'Sit back with your spine and hips flat against the pad.',
    'Place feet shoulder-width, mid-platform.',
    'Lower until your knees reach about 90°.',
    'Press through your heels — don’t lock the knees out hard.',
    'Keep your lower back glued to the seat throughout.',
  ],
  [normalizeExerciseName('Dumbbell Shoulder Press')]: [
    'Sit tall, dumbbells at shoulder height, palms forward.',
    'Brace your core and keep ribs down.',
    'Press overhead until your arms are nearly straight.',
    'Lower under control back to your shoulders.',
    'Avoid arching your back to push the weight.',
  ],
  [normalizeExerciseName('Seated Cable Row')]: [
    'Sit with a slight knee bend and a tall chest.',
    'Grab the handle, arms extended, shoulders relaxed.',
    'Pull to your stomach, driving your elbows back.',
    'Squeeze your shoulder blades together at the end.',
    'Return slowly until you feel a stretch.',
  ],
  [normalizeExerciseName('Incline Dumbbell Press')]: [
    'Set the bench to about 30°.',
    'Start with dumbbells at upper-chest height.',
    'Press up and slightly together over your chest.',
    'Lower under control to a deep stretch.',
    'Keep your wrists stacked over your elbows.',
  ],
  [normalizeExerciseName('Leg Extension')]: [
    'Adjust the pad to sit on your lower shins.',
    'Sit back fully against the seat.',
    'Extend until your legs are straight, squeeze the quad.',
    'Lower under control — don’t let the stack slam.',
    'Keep your hips down on the seat.',
  ],
  [normalizeExerciseName('Dumbbell Curl')]: [
    'Stand tall, dumbbells at your sides, palms forward.',
    'Keep your elbows pinned to your ribs.',
    'Curl up by contracting your biceps — no swinging.',
    'Squeeze at the top, then lower slowly.',
    'Control the negative for the full count.',
  ],
}

/** Generic fallback cues for user-created exercises (or any unmatched name). */
export const GENERIC_CUES: readonly string[] = [
  'Set up with a stable, neutral spine.',
  'Choose a weight you can move for clean reps.',
  'Move through the full range under control.',
  'Exhale on the effort; keep tension on the target muscle.',
  'Reset your position between reps if needed.',
]

/**
 * Split a free-text instruction blob (the imported dataset cues, stored as an
 * exercise's `notes`) into sentence-sized steps for the numbered "How to" list.
 * Returns `[]` for empty/whitespace-only input.
 */
export function stepsFromNotes(notes: string): string[] {
  return notes
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Form cues for an exercise: its own `notes` split into steps, else a curated
 * list matched by name, else the generic fallback.
 */
export function cuesFor(ex: {
  name?: string | null
  notes?: string | null
}): readonly string[] {
  const notes = ex.notes?.trim()
  if (notes) {
    const steps = stepsFromNotes(notes)
    if (steps.length > 0) return steps
  }
  const key = normalizeExerciseName(ex.name ?? '')
  return CUES[key] ?? GENERIC_CUES
}
