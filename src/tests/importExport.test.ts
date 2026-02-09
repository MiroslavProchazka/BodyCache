import { describe, expect, it } from 'vitest'
import { mergeRowsByUpdatedAt, parseImportPayload } from '../domain/importExport'

describe('import export merge', () => {
  it('prefers incoming row with newer updatedAt', () => {
    const result = mergeRowsByUpdatedAt(
      [
        { id: 'a', updatedAt: '2026-02-01T10:00:00.000Z' },
        { id: 'b', updatedAt: '2026-02-01T10:00:00.000Z' }
      ],
      [
        { id: 'a', updatedAt: '2026-02-02T10:00:00.000Z' },
        { id: 'c', updatedAt: '2026-02-02T10:00:00.000Z' }
      ]
    )

    expect(result.report).toEqual({ inserted: 1, updated: 1, skipped: 0, errors: 0 })
    expect(result.rows).toHaveLength(3)
  })

  it('validates payload shape with defaults', () => {
    const parsed = parseImportPayload({ exercises: [{ id: '1', updatedAt: '2026-02-02T10:00:00.000Z' }] })
    expect(parsed.success).toBe(true)
    if (parsed.success) {
      expect(parsed.data.setEntries).toEqual([])
    }
  })
})
