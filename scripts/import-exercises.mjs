/**
 * Build-time importer for the BodyCache starter library.
 *
 * Source: https://github.com/hasaneyldrm/exercises-dataset (ExerciseDB-style,
 * ~1,324 exercises, each with an animated demo GIF). License is EDUCATIONAL /
 * NON-COMMERCIAL only — fine for personal use, do not ship the media in a
 * paid/commercial build.
 *
 * This script is a one-off generator, NOT a runtime dependency. Unlike the
 * earlier hand-curated build, it now imports the WHOLE dataset (so every gym
 * exercise carries the dataset's current "new design" GIF), filtered down to a
 * gym-focused subset and mapped onto BodyCache's small enums:
 *
 *   1. Fetches the dataset's `exercises.json`.
 *   2. Drops non-gym noise — resistance bands, foam rollers, stability/bosu/
 *      medicine balls, tyres, sledgehammers, mobility *stretches*, neck work,
 *      and gendered/versioned duplicate renders ("… (male)", "… v. 2").
 *   3. Maps each survivor's body_part / equipment onto BodyCache's enums and
 *      derives a logging `type` (strength / bodyweight / timed / distance).
 *   4. Emits `src/features/exercises/starterCatalog.generated.ts`.
 *
 * Media is NOT bundled (1,300+ GIFs would be ~120 MB). Instead each entry's
 * `animation` points straight at the dataset's raw GIF on GitHub
 * (`access-control-allow-origin: *`), which the app streams into IndexedDB via
 * the normal photo pipeline when the exercise is added — same "fetched on-add"
 * behaviour as before, just sourced from the repo instead of `public/`.
 *
 * Run: `node scripts/import-exercises.mjs` (Node 18+, network required).
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const RAW = 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main'
const OUT_FILE = path.join(ROOT, 'src', 'features', 'exercises', 'starterCatalog.generated.ts')

/** Dataset `body_part` → BodyCache `BodyPart`. `neck` is dropped entirely. */
const BODY_PART_MAP = {
  chest: 'chest',
  back: 'back',
  shoulders: 'shoulders',
  'upper arms': 'arms',
  'lower arms': 'arms',
  'upper legs': 'legs',
  'lower legs': 'legs',
  waist: 'core',
  cardio: 'cardio',
}

/**
 * Dataset `equipment` → BodyCache `Equipment`. Anything not listed here is
 * treated as non-gym noise and the exercise is skipped (see EXCLUDE_EQUIPMENT
 * for the explicit drops; an unknown new value also falls through to a skip).
 */
const EQUIPMENT_MAP = {
  'body weight': 'bodyweight',
  weighted: 'bodyweight',
  assisted: 'machine',
  dumbbell: 'dumbbell',
  kettlebell: 'other',
  cable: 'cable',
  rope: 'other',
  barbell: 'barbell',
  'ez barbell': 'barbell',
  'olympic barbell': 'barbell',
  'trap bar': 'barbell',
  'leverage machine': 'machine',
  'smith machine': 'machine',
  'sled machine': 'machine',
  'stationary bike': 'bike',
  'skierg machine': 'other',
  'stepmill machine': 'other',
  'elliptical machine': 'other',
  'upper body ergometer': 'other',
}

/** Equipment values that mark an exercise as non-gym noise → skip. */
const EXCLUDE_EQUIPMENT = new Set([
  'band',
  'resistance band',
  'roller',
  'wheel roller',
  'stability ball',
  'bosu ball',
  'medicine ball',
  'tire',
  'hammer',
])

/** Original equipment values that log like a bodyweight movement. */
const BODYWEIGHT_EQUIPMENT = new Set(['body weight', 'weighted', 'assisted'])

/** Names that read as a cardio *distance* effort (vs a timed hold/interval). */
const DISTANCE_RE = /\b(run|walk|bike|cycl|row|elliptical|ski|tread|sprint|jog)/i

/** Drop mobility/duplicate renders the gym log doesn't need. */
const isNoiseName = (name) => {
  const n = name.toLowerCase()
  if (n.includes('stretch')) return true // mobility, not a logged lift
  if (/\((male|female)\)/.test(n)) return true // gendered duplicate render
  if (/\bv\.?\s?\d+\b/.test(n) || /\bversion\s?\d+\b/.test(n)) return true // "… v. 2"
  return false
}

/** Title-case a lowercase dataset name: "lever chest press" → "Lever Chest Press". */
const titleCase = (s) =>
  s
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1))

