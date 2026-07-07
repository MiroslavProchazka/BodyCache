// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider, useToast } from './Toast'

function ToastHarness({ onAction }: { onAction: () => void }) {
  const { showToast } = useToast()
  return (
    <button
      type="button"
      onClick={() =>
        showToast('Copied last workout', {
          action: { label: 'Undo', onClick: onAction },
          durationMs: 5000,
        })
      }
    >
      Show toast
    </button>
  )
}

describe('ToastProvider', () => {
  afterEach(cleanup)

  it('renders an action and dismisses when the action is invoked', () => {
    const onAction = vi.fn()
    render(
      <ToastProvider>
        <ToastHarness onAction={onAction} />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Show toast' }))
    expect(screen.getByText('Copied last workout')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Copied last workout')).toBeNull()
  })
})
