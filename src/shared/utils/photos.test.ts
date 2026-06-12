// @vitest-environment happy-dom
import 'fake-indexeddb/auto'
import { Blob as NodeBlob } from 'node:buffer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  storePhoto,
  resolvePhotoUrl,
  readPhotoBlob,
  writePhotoBlob,
  deletePhoto,
  blobToBase64,
  base64ToBlob,
} from './photos'

// Native Node Blobs survive fake-indexeddb's structuredClone (happy-dom's do
// not), so storage round-trips use these; the FileReader-based base64 test uses
// the global (happy-dom) Blob below.
const bytes = (s: string): Blob =>
  new NodeBlob([new TextEncoder().encode(s)], { type: 'image/jpeg' }) as unknown as Blob

describe('storePhoto / readPhotoBlob', () => {
  it('persists the image and returns idb:// references', async () => {
    const { ref, thumbnailRef } = await storePhoto(bytes('hello'))
    expect(ref).toMatch(/^idb:\/\//)
    expect(thumbnailRef).toMatch(/^idb:\/\//)

    const back = await readPhotoBlob(ref)
    expect(back).not.toBeNull()
    expect(await back!.text()).toBe('hello')
  })

  it('stores a separate thumbnail entry', async () => {
    const { thumbnailRef } = await storePhoto(bytes('thumb-src'))
    // createImageBitmap is unavailable here, so makeThumbnail falls back to the
    // original blob — the point is that a thumbnail entry exists and resolves.
    expect(await readPhotoBlob(thumbnailRef)).not.toBeNull()
  })
})

describe('readPhotoBlob', () => {
  it('returns null for non-idb or unknown references', async () => {
    expect(await readPhotoBlob(null)).toBeNull()
    expect(await readPhotoBlob('https://example.com/x.jpg')).toBeNull()
    expect(await readPhotoBlob('idb://does-not-exist')).toBeNull()
  })
})

describe('writePhotoBlob', () => {
  it('writes a blob at an exact reference (restore path)', async () => {
    await writePhotoBlob('idb://restored-key', bytes('restored'))
    const back = await readPhotoBlob('idb://restored-key')
    expect(await back!.text()).toBe('restored')
  })

  it('ignores references without the idb:// prefix', async () => {
    await writePhotoBlob('file://nope', bytes('x'))
    expect(await readPhotoBlob('file://nope')).toBeNull()
  })
})

describe('deletePhoto', () => {
  it('removes stored entries and tolerates bad refs', async () => {
    const { ref, thumbnailRef } = await storePhoto(bytes('to-delete'))
    await deletePhoto(ref, thumbnailRef, null, 'not-a-ref')
    expect(await readPhotoBlob(ref)).toBeNull()
    expect(await readPhotoBlob(thumbnailRef)).toBeNull()
  })
})

describe('base64 round-trip', () => {
  it('encodes and decodes a blob losslessly', async () => {
    // Uses the global (happy-dom) Blob so happy-dom's FileReader can read it.
    const original = new Blob([new TextEncoder().encode('round-trip ✓')], {
      type: 'image/jpeg',
    })
    const b64 = await blobToBase64(original)
    expect(b64).not.toContain(',') // no data-URL prefix
    const restored = base64ToBlob(b64, 'image/jpeg')
    expect(restored.type).toBe('image/jpeg')
    expect(await restored.text()).toBe('round-trip ✓')
  })
})

describe('resolvePhotoUrl', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
  })
  afterEach(() => vi.restoreAllMocks())

  it('resolves a stored reference to an object URL', async () => {
    const { ref } = await storePhoto(bytes('img'))
    expect(await resolvePhotoUrl(ref)).toBe('blob:mock-url')
  })

  it('returns null for missing or non-idb references', async () => {
    expect(await resolvePhotoUrl(null)).toBeNull()
    expect(await resolvePhotoUrl('http://x/y.png')).toBeNull()
    expect(await resolvePhotoUrl('idb://missing')).toBeNull()
  })
})
