import type { ReactNode } from 'react'
import { useQuery } from '@evolu/react'
import { finishedSessionSets } from '@/evolu/queries'
import { HeroStat } from '@/shared/components/HeroStat'
import { BarWeek, type BarWeekDay } from '@/shared/components/BarWeek'
import { PrChip, StreakChip, TrendChip } from '@/shared/components/Chips'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { weeklyMomentum } from './weeklyMomentum'
import { prsThisWeek, weekOverWeek } from './weeklyStats'

/**
 * Home hero (mock 1b): the week's total volume as the screen's one big number,
 * trend / PR / streak chips derived from the same finished-set data, and a
 * full-width Mon→Sun bar chart. Reads every finished set once (the query
 * History uses) — no boxed card, it sits directly on the black canvas.
 */
export function WeeklyMomentumCard() {
  const { unit } = useUnits()
  const sets = useQuery(finishedSessionSets)
  const week = weeklyMomentum(sets)
  const wow = weekOverWeek(sets)
  const prCount = prsThisWeek(sets)

  const days: BarWeekDay[] = week.days.map((d) => ({
    label: d.label,
    value: d.volumeKg,
    active: d.active,
    isToday: d.isToday,
  }))

  const chips: ReactNode[] = []
  if (wow.pct != null) {
    chips.push(
      <TrendChip key="wow" dir={wow.pct < 0 ? 'down' : 'up'}>
        {`${wow.pct > 0 ? '+' : ''}${wow.pct}% vs last week`}
      </TrendChip>,
    )
  }
  if (prCount > 0) {
    chips.push(<PrChip key="pr">{`${prCount} PR${prCount === 1 ? '' : 's'}`}</PrChip>)
  }
  if (week.activeDays > 0) {
    chips.push(
      <StreakChip key="streak">
        {`${week.activeDays} ${week.activeDays === 1 ? 'day' : 'days'}`}
      </StreakChip>,
    )
  }

  return (
    <section className="mb-7">
      <HeroStat
        intro="This week you’ve lifted"
        value={formatVolume(week.totalKg, unit)}
        unit={unit}
        chips={chips.length > 0 ? chips : undefined}
      />
      <BarWeek days={days} className="mt-7" />
    </section>
  )
}
