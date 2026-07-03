// CI chunk guard — run after `npm run build`.
//
// Asserts the bundle-shape invariants from docs/exercise-library-performance.md
// §W4 so the ~739 kB starter catalog can never silently creep back onto a hot
// path:
//   1. No chunk *statically* imports the generated starter catalog.
//   2. The catalog is reachable only as a *dynamic* import (its own async chunk).
//   3. ExerciseDetailPage's transitive static imports exclude the catalog.
//   4. The main `index` entry chunk stays under a recorded byte ceiling
//      (fails on a >~10% regression — bump INDEX_MAX_BYTES deliberately).
//
// Reads Vite's build manifest (enable `build.manifest` in vite.config.ts).

import { readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const manifestPath = join(dist, '.vite', 'manifest.json')

/** Manifest keys (source paths) of the modules we reason about. */
const CATALOG_KEY = 'src/features/exercises/starterCatalog.generated.ts'
const DETAIL_KEY = 'src/features/exercises/ExerciseDetailPage.tsx'
const STARTER_KEY = 'src/features/exercises/StarterLibraryPage.tsx'

// Recorded ceiling for the main entry chunk (raw minified bytes). Baseline at
// the time of writing is ~525 kB; this allows ~10% headroom. Raise it in the
// same PR that legitimately grows the core bundle.
const INDEX_MAX_BYTES = 580 * 1024

let manifest
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
} catch {
  console.error(
    `check-chunks: could not read ${manifestPath}. Run \`npm run build\` first ` +
      `(and ensure build.manifest is enabled in vite.config.ts).`,
  )
  process.exit(1)
}

const errors = []

// 1. No chunk statically imports the catalog.
for (const [key, entry] of Object.entries(manifest)) {
  if ((entry.imports ?? []).includes(CATALOG_KEY)) {
    errors.push(`${key} statically imports the starter catalog`)
  }
}

// 2. The catalog is a dynamic entry, imported dynamically by the starter page.
if (!manifest[CATALOG_KEY]) {
  errors.push(`catalog module ${CATALOG_KEY} is missing from the manifest`)
} else if (!manifest[CATALOG_KEY].isDynamicEntry) {
  errors.push(`catalog module ${CATALOG_KEY} is not a dynamic entry (it should be code-split)`)
}
if (!(manifest[STARTER_KEY]?.dynamicImports ?? []).includes(CATALOG_KEY)) {
  errors.push(
    `StarterLibraryPage no longer dynamically imports the catalog — did the lazy loader move?`,
  )
}

// 3. ExerciseDetailPage's transitive static-import closure excludes the catalog.
const catalogFile = manifest[CATALOG_KEY]?.file
const closure = new Set()
const walk = (key) => {
  if (closure.has(key) || !manifest[key]) return
  closure.add(key)
  for (const dep of manifest[key].imports ?? []) walk(dep)
}
walk(DETAIL_KEY)
const detailFiles = [...closure].map((k) => manifest[k]?.file).filter(Boolean)
if (catalogFile && detailFiles.includes(catalogFile)) {
  errors.push(`ExerciseDetailPage statically pulls in the catalog chunk (${catalogFile})`)
}

// 4. Index entry chunk under the byte ceiling.
const indexFile = manifest['index.html']?.file
let indexBytes = 0
if (!indexFile) {
  errors.push(`no index.html entry in the manifest`)
} else {
  indexBytes = statSync(join(dist, indexFile)).size
  if (indexBytes > INDEX_MAX_BYTES) {
    errors.push(
      `index chunk ${indexFile} is ${indexBytes} B, over the ${INDEX_MAX_BYTES} B ceiling ` +
        `(raise INDEX_MAX_BYTES deliberately if this growth is intended)`,
    )
  }
}

if (errors.length) {
  console.error('check-chunks: FAILED\n' + errors.map((e) => `  - ${e}`).join('\n'))
  process.exit(1)
}

console.log(
  `check-chunks: OK — index ${indexBytes} B ≤ ${INDEX_MAX_BYTES} B; ` +
    `catalog (${catalogFile}) is dynamic-only and absent from the detail-page chunk`,
)
