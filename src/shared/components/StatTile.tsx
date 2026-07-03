/**
 * One of the three inset stat tiles (big number + small label).
 *
 * @deprecated 1b redesign — boxed stat tiles are being replaced by the single
 * `HeroStat` number plus `·`-separated meta rows. Do not use in new/restyled
 * screens; kept only until every consumer migrates.
 */
export function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-inset px-[13px] py-3">
      <div className="font-display text-[22px] font-semibold leading-none tnum text-white">
        {value}
      </div>
      <div className="mt-1 text-[11.5px] text-muted">{label}</div>
    </div>
  )
}
