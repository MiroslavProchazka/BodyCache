/** One of the three inset stat tiles (big number + small label). */
export function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 rounded-2xl bg-inset px-[13px] py-3 text-center">
      <div className="font-display text-[22px] font-semibold leading-none tnum text-white">
        {value}
      </div>
      <div className="mt-1 text-[11.5px] text-muted">{label}</div>
    </div>
  )
}
