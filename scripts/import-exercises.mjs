/**
 * Build-time importer for the BodyCache starter library.
 *
 * Source: https://github.com/hasaneyldrm/exercises-dataset (ExerciseDB-style,
 * ~1,324 exercises with a thumbnail JPG + animated GIF each). License is
 * EDUCATIONAL / NON-COMMERCIAL only — fine for personal use, do not ship the
 * bundled media in a paid/commercial build.
 *
 * This script is a one-off generator, NOT a runtime dependency:
 *   1. Fetches the dataset's `exercises.json`.
 *   2. Walks the hand-curated `CATALOG` below (machine / TechnoGym focused),
 *      validating that every id exists in the dataset.
 *   3. Downloads each exercise's animated GIF into `public/exercise-media/`.
 *      A GIF's first frame doubles as the still "picture" — `storePhoto`
 *      derives a static thumbnail from it at add-time — so one asset gives both.
 *   4. Emits `src/features/exercises/starterCatalog.generated.ts` with the
 *      curated entries (name + facets + cues + bundled media path).
 *
 * Run: `node scripts/import-exercises.mjs` (Node 18+, network required).
 */
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const RAW = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main'
const MEDIA_DIR = path.join(ROOT, 'public', 'exercise-media')
const OUT_FILE = path.join(ROOT, 'src', 'features', 'exercises', 'starterCatalog.generated.ts')

/**
 * The curated starter library, keyed by dataset id. Focused on the
 * selectorized / plate-loaded machines you'd find on a TechnoGym floor
 * (`lever …`, `sled …`, `smith …`, cable stacks, cardio machines), rounded out
 * with the essential free-weight and bodyweight staples most people log.
 *
 * Each tuple is [datasetId, displayName, type, bodyPart, equipment]. The id
 * drives which GIF + instructions get pulled; the other fields are how
 * BodyCache stores it (mapped to its own small enums — e.g. lever/sled/smith
 * all become `machine`, waist→core, upper/lower legs→legs, arms→arms).
 */