/** Pick the BodyCache logging type for a mapped entry. */
const deriveType = (bodyPart, origEquipment, name) => {
  if (bodyPart === 'cardio') {
    return DISTANCE_RE.test(name) || origEquipment === 'stationary bike' ? 'distance' : 'timed'
  }
  if (BODYWEIGHT_EQUIPMENT.has(origEquipment)) return 'bodyweight'
  return 'strength'
}

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

/** Ordering for a stable, library-aligned output (chest → back → … → other). */
const BODY_ORDER = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core', 'cardio', 'other']

const main = async () => {
  console.log('Fetching exercises.json …')
  const res = await fetch(`${RAW}/data/exercises.json`)
  if (!res.ok) throw new Error(`Failed to fetch dataset: HTTP ${res.status}`)
  const data = await res.json()

  const entries = []
  const seen = new Set() // normalised names, for dedupe
  const skipped = { noGif: 0, equipment: 0, bodyPart: 0, noise: 0, dup: 0 }

  for (const rec of data) {
    if (!rec?.gif_url) {
      skipped.noGif++
      continue
    }
    const origEquipment = String(rec.equipment ?? '').toLowerCase()
    if (EXCLUDE_EQUIPMENT.has(origEquipment) || !EQUIPMENT_MAP[origEquipment]) {
      skipped.equipment++
      continue
    }
    const bodyPart = BODY_PART_MAP[String(rec.body_part ?? '').toLowerCase()]
    if (!bodyPart) {
      skipped.bodyPart++
      continue
    }
    const name = titleCase(String(rec.name ?? ''))
    if (!name || isNoiseName(name)) {
      skipped.noise++
      continue
    }
    const key = name.toLowerCase()
    if (seen.has(key)) {
      skipped.dup++
      continue
    }
    seen.add(key)

    entries.push({
      datasetId: rec.id,
      name,
      type: deriveType(bodyPart, origEquipment, name),
      bodyPart,
      equipment: EQUIPMENT_MAP[origEquipment],
      animation: `${RAW}/${rec.gif_url}`,
      cues: toCues(rec),
    })
  }

  // Stable order: by body-part group, then name.
  entries.sort((a, b) => {
    const ai = BODY_ORDER.indexOf(a.bodyPart)
    const bi = BODY_ORDER.indexOf(b.bodyPart)
    return ai !== bi ? ai - bi : a.name.localeCompare(b.name)
  })

  const lineFor = (e) => {
    const fields = [
      `datasetId: ${JSON.stringify(e.datasetId)}`,
      `name: ${JSON.stringify(e.name)}`,
      `type: ${JSON.stringify(e.type)}`,
      `bodyPart: ${JSON.stringify(e.bodyPart)}`,
      `equipment: ${JSON.stringify(e.equipment)}`,
      `animation: ${e.animation ? JSON.stringify(e.animation) : 'null'}`,
      `cues: ${e.cues ? JSON.stringify(e.cues) : 'null'}`,
    ]
    return `    { ${fields.join(', ')} },`
  }

  // Emit the catalog in chunks, each spread from an array cast to the element
  // type. A single 1,000+ element literal trips TypeScript's union-complexity
  // limit (TS2590); the per-chunk cast keeps the inferred type small.
  const CHUNK = 100
  const chunks = []
  for (let i = 0; i < entries.length; i += CHUNK) {
    const body = entries.slice(i, i + CHUNK).map(lineFor).join('\n')
    chunks.push(`  ...([\n${body}\n  ] as readonly StarterExercise[]),`)
  }

  const banner = `/**
 * AUTO-GENERATED by scripts/import-exercises.mjs — do not edit by hand.
 *
 * Gym-focused starter library sourced from hasaneyldrm/exercises-dataset
 * (educational / non-commercial use only). Each entry's \`animation\` is the
 * dataset's raw demo GIF on GitHub, streamed into IndexedDB when the exercise
 * is added — media is intentionally NOT bundled.
 *
 * ${entries.length} exercises. Regenerate with: node scripts/import-exercises.mjs
 */
import type { StarterExercise } from './starterCatalog'

export const STARTER_CATALOG: readonly StarterExercise[] = [
${chunks.join('\n')}
]
`

  await writeFile(OUT_FILE, banner)

  console.log(`\nWrote ${entries.length} entries → ${path.relative(ROOT, OUT_FILE)}`)
  console.log(
    `Skipped: ${skipped.equipment} non-gym equipment, ${skipped.noise} stretch/duplicate names, ` +
      `${skipped.bodyPart} unmapped body part, ${skipped.dup} duplicate names, ${skipped.noGif} no GIF`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
