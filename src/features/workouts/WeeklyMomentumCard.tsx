import { useQuery } from '@evolu/react'
import { Flame } from 'lucide-react'
import { finishedSessionSets } from '@/evolu/queries'
import { Overline } from '@/shared/components/Overline'
import { formatVolume } from '@/shared/utils/units'
import { useUnits } from '@/shared/units/UnitsContext'
import { weeklyMomentum } from './weeklyMomentum'

/** Bar geometry — a 56px-tall track; active bars scale 10→38px across the week. */
const TRACK_PX = 56
const REST_PX = 5
const MIN_ACTIVE_PX = 10
const ACTIVE_RANGE_PX = 28

/**
 * Home "This week" card: the week's total volume, a day-streak flame pill, and
 * a Mon→Sun bar chart of daily training volume. Reads every finished set once
 * (the same query History uses) and buckets it by weekday.
 */
export function WeeklyMomentumCard() {
  const { unit } = useUnits()
  const sets = useQuery(finishedSessionSets)
  const week = weeklyMomentum(sets)
  const maxKg = Math.max(...week.days.map((d) => d.volumeKg), 0)

  return (
    <div className="mb-[26px] rounded-[22px] border border-white/[0.07] bg-surface p-[18px]">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <Overline className="mb-2">This week</Overline>
          <div className="flex items-baseline gap-[7px]">
            <span className="font-display text-[26px] font-bold tracking-tight text-white tnum">
              {formatVolume(week.totalKg, unit)}
            </span>
            <span className="text-[12.5px] font-medium text-muted">{unit} lifted</span>
          </div>
        </div>
        <div className="flex items-center gap-[6px] whitespace-nowrap rounded-full bg-neon/[0.12] px-[11px] py-[6px] text-[12.5px] font-semibold text-neon">
          <Flame size={15} strokeWidth={1.9} />
          {week.activeDays} {week.activeDays === 1 ? 'day' : 'days'}
        </div>
      </div>

      <div className="flex items-end justify-between gap-[7px]" style={{ height: TRACK_PX }}>
        {week.days.map((d, i) => {
          const height =
            d.active && maxKg > 0
              ? Math.round(MIN_ACTIVE_PX + (d.volumeKg / maxKg) * ACTIVE_RANGE_PX)
              : REST_PX
          const labelColor = d.isToday ? 'text-white' : d.active ? 'text-muted' : 'text-faint'
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className={`w-full max-w-[26px] rounded-[6px] ${d.active ? 'bg-neon' : 'bg-inset'}`}
                style={{ height }}
              />
              <div className={`text-[10px] font-semibold ${labelColor}`}>{d.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
