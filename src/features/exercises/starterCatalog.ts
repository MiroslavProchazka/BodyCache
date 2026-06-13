import type { BodyPart, Equipment, ExerciseType } from '@/evolu/schema'

/**
 * A single entry in the built-in starter library. Mirrors the `exercise`
 * schema's user-facing fields (name + the three "what is this" facets) so an
 * entry can be inserted verbatim via `createExercise`. Photos are intentionally
 * omitted — the photo-first card still renders a muscle map, and the user snaps
 * the real machine photo the first time they log it.
 */
export interface StarterExercise {
  readonly name: string
  readonly type: ExerciseType
  readonly bodyPart: BodyPart
  readonly equipment: Equipment
}

/**
 * A curated set of common gym exercises grouped by body part. This is a
 * *starting point*, not a prescription — BodyCache is a memory aid, not a
 * coach. The list covers the basics most gyms offer (plate/pin machines, free
 * weights, cables, cardio, and functional kit) so the user rarely has to build
 * an exercise from scratch. Anything missing is still one tap away via "New
 * exercise".
 *
 * Equipment is mapped to the closest value in `EQUIPMENT`: spin/upright/
 * recumbent/air bikes all map to `bike`; ellipticals, steppers, stair climbers,
 * SkiErg, kettlebells, TRX and bands have no dedicated value and map to
 * `other`.
 */