const CATALOG = [
  // --- Chest --------------------------------------------------------------
  ['0577', 'Chest Press (Machine)', 'strength', 'chest', 'machine'],
  ['1299', 'Incline Chest Press (Machine)', 'strength', 'chest', 'machine'],
  ['1300', 'Decline Chest Press (Machine)', 'strength', 'chest', 'machine'],
  ['0596', 'Pec Deck (Machine Fly)', 'strength', 'chest', 'machine'],
  ['2144', 'Seated Cable Chest Press', 'strength', 'chest', 'cable'],
  ['0151', 'Cable Bench Press', 'strength', 'chest', 'cable'],
  ['0155', 'Cable Crossover', 'strength', 'chest', 'cable'],
  ['0179', 'Low Cable Fly', 'strength', 'chest', 'cable'],
  ['0748', 'Smith Machine Bench Press', 'strength', 'chest', 'machine'],
  ['0757', 'Smith Incline Bench Press', 'strength', 'chest', 'machine'],
  ['0025', 'Barbell Bench Press', 'strength', 'chest', 'barbell'],
  ['0047', 'Incline Barbell Bench Press', 'strength', 'chest', 'barbell'],
  ['0289', 'Dumbbell Bench Press', 'strength', 'chest', 'dumbbell'],
  ['0314', 'Incline Dumbbell Press', 'strength', 'chest', 'dumbbell'],
  ['0308', 'Dumbbell Fly', 'strength', 'chest', 'dumbbell'],
  ['0662', 'Push-up', 'bodyweight', 'chest', 'bodyweight'],

  // --- Back ---------------------------------------------------------------
  ['0579', 'Lat Pulldown (Machine)', 'strength', 'back', 'machine'],
  ['2736', 'Reverse-Grip Pulldown (Machine)', 'strength', 'back', 'machine'],
  ['1350', 'Seated Row (Machine)', 'strength', 'back', 'machine'],
  ['0588', 'Narrow-Grip Seated Row (Machine)', 'strength', 'back', 'machine'],
  ['0581', 'High Row (Machine)', 'strength', 'back', 'machine'],
  ['0606', 'T-Bar Row (Machine)', 'strength', 'back', 'machine'],
  ['1313', 'Unilateral Row (Machine)', 'strength', 'back', 'machine'],
  ['0572', 'Assisted Pull-up (Machine)', 'strength', 'back', 'machine'],
  ['0573', 'Back Extension (Machine)', 'strength', 'back', 'machine'],
  ['2285', 'Pullover (Machine)', 'strength', 'back', 'machine'],
  ['0604', 'Shrug (Machine)', 'strength', 'back', 'machine'],
  ['0198', 'Cable Pulldown', 'strength', 'back', 'cable'],
  ['0245', 'Underhand Cable Pulldown', 'strength', 'back', 'cable'],
  ['0861', 'Seated Cable Row', 'strength', 'back', 'cable'],
  ['0237', 'Straight-Arm Pulldown (Cable)', 'strength', 'back', 'cable'],
  ['0220', 'Cable Shrug', 'strength', 'back', 'cable'],
  ['0027', 'Barbell Row', 'strength', 'back', 'barbell'],
  ['0032', 'Deadlift', 'strength', 'back', 'barbell'],
  ['0292', 'One-Arm Dumbbell Row', 'strength', 'back', 'dumbbell'],
  ['0652', 'Pull-up', 'bodyweight', 'back', 'bodyweight'],
  ['1326', 'Chin-up', 'bodyweight', 'back', 'bodyweight'],

  // --- Legs ---------------------------------------------------------------
  ['0739', 'Leg Press (45°)', 'strength', 'legs', 'machine'],
  ['0743', 'Hack Squat (Machine)', 'strength', 'legs', 'machine'],
  ['0585', 'Leg Extension (Machine)', 'strength', 'legs', 'machine'],
  ['0586', 'Lying Leg Curl (Machine)', 'strength', 'legs', 'machine'],
  ['0599', 'Seated Leg Curl (Machine)', 'strength', 'legs', 'machine'],
  ['0597', 'Hip Abduction (Machine)', 'strength', 'legs', 'machine'],
  ['0598', 'Hip Adduction (Machine)', 'strength', 'legs', 'machine'],
  ['0593', 'Reverse Hyperextension (Machine)', 'strength', 'legs', 'machine'],
  ['2289', 'Calf Press (Machine)', 'strength', 'legs', 'machine'],
  ['0738', 'Calf Press (Leg Press)', 'strength', 'legs', 'machine'],
  ['0605', 'Standing Calf Raise (Machine)', 'strength', 'legs', 'machine'],
  ['0594', 'Seated Calf Raise (Machine)', 'strength', 'legs', 'machine'],
  ['0760', 'Smith Leg Press', 'strength', 'legs', 'machine'],
  ['0770', 'Smith Machine Squat', 'strength', 'legs', 'machine'],
  ['0755', 'Smith Hack Squat', 'strength', 'legs', 'machine'],
  ['0043', 'Barbell Squat', 'strength', 'legs', 'barbell'],
  ['0042', 'Barbell Front Squat', 'strength', 'legs', 'barbell'],
  ['0085', 'Romanian Deadlift', 'strength', 'legs', 'barbell'],
  ['1409', 'Barbell Hip Thrust', 'strength', 'legs', 'barbell'],
  ['1760', 'Goblet Squat', 'strength', 'legs', 'dumbbell'],
  ['0336', 'Dumbbell Lunge', 'strength', 'legs', 'dumbbell'],
  ['1459', 'Dumbbell Romanian Deadlift', 'strength', 'legs', 'dumbbell'],
  ['1460', 'Walking Lunge', 'bodyweight', 'legs', 'bodyweight'],

  // --- Shoulders ----------------------------------------------------------
  ['0603', 'Shoulder Press (Machine)', 'strength', 'shoulders', 'machine'],
  ['0590', 'One-Arm Shoulder Press (Machine)', 'strength', 'shoulders', 'machine'],
  ['0584', 'Lateral Raise (Machine)', 'strength', 'shoulders', 'machine'],
  ['0602', 'Rear Delt Fly (Machine)', 'strength', 'shoulders', 'machine'],
  ['0766', 'Smith Shoulder Press', 'strength', 'shoulders', 'machine'],
  ['0405', 'Dumbbell Shoulder Press', 'strength', 'shoulders', 'dumbbell'],
  ['2137', 'Arnold Press', 'strength', 'shoulders', 'dumbbell'],
  ['0334', 'Dumbbell Lateral Raise', 'strength', 'shoulders', 'dumbbell'],
  ['0310', 'Dumbbell Front Raise', 'strength', 'shoulders', 'dumbbell'],
  ['0378', 'Rear Delt Fly', 'strength', 'shoulders', 'dumbbell'],
  ['0219', 'Cable Shoulder Press', 'strength', 'shoulders', 'cable'],
  ['0178', 'Cable Lateral Raise', 'strength', 'shoulders', 'cable'],
  ['0203', 'Cable Face Pull', 'strength', 'shoulders', 'cable'],
  ['0246', 'Cable Upright Row', 'strength', 'shoulders', 'cable'],

  // --- Arms ---------------------------------------------------------------
  ['0575', 'Biceps Curl (Machine)', 'strength', 'arms', 'machine'],
  ['0592', 'Preacher Curl (Machine)', 'strength', 'arms', 'machine'],
  ['0607', 'Triceps Extension (Machine)', 'strength', 'arms', 'machine'],
  ['0591', 'Triceps Dip (Machine)', 'strength', 'arms', 'machine'],
  ['0031', 'Barbell Curl', 'strength', 'arms', 'barbell'],
  ['0447', 'EZ-Bar Curl', 'strength', 'arms', 'barbell'],
  ['0313', 'Hammer Curl', 'strength', 'arms', 'dumbbell'],
  ['0868', 'Cable Biceps Curl', 'strength', 'arms', 'cable'],
  ['0195', 'Cable Preacher Curl', 'strength', 'arms', 'cable'],
  ['0190', 'Cable One-Arm Curl', 'strength', 'arms', 'cable'],
  ['0201', 'Triceps Pushdown', 'strength', 'arms', 'cable'],
  ['0241', 'Triceps Pushdown (V-Bar)', 'strength', 'arms', 'cable'],
  ['0200', 'Triceps Pushdown (Rope)', 'strength', 'arms', 'cable'],
  ['0194', 'Overhead Triceps Extension (Cable)', 'strength', 'arms', 'cable'],
  ['0860', 'Cable Triceps Kickback', 'strength', 'arms', 'cable'],
  ['0247', 'Cable Wrist Curl', 'strength', 'arms', 'cable'],
  ['0814', 'Triceps Dip', 'bodyweight', 'arms', 'bodyweight'],

  // --- Core ---------------------------------------------------------------
  ['0595', 'Ab Crunch (Machine)', 'strength', 'core', 'machine'],
  ['1452', 'Seated Crunch (Machine)', 'strength', 'core', 'machine'],
  ['0175', 'Cable Kneeling Crunch', 'strength', 'core', 'cable'],
  ['0212', 'Cable Seated Crunch', 'strength', 'core', 'cable'],
  ['0873', 'Cable Reverse Crunch', 'strength', 'core', 'cable'],
  ['0243', 'Cable Twist (Woodchop)', 'strength', 'core', 'cable'],
  ['0472', 'Hanging Leg Raise', 'bodyweight', 'core', 'bodyweight'],
  ['0274', 'Floor Crunch', 'bodyweight', 'core', 'bodyweight'],
  ['0001', 'Sit-up', 'bodyweight', 'core', 'bodyweight'],
  ['0630', 'Mountain Climber', 'timed', 'core', 'bodyweight'],

  // --- Cardio -------------------------------------------------------------
  ['0684', 'Treadmill Run', 'distance', 'cardio', 'treadmill'],
  ['3666', 'Treadmill Incline Walk', 'distance', 'cardio', 'treadmill'],
  ['0798', 'Stationary Bike', 'distance', 'cardio', 'bike'],
  ['2331', 'Cross Trainer', 'distance', 'cardio', 'other'],
  ['2141', 'Elliptical', 'distance', 'cardio', 'other'],
  ['2311', 'Stepmill', 'timed', 'cardio', 'other'],
  ['2612', 'Jump Rope', 'timed', 'cardio', 'other'],

  // --- Full body / functional --------------------------------------------
  ['1160', 'Burpee', 'bodyweight', 'full_body', 'bodyweight'],
]

