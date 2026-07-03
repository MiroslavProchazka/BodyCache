import type { ExerciseId } from '@/evolu/schema'
import { storePhoto as defaultStorePhoto, type StoredPhoto } from '@/shared/utils/photos'

/**
 * Background download queue for starter-library demo animations.
 *
 * Adding starter exercises must feel instant: `StarterLibraryPage` commits the
 * Evolu inserts synchronously, navigates away, then hands the GIF downloads to
 * this module. Downloads run detached from any component (a plain module-level
 * promise), so they survive the route change; the photo appears reactively on
 * the already-rendered library card once stored.
 *
 * Best-effort by design (matching the pre-existing contract): offline or failed
 * downloads simply leave the exercise photo-less — an add never fails because of
 * media, and the queue is not persisted across app restarts.
 *
 * Dependencies are injected so the queue stays pure and unit-testable (see
 * `starterMedia.test.ts`); `enqueueStarterMedia` wires in the real `storePhoto`.
 */

export interface StarterMediaJob {
  readonly exerciseId: ExerciseId
  /** The demo GIF URL (dataset raw GitHub URL). */
  readonly animationUrl: string
}

export interface StarterMediaProgress {
  /** Jobs finished so far, any outcome. */
  readonly done: number
  readonly total: number
  readonly stored: number
  readonly failed: number
  readonly skippedOffline: number
}

export interface StarterMediaDeps {
  /** Attach the stored refs to the exercise as its primary photo. */
  readonly attachPrimaryPhoto: (exerciseId: ExerciseId, stored: StoredPhoto) => void
  /** Persist a fetched blob; defaults to the real IndexedDB `storePhoto`. */
  readonly storePhoto?: (blob: Blob) => Promise<StoredPhoto>
  /** Injectable for tests; defaults to the global `fetch`. */
  readonly fetchFn?: typeof fetch
  /** Injectable for tests; defaults to `navigator.onLine`. */
  readonly isOnline?: () => boolean
  /** Called after each job finishes (running totals). */
  readonly onProgress?: (progress: StarterMediaProgress) => void
  /** Per-attempt timeout before aborting the fetch. Default 15 s. */
  readonly timeoutMs?: number
  /** Parallel downloads. Default 3. */
  readonly concurrency?: number
  /** Retries after the first attempt. Default 1 (so up to 2 attempts). */
  readonly retries?: number
}

type Outcome = 'stored' | 'failed' | 'skipped-offline'

const isOnlineDefault = (): boolean =>
  typeof navigator === 'undefined' ? true : navigator.onLine

/**
 * Fetch one animation with an abort-on-timeout and a bounded number of retries,
 * then store it and attach it as the exercise's primary photo. Never throws —
 * returns the outcome so the caller can tally progress.
 */
const runJob = async (job: StarterMediaJob, deps: Required<Pick<StarterMediaDeps, 'attachPrimaryPhoto' | 'storePhoto' | 'fetchFn' | 'isOnline' | 'timeoutMs' | 'retries'>>): Promise<Outcome> => {
  // Skip the moment we know we're offline — the exercise stays photo-less,
  // exactly as before. Re-checked per job so losing connectivity mid-batch
  // short-circuits the rest instead of burning the full timeout each time.
  if (!deps.isOnline()) return 'skipped-offline'

  for (let attempt = 0; attempt <= deps.retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), deps.timeoutMs)
    try {
      const res = await deps.fetchFn(job.animationUrl, { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const stored = await deps.storePhoto(blob)
      deps.attachPrimaryPhoto(job.exerciseId, stored)
      return 'stored'
    } catch {
      // Fall through to the next attempt; the last failure yields 'failed'.
    } finally {
      clearTimeout(timer)
    }
  }
  return 'failed'
}

/**
 * Process every job with a fixed concurrency, reporting progress as each
 * finishes. Resolves with the final tally. Exposed (over the fire-and-forget
 * `enqueueStarterMedia`) so tests can await completion deterministically.
 */
export const processStarterMedia = async (
  jobs: readonly StarterMediaJob[],
  deps: StarterMediaDeps,
): Promise<StarterMediaProgress> => {
  const resolved = {
    attachPrimaryPhoto: deps.attachPrimaryPhoto,
    storePhoto: deps.storePhoto ?? defaultStorePhoto,
    fetchFn: deps.fetchFn ?? fetch,
    isOnline: deps.isOnline ?? isOnlineDefault,
    timeoutMs: deps.timeoutMs ?? 15_000,
    retries: deps.retries ?? 1,
  }
  const concurrency = Math.max(1, deps.concurrency ?? 3)
  const total = jobs.length

  let done = 0
  let stored = 0
  let failed = 0
  let skippedOffline = 0

  const report = () =>
    deps.onProgress?.({ done, total, stored, failed, skippedOffline })

  let next = 0
  const worker = async (): Promise<void> => {
    for (;;) {
      const i = next++
      if (i >= total) return
      const outcome = await runJob(jobs[i], resolved)
      done++
      if (outcome === 'stored') stored++
      else if (outcome === 'failed') failed++
      else skippedOffline++
      report()
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, total) }, () => worker()),
  )
  return { done, total, stored, failed, skippedOffline }
}

/**
 * Fire-and-forget entry point for the UI: start processing detached so it keeps
 * running after the page unmounts. No-ops on an empty job list.
 */
export const enqueueStarterMedia = (
  jobs: readonly StarterMediaJob[],
  deps: StarterMediaDeps,
): void => {
  if (jobs.length === 0) return
  void processStarterMedia(jobs, deps)
}
