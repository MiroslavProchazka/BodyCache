import { Mnemonic } from '@evolu/common'

export type ParseMnemonicResult =
  | { readonly ok: true; readonly value: Mnemonic }
  | { readonly ok: false; readonly error: string }

const normalizeMnemonic = (value: string): string =>
  value.trim().toLowerCase().split(/\s+/).filter(Boolean).join(' ')

/**
 * Parse and validate a user-entered recovery phrase before owner restore.
 * Input is untrusted (manual typing / paste), so we normalize spacing and
 * casing, then run Evolu's Mnemonic validator.
 */
export const parseRestoreMnemonic = (
  currentMnemonic: string,
  candidateMnemonic: string,
): ParseMnemonicResult => {
  const normalizedCurrent = normalizeMnemonic(currentMnemonic)
  const normalizedCandidate = normalizeMnemonic(candidateMnemonic)

  if (!normalizedCandidate) {
    return { ok: false, error: 'Enter your recovery phrase first.' }
  }

  if (normalizedCurrent && normalizedCandidate === normalizedCurrent) {
    return { ok: false, error: 'This is already your current recovery phrase.' }
  }

  const parsed = Mnemonic.from(normalizedCandidate)
  if (!parsed.ok) {
    return { ok: false, error: 'Invalid recovery phrase. Check words and order.' }
  }

  return { ok: true, value: parsed.value }
}
