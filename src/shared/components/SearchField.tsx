import { Search } from 'lucide-react'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/** 50px pill search input with a leading icon, on an inset fill (SPEC §5.8). */
export function SearchField({ value, onChange, placeholder = 'Search exercises' }: SearchFieldProps) {
  return (
    <div className="flex h-[50px] items-center gap-[10px] rounded-full bg-inset px-[16px]">
      <Search size={19} strokeWidth={1.75} className="flex-none text-faint" />
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-faint focus:outline-none"
      />
    </div>
  )
}
