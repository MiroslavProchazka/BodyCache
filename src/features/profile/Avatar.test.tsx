// @vitest-environment happy-dom
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders a deterministic Toon Head image from the seed', async () => {
    const { rerender } = render(<Avatar seed="alex" size={52} />)

    const avatar = screen.getByAltText('Profile avatar') as HTMLImageElement
    await waitFor(() => expect(avatar.src).toContain('data:image/svg+xml'))
    const src = avatar.src
    expect(avatar.width).toBe(52)
    expect(avatar.height).toBe(52)

    rerender(<Avatar seed="alex" size={52} />)
    await waitFor(() =>
      expect((screen.getByAltText('Profile avatar') as HTMLImageElement).src).toBe(src),
    )

    rerender(<Avatar seed="sam" size={52} />)
    await waitFor(() =>
      expect((screen.getByAltText('Profile avatar') as HTMLImageElement).src).not.toBe(src),
    )
  })
})
