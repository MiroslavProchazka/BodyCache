import { describe, expect, it } from 'vitest'
import { parseRestoreMnemonic } from './mnemonic'

const validMnemonic =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'

describe('parseRestoreMnemonic', () => {
  it('rejects empty input', () => {
    const result = parseRestoreMnemonic('', '   ')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Enter your recovery phrase first.')
    }
  })

  it('rejects when phrase matches current owner phrase', () => {
    const result = parseRestoreMnemonic(validMnemonic, `  ${validMnemonic.toUpperCase()}  `)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('This is already your current recovery phrase.')
    }
  })

  it('accepts a valid phrase and normalizes whitespace/casing', () => {
    const result = parseRestoreMnemonic(
      'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong',
      '  ABANDON   ABANDON abandon abandon abandon abandon abandon abandon abandon abandon abandon about  ',
    )

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toBe(validMnemonic)
    }
  })

  it('rejects an invalid phrase', () => {
    const result = parseRestoreMnemonic('', 'invalid words only')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('Invalid recovery phrase. Check words and order.')
    }
  })
})
