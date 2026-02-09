import { toKg, type WeightUnit } from './units'

export type MetricSet = {
  reps: number | null
  weight: number | null
  unit: WeightUnit
}

export const calcSetVolume = (setEntry: MetricSet) => {
  if (!setEntry.reps || !setEntry.weight) return 0
  return setEntry.reps * toKg(setEntry.weight, setEntry.unit)
}

export const calcSessionVolume = (sets: MetricSet[]) => sets.reduce((sum, setEntry) => sum + calcSetVolume(setEntry), 0)

export const weeklyBuckets = (values: Array<{ weekStart: string; volume: number }>) => {
  const map = new Map<string, number>()
  for (const item of values) {
    map.set(item.weekStart, (map.get(item.weekStart) ?? 0) + item.volume)
  }
  return [...map.entries()].map(([weekStart, volume]) => ({ weekStart, volume }))
}