export const STARTER_CATALOG: readonly StarterExercise[] = [
  // --- Chest --------------------------------------------------------------
  { name: 'Chest Press Machine', type: 'strength', bodyPart: 'chest', equipment: 'machine' },
  { name: 'Pec Deck (Machine Fly)', type: 'strength', bodyPart: 'chest', equipment: 'machine' },
  { name: 'Barbell Bench Press', type: 'strength', bodyPart: 'chest', equipment: 'barbell' },
  { name: 'Incline Barbell Bench Press', type: 'strength', bodyPart: 'chest', equipment: 'barbell' },
  { name: 'Dumbbell Bench Press', type: 'strength', bodyPart: 'chest', equipment: 'dumbbell' },
  { name: 'Incline Dumbbell Press', type: 'strength', bodyPart: 'chest', equipment: 'dumbbell' },
  { name: 'Dumbbell Fly', type: 'strength', bodyPart: 'chest', equipment: 'dumbbell' },
  { name: 'Cable Crossover', type: 'strength', bodyPart: 'chest', equipment: 'cable' },
  { name: 'Push-up', type: 'bodyweight', bodyPart: 'chest', equipment: 'bodyweight' },

  // --- Back ---------------------------------------------------------------
  { name: 'Lat Pulldown', type: 'strength', bodyPart: 'back', equipment: 'cable' },
  { name: 'Seated Cable Row', type: 'strength', bodyPart: 'back', equipment: 'cable' },
  { name: 'Seated Row Machine', type: 'strength', bodyPart: 'back', equipment: 'machine' },
  { name: 'Assisted Pull-up Machine', type: 'strength', bodyPart: 'back', equipment: 'machine' },
  { name: 'Barbell Row', type: 'strength', bodyPart: 'back', equipment: 'barbell' },
  { name: 'Deadlift', type: 'strength', bodyPart: 'back', equipment: 'barbell' },
  { name: 'Dumbbell Row', type: 'strength', bodyPart: 'back', equipment: 'dumbbell' },
  { name: 'Pull-up', type: 'bodyweight', bodyPart: 'back', equipment: 'bodyweight' },
  { name: 'Back Extension', type: 'bodyweight', bodyPart: 'back', equipment: 'bodyweight' },

  // --- Legs ---------------------------------------------------------------
  { name: 'Leg Press', type: 'strength', bodyPart: 'legs', equipment: 'machine' },
  { name: 'Hack Squat Machine', type: 'strength', bodyPart: 'legs', equipment: 'machine' },
  { name: 'Leg Extension', type: 'strength', bodyPart: 'legs', equipment: 'machine' },
  { name: 'Leg Curl', type: 'strength', bodyPart: 'legs', equipment: 'machine' },
  { name: 'Standing Calf Raise', type: 'strength', bodyPart: 'legs', equipment: 'machine' },
  { name: 'Barbell Squat', type: 'strength', bodyPart: 'legs', equipment: 'barbell' },
  { name: 'Romanian Deadlift', type: 'strength', bodyPart: 'legs', equipment: 'barbell' },
  { name: 'Hip Thrust', type: 'strength', bodyPart: 'legs', equipment: 'barbell' },
  { name: 'Goblet Squat', type: 'strength', bodyPart: 'legs', equipment: 'dumbbell' },
  { name: 'Walking Lunge', type: 'strength', bodyPart: 'legs', equipment: 'dumbbell' },

  // --- Shoulders ----------------------------------------------------------
  { name: 'Shoulder Press Machine', type: 'strength', bodyPart: 'shoulders', equipment: 'machine' },
  { name: 'Overhead Barbell Press', type: 'strength', bodyPart: 'shoulders', equipment: 'barbell' },
  { name: 'Dumbbell Shoulder Press', type: 'strength', bodyPart: 'shoulders', equipment: 'dumbbell' },
  { name: 'Lateral Raise', type: 'strength', bodyPart: 'shoulders', equipment: 'dumbbell' },
  { name: 'Rear Delt Fly', type: 'strength', bodyPart: 'shoulders', equipment: 'dumbbell' },
  { name: 'Cable Face Pull', type: 'strength', bodyPart: 'shoulders', equipment: 'cable' },

  // --- Arms ---------------------------------------------------------------
  { name: 'Barbell Curl', type: 'strength', bodyPart: 'arms', equipment: 'barbell' },
  { name: 'Dumbbell Curl', type: 'strength', bodyPart: 'arms', equipment: 'dumbbell' },
  { name: 'Hammer Curl', type: 'strength', bodyPart: 'arms', equipment: 'dumbbell' },
  { name: 'Preacher Curl', type: 'strength', bodyPart: 'arms', equipment: 'machine' },
  { name: 'Cable Bicep Curl', type: 'strength', bodyPart: 'arms', equipment: 'cable' },
  { name: 'Triceps Pushdown', type: 'strength', bodyPart: 'arms', equipment: 'cable' },
  { name: 'Overhead Triceps Extension', type: 'strength', bodyPart: 'arms', equipment: 'dumbbell' },
  { name: 'Triceps Dip', type: 'bodyweight', bodyPart: 'arms', equipment: 'bodyweight' },

  // --- Core ---------------------------------------------------------------
  { name: 'Plank', type: 'timed', bodyPart: 'core', equipment: 'bodyweight' },
  { name: 'Hanging Leg Raise', type: 'bodyweight', bodyPart: 'core', equipment: 'bodyweight' },
  { name: 'Cable Crunch', type: 'strength', bodyPart: 'core', equipment: 'cable' },
  { name: 'Ab Crunch Machine', type: 'strength', bodyPart: 'core', equipment: 'machine' },
  { name: 'Russian Twist', type: 'bodyweight', bodyPart: 'core', equipment: 'other' },
  { name: 'Ab Wheel Rollout', type: 'bodyweight', bodyPart: 'core', equipment: 'other' },

  // --- Cardio -------------------------------------------------------------
  { name: 'Treadmill Run', type: 'distance', bodyPart: 'cardio', equipment: 'treadmill' },
  { name: 'Treadmill Walk', type: 'distance', bodyPart: 'cardio', equipment: 'treadmill' },
  { name: 'Upright Bike', type: 'distance', bodyPart: 'cardio', equipment: 'bike' },
  { name: 'Recumbent Bike', type: 'distance', bodyPart: 'cardio', equipment: 'bike' },
  { name: 'Spin Bike', type: 'distance', bodyPart: 'cardio', equipment: 'bike' },
  { name: 'Air Bike', type: 'timed', bodyPart: 'cardio', equipment: 'bike' },
  { name: 'Rowing Machine', type: 'distance', bodyPart: 'cardio', equipment: 'rower' },
  { name: 'SkiErg', type: 'distance', bodyPart: 'cardio', equipment: 'other' },
  { name: 'Elliptical', type: 'distance', bodyPart: 'cardio', equipment: 'other' },
  { name: 'Stair Climber', type: 'timed', bodyPart: 'cardio', equipment: 'other' },
  { name: 'Stepper', type: 'timed', bodyPart: 'cardio', equipment: 'other' },

  // --- Full body / functional --------------------------------------------
  { name: 'Kettlebell Swing', type: 'strength', bodyPart: 'full_body', equipment: 'other' },
  { name: 'TRX Row', type: 'bodyweight', bodyPart: 'back', equipment: 'other' },
  { name: 'Battle Ropes', type: 'timed', bodyPart: 'full_body', equipment: 'other' },
  { name: "Farmer's Carry", type: 'timed', bodyPart: 'full_body', equipment: 'dumbbell' },
  { name: 'Box Jump', type: 'bodyweight', bodyPart: 'legs', equipment: 'other' },
  { name: 'Burpee', type: 'bodyweight', bodyPart: 'full_body', equipment: 'bodyweight' },
  { name: 'Resistance Band Pull-apart', type: 'strength', bodyPart: 'shoulders', equipment: 'other' },
]

/** Normalise an exercise name for case/space-insensitive duplicate matching. */
export const normalizeExerciseName = (name: string): string =>
  name.trim().toLowerCase().replace(/\s+/g, ' ')

/**
 * Split the catalog into ordered body-part groups for the picker. The order
 * follows the `BODY_PARTS` enum (chest → back → legs → …) so it lines up with
 * the library's filter chips.
 */
export interface StarterGroup {
  readonly bodyPart: BodyPart
  readonly items: readonly StarterExercise[]
}

export function groupStarterCatalog(
  catalog: readonly StarterExercise[] = STARTER_CATALOG,
): readonly StarterGroup[] {
  const order: readonly BodyPart[] = [
    'chest',
    'back',
    'legs',
    'shoulders',
    'arms',
    'core',
    'cardio',
    'full_body',
    'other',
  ]
  return order
    .map((bodyPart) => ({
      bodyPart,
      items: catalog.filter((e) => e.bodyPart === bodyPart),
    }))
    .filter((g) => g.items.length > 0)
}
