import { useEffect, useState } from 'react'
import type { Gender } from '@/evolu/schema'
import { toonHeadOptions } from './avatarOptions'

const toonHeadSrc = async (seed: string, size: number, gender?: Gender): Promise<string> => {
  const [{ Avatar: DiceBearAvatar, Style }, toonHead] = await Promise.all([
    import('@dicebear/core'),
    import('@dicebear/styles/toon-head.json'),
  ])
  const toonHeadStyle = new Style(toonHead.default)
  return new DiceBearAvatar(toonHeadStyle, toonHeadOptions(seed, size, gender)).toDataUri()
}

/**
 * A generated Toon Head avatar from a profile's `avatarSeed`. DiceBear renders
 * the SVG locally from the seed, so profiles still sync as plain text and never
 * depend on a remote image service.
 */
export function Avatar({
  seed,
  gender,
  size = 44,
  className = '',
}: {
  seed: string
  gender?: Gender
  size?: number
  className?: string
}) {
  const [src, setSrc] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    setSrc(undefined)
    toonHeadSrc(seed, size, gender).then((uri) => {
      if (!cancelled) setSrc(uri)
    })
    return () => {
      cancelled = true
    }
  }, [seed, size, gender])

  return (
    <img
      src={src}
      alt="Profile avatar"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: size * 0.28, display: 'block' }}
    />
  )
}