/** Collapse the dataset's instruction paragraph into a tidy cues string. */
const toCues = (rec) => {
  const en = rec?.instructions?.en
  if (typeof en !== 'string') return null
  const text = en.replace(/\s+/g, ' ').trim()
  if (!text) return null
  // `notes` is NonEmptyString1000 — keep well under, cut on a sentence end.
  if (text.length <= 600) return text
  const clipped = text.slice(0, 600)
  const lastStop = clipped.lastIndexOf('. ')
  return (lastStop > 200 ? clipped.slice(0, lastStop + 1) : clipped.trimEnd()) + ' …'
}

/** The media filename for a record, e.g. `videos/0577-2gPfomN.gif` → basename. */
const gifBasename = (rec) => {
  const url = rec?.gif_url
  if (typeof url !== 'string' || !url) return null
  return url.split('/').pop()
}

const fetchBuffer = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

const main = async () => {
  console.log('Fetching exercises.json …')
  const res = await fetch(`${RAW}/data/exercises.json`)
  if (!res.ok) throw new Error(`Failed to fetch dataset: HTTP ${res.status}`)
  const data = await res.json()
  const byId = new Map(data.map((x) => [x.id, x]))

  await mkdir(MEDIA_DIR, { recursive: true })

  const entries = []
  const missing = []
  const noMedia = []

  for (const [id, name, type, bodyPart, equipment] of CATALOG) {
    const rec = byId.get(id)
    if (!rec) {
      missing.push(`${id} (${name})`)
      continue
    }

    let animation = null
    const basename = gifBasename(rec)
    if (basename) {
      try {
        const buf = await fetchBuffer(`${RAW}/videos/${basename}`)
        await writeFile(path.join(MEDIA_DIR, `${id}.gif`), buf)
        animation = `/exercise-media/${id}.gif`
        process.stdout.write(`  ✓ ${id} ${name} (${(buf.length / 1024).toFixed(0)} KB)\n`)
      } catch (err) {
        noMedia.push(`${id} (${name}): ${err.message}`)
      }
    } else {
      noMedia.push(`${id} (${name}): no gif_url`)
    }

    entries.push({ datasetId: id, name, type, bodyPart, equipment, animation, cues: toCues(rec) })
  }

  const lines = entries.map((e) => {
    const fields = [
      `datasetId: ${JSON.stringify(e.datasetId)}`,
      `name: ${JSON.stringify(e.name)}`,
      `type: ${JSON.stringify(e.type)}`,
      `bodyPart: ${JSON.stringify(e.bodyPart)}`,
      `equipment: ${JSON.stringify(e.equipment)}`,
      `animation: ${e.animation ? JSON.stringify(e.animation) : 'null'}`,
      `cues: ${e.cues ? JSON.stringify(e.cues) : 'null'}`,
    ]
    return `  { ${fields.join(', ')} },`
  })

  const banner = `/**
 * AUTO-GENERATED by scripts/import-exercises.mjs — do not edit by hand.
 *
 * Curated starter library sourced from hasaneyldrm/exercises-dataset
 * (educational / non-commercial use only). Animations are bundled under
 * public/exercise-media/ and copied into IndexedDB when an exercise is added.
 *
 * ${entries.length} exercises. Regenerate with: node scripts/import-exercises.mjs
 */
import type { StarterExercise } from './starterCatalog'

export const STARTER_CATALOG: readonly StarterExercise[] = [
${lines.join('\n')}
]
`

  await writeFile(OUT_FILE, banner)

  console.log(`\nWrote ${entries.length} entries → ${path.relative(ROOT, OUT_FILE)}`)
  console.log(`Media → ${path.relative(ROOT, MEDIA_DIR)}/ (${entries.filter((e) => e.animation).length} GIFs)`)
  if (missing.length) console.warn(`\n⚠ ${missing.length} unknown ids (skipped):\n  ${missing.join('\n  ')}`)
  if (noMedia.length) console.warn(`\n⚠ ${noMedia.length} without media:\n  ${noMedia.join('\n  ')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
