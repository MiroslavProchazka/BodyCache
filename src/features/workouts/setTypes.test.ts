import { describe, it, expect } from 'vitest'
import { narrowSetType, setTypeLabel, nextSetType } from './setTypes'

describe('narrowSetType', () => {
  it('passes through valid types', () => {
    expect(narrowSetType('warmup')).toBe('warmup')
    expect(narrowSetType('drop')).toBe('drop')
    expect(narrowSetType('failure')).toBe('failure')
  })
  it('returns null for normal/unknown values', () => {
    expect(narrowSetType(null)).toBeNull()
    expect(narrowSetType(undefined)).toBeNull()
    expect(narrowSetType('banana')).toBeNull()
  })
})

describe('setTypeLabel', () => {
  it('labels named types and the normal set', () => {
    expect(setTypeLabel('warmup')).toBe('Warm-up')
    expect(setTypeLabel('failure')).toBe('To failure')
    expect(setTypeLabel(null)).toBe('Normal')
  })
})

describe('nextSetType', () => {
  it('cycles Normal → Warm-up → Drop → Failure → Normal', () => {
    expect(nextSetType(null)).toBe('warmup')
    expect(nextSetType('warmup')).toBe('drop')
    expect(nextSetType('drop')).toBe('failure')
    expect(nextSetType('failure')).toBeNull()
  })
})
