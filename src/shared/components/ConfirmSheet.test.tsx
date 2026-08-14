// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConfirmSheet } from './ConfirmSheet'

describe('ConfirmSheet', () => {
  afterEach(cleanup)

  it('renders an accessible dialog and confirms once', () => {
    const onConfirm = vi.fn(() => new Promise<void>(() => {}))
    render(
      <ConfirmSheet
        open
        title="Delete this workout?"
        body="This can’t be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={onConfirm}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByRole('dialog', { name: 'Delete this workout?' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('closes from cancel, backdrop, and Escape', () => {
    const onClose = vi.fn()
    const { rerender } = render(
      <ConfirmSheet
        open
        title="Discard this workout?"
        confirmLabel="Discard"
        onConfirm={vi.fn()}
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledTimes(1)

    rerender(
      <ConfirmSheet
        open
        title="Discard this workout?"
        confirmLabel="Discard"
        onConfirm={vi.fn()}
        onClose={onClose}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Close confirmation' }))
    expect(onClose).toHaveBeenCalledTimes(2)

    rerender(
      <ConfirmSheet
        open
        title="Discard this workout?"
        confirmLabel="Discard"
        onConfirm={vi.fn()}
        onClose={onClose}
      />,
    )
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('recovers when the confirmed action fails', async () => {
    const onClose = vi.fn()
    render(
      <ConfirmSheet
        open
        title="Restore backup?"
        confirmLabel="Restore"
        onConfirm={() => Promise.reject(new Error('restore failed'))}
        onClose={onClose}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Restore' }))

    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
    expect(screen.getByRole('button', { name: 'Restore' }).hasAttribute('disabled')).toBe(false)

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
