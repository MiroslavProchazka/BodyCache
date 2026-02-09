import { calcSetVolume, type MetricSet } from './metrics'

type PrCandidate = MetricSet & { id: string }

export const bestByVolume = (sets: PrCandidate[]) => {
  return sets.reduce<PrCandidate | null>((best, candidate) => {
    if (!best) return candidate
    return calcSetVolume(candidate) > calcSetVolume(best) ? candidate : best
  }, null)
}
