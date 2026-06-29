import { describe, expect, it } from 'vitest'
import { chunk } from './chunk'

describe('chunk', () => {
  it('splits into full and trailing partial groups', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('returns one group when size exceeds length', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]])
  })

  it('returns empty for an empty input', () => {
    expect(chunk([], 2)).toEqual([])
  })

  it('throws on a non-positive size', () => {
    expect(() => chunk([1], 0)).toThrow()
  })
})
