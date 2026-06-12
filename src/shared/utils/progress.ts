/**
 * Progress-chart data shaping — pure and UI-free (see `progress.test.ts`).
 *
 * Turns an exercise's logged history into one point per session (oldest →
 * newest) using that session's top working set's primary metric, and maps those
 * values into SVG coordinates for a simple line chart.
 */
import type { ExerciseType } from '@/evolu/schema'
import {
  bestSet,
  groupSessions,
  primaryMetric,
  workingSets,
  type HistorySet,
} from './exerciseStats'

/** One charted session: when it happened and the metric value to plot. */
export interface ProgressPoint {
  readonly sessionId: string
  readonly startedAt: string
  readonly value: number
}

/**
 * One point per session, oldest first, using the top working set's primary
 * metric (weight for strength, reps for bodyweight, etc.). Warm-ups are
 * excluded; sessions without a loggable top set are dropped.
 */
export const progressSeries = (
  history: readonly HistorySet[],
  type: ExerciseType,
): ProgressPoint[] => {
  const groups = groupSessions(history).slice().reverse() // oldest → newest
  const points: ProgressPoint[] = []
  for (const g of groups) {
    const top = bestSet(workingSets(g.sets), type)
    if (!top) continue
    const value = primaryMetric(top, type)
    if (value > 0) points.push({ sessionId: g.sessionId, startedAt: g.startedAt, value })
  }
  return points
}

/** A point in SVG coordinate space. */
export interface XYPoint {
  readonly x: number
  readonly y: number
}

const round = (n: number): number => Math.round(n * 100) / 100

/**
 * Map values to SVG coordinates in a `width`×`height` box (with `pad` inset).
 * X is evenly spaced; Y scales min→max to the box and is inverted so larger
 * values sit higher. A single point (or all-equal values) is centred vertically.
 */
export const scalePoints = (
  values: readonly number[],
  width: number,
  height: number,
  pad = 0,
): XYPoint[] => {
  const n = values.length
  if (n === 0) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  const innerW = width - pad * 2
  const innerH = height - pad * 2
  return values.map((v, i) => {
    const x = n === 1 ? pad + innerW / 2 : pad + (innerW * i) / (n - 1)
    const t = span === 0 ? 0.5 : (v - min) / span
    return { x: round(x), y: round(pad + innerH * (1 - t)) }
  })
}

/** An SVG path `d` string ("M … L …") through the given points. */
export const linePath = (points: readonly XYPoint[]): string =>
  points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ')
