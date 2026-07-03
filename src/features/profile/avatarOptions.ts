import type { Gender } from '@/evolu/schema'

type BeardVariant = 'chin' | 'chinMoustache' | 'fullBeard' | 'longBeard' | 'moustacheTwirl'
type ClothesVariant = 'dress' | 'openJacket' | 'shirt' | 'tShirt' | 'turtleNeck'
type HairVariant = 'bun' | 'sideComed' | 'spiky' | 'undercut'
type RearHairVariant = 'longStraight' | 'longWavy' | 'neckHigh' | 'shoulderHigh'

export type ToonHeadOptions = {
  seed: string
  size: number
  backgroundColor: string[]
  borderRadius: number
  beardProbability?: number
  beardVariant?: BeardVariant[]
  clothesVariant?: ClothesVariant[]
  hairVariant?: HairVariant[]
  rearHairProbability?: number
  rearHairVariant?: RearHairVariant[]
}

export const toonHeadOptions = (seed: string, size: number, gender?: Gender): ToonHeadOptions => {
  const options: ToonHeadOptions = {
    seed,
    size,
    backgroundColor: ['16181a'],
    borderRadius: 28,
  }

  if (gender === 'male') {
    return {
      ...options,
      beardProbability: 45,
      beardVariant: ['chin', 'chinMoustache', 'fullBeard', 'longBeard', 'moustacheTwirl'],
      clothesVariant: ['openJacket', 'shirt', 'tShirt', 'turtleNeck'],
      hairVariant: ['sideComed', 'spiky', 'undercut'],
      rearHairProbability: 0,
    }
  }

  if (gender === 'female') {
    return {
      ...options,
      beardProbability: 0,
      clothesVariant: ['dress', 'openJacket', 'shirt', 'tShirt', 'turtleNeck'],
      hairVariant: ['bun', 'sideComed'],
      rearHairProbability: 75,
      rearHairVariant: ['longStraight', 'longWavy', 'neckHigh', 'shoulderHigh'],
    }
  }

  return options
}
