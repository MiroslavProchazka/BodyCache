import { useMemo } from 'react'
import { useQuery } from '@evolu/react'
import { completedSetsIndex } from '@/evolu/queries'
import { buildLastPerformanceIndex, type ExercisePerformanceSummary } from './lastPerformance'

/**
 * The per-exercise last-performance map, computed once per page from a single
 * `completedSetsIndex` query. Pages call this and hand each card/row its summary
 * as a prop, so no card runs a query of its own (see `lastPerformance.ts`).
 */
export const useLastPerformanceIndex = (): ReadonlyMap<
  string,
  ExercisePerformanceSummary
> => {
  const rows = useQuery(completedSetsIndex)
  return useMemo(() => buildLastPerformanceIndex(rows), [rows])
}
