import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { DayPicker, DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export function DateRangePicker({
  startISO,
  endISO,
  onChange,
}: {
  startISO: string
  endISO: string
  onChange: (s: string, e: string) => void
}) {
  const [range, setRange] = useState<DateRange | undefined>({
    from: startISO ? parseISO(startISO) : undefined,
    to: endISO ? parseISO(endISO) : undefined,
  })
  useEffect(() => {
    if (range?.from && range?.to) {
      onChange(range.from.toISOString(), range.to.toISOString())
    }
  }, [range])
  return (
    <div className="card w-[fit-content]">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
      />
      <div className="text-sm text-slate-600 mt-2 flex gap-2">
        <span>Start: {range?.from ? format(range.from, 'PP') : '-'}</span>
        <span>End: {range?.to ? format(range.to, 'PP') : '-'}</span>
      </div>
    </div>
  )
}
