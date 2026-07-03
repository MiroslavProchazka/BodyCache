import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ExerciseId } from '@/evolu/schema'
import type { StoredPhoto } from '@/shared/utils/photos'
import { processStarterMedia, type StarterMediaDeps, type StarterMediaJob } from './starterMedia'

const jobs = (n: number): StarterMediaJob[] =>
  Array.from({ length: n }, (_, i) => ({
    exerciseId: `ex-${i}` as unknown as ExerciseId,
    animationUrl: `https://example.test/${i}.gif`,
  }))

const STORED: StoredPhoto = { ref: 'idb://a', thumbnailRef: 'idb://a-thumb' }

const okResponse = (): Response =>
  ({ ok: true, status: 200, blob: async () => new Blob(['gif']) }) as unknown as Response

const baseDeps = (over: Partial<StarterMediaDeps> = {}): StarterMediaDeps => ({
  attachPrimaryPhoto: vi.fn(),
  storePhoto: vi.fn(async () => STORED),
  isOnline: () => true,
  ...over,
})

describe('processStarterMedia', () => {
  afterEach(() => vi.useRealTimers())

  it('short-circuits every job when offline, without fetching', async () => {
    const fetchFn = vi.fn()
    const res = await processStarterMedia(
      jobs(3),
      baseDeps({ isOnline: () => false, fetchFn: fetchFn as unknown as typeof fetch }),
    )
    expect(fetchFn).not.toHaveBeenCalled()
    expect(res).toMatchObject({ total: 3, done: 3, skippedOffline: 3, stored: 0, failed: 0 })
  })

  it('stores each animation, attaches it, and reports progress once per job', async () => {
    const attachPrimaryPhoto = vi.fn()
    const onProgress = vi.fn()
    const fetchFn = vi.fn(async () => okResponse())
    const res = await processStarterMedia(
      jobs(3),
      baseDeps({
        attachPrimaryPhoto,
        onProgress,
        fetchFn: fetchFn as unknown as typeof fetch,
        concurrency: 2,
      }),
    )
    expect(res).toMatchObject({ stored: 3, failed: 0, done: 3, total: 3 })
    expect(attachPrimaryPhoto).toHaveBeenCalledTimes(3)
    expect(attachPrimaryPhoto).toHaveBeenCalledWith(expect.anything(), STORED)
    // One progress call per finished job, last one at done === total.
    expect(onProgress).toHaveBeenCalledTimes(3)
    const lastProgress = onProgress.mock.calls[onProgress.mock.calls.length - 1][0]
    expect(lastProgress).toMatchObject({ done: 3, total: 3, stored: 3 })
  })

  it('retries once after a transient failure, then succeeds', async () => {
    let calls = 0
    const fetchFn = vi.fn(async () => {
      calls++
      if (calls === 1) throw new Error('network blip')
      return okResponse()
    })
    const res = await processStarterMedia(
      jobs(1),
      baseDeps({ fetchFn: fetchFn as unknown as typeof fetch, retries: 1 }),
    )
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(res).toMatchObject({ stored: 1, failed: 0 })
  })

  it('gives up (failed) once retries are exhausted', async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error('down')
    })
    const attachPrimaryPhoto = vi.fn()
    const res = await processStarterMedia(
      jobs(1),
      baseDeps({ fetchFn: fetchFn as unknown as typeof fetch, attachPrimaryPhoto, retries: 1 }),
    )
    expect(fetchFn).toHaveBeenCalledTimes(2) // one attempt + one retry
    expect(attachPrimaryPhoto).not.toHaveBeenCalled()
    expect(res).toMatchObject({ failed: 1, stored: 0 })
  })

  it('treats a non-ok HTTP response as a failure', async () => {
    const fetchFn = vi.fn(async () => ({ ok: false, status: 404 }) as unknown as Response)
    const res = await processStarterMedia(
      jobs(1),
      baseDeps({ fetchFn: fetchFn as unknown as typeof fetch, retries: 0 }),
    )
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(res).toMatchObject({ failed: 1, stored: 0 })
  })

  it('aborts a stalled fetch after the timeout and counts it failed', async () => {
    vi.useFakeTimers()
    const fetchFn = vi.fn(
      (_url: string, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          )
        }),
    )
    const p = processStarterMedia(
      jobs(1),
      baseDeps({ fetchFn: fetchFn as unknown as typeof fetch, retries: 0, timeoutMs: 1000 }),
    )
    await vi.advanceTimersByTimeAsync(1000)
    const res = await p
    expect(res).toMatchObject({ failed: 1, stored: 0 })
  })

  it('never exceeds the concurrency cap', async () => {
    let active = 0
    let maxActive = 0
    const gates: Array<() => void> = []
    const fetchFn = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          active++
          maxActive = Math.max(maxActive, active)
          gates.push(() => {
            active--
            resolve(okResponse())
          })
        }),
    )
    const done = processStarterMedia(
      jobs(6),
      baseDeps({ fetchFn: fetchFn as unknown as typeof fetch, concurrency: 3 }),
    )
    for (let served = 0; served < 6; served++) {
      // Wait until the next fetch is in flight, then release it.
      while (gates.length === 0) await Promise.resolve()
      expect(active).toBeLessThanOrEqual(3)
      gates.shift()!()
    }
    const res = await done
    expect(maxActive).toBe(3)
    expect(res.stored).toBe(6)
  })
})
