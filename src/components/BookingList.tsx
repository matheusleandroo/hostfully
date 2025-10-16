import { format, parseISO } from 'date-fns'
import type { Booking } from '../lib/types'

export function BookingList({
  items,
  onEdit,
  onDelete,
}: {
  items: Booking[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (!items.length)
    return (
      <p className="text-center text-slate-500 mt-8">
        No bookings yet. Create your first one above.
      </p>
    )
  return (
    <ul className="grid gap-3">
      {items.map((b) => (
        <li
          key={b.id}
          className="card flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:w-full md:max-w-full sm:w-[fit-content]"
        >
          <div>
            <h3 className="font-semibold">
              {b.propertyName} —{' '}
              <span className="text-slate-600">{b.guestName}</span>
            </h3>
            <p className="text-sm text-slate-600">
              {format(parseISO(b.startDate), 'PP')} →{' '}
              {format(parseISO(b.endDate), 'PP')}
            </p>
            {b.notes && (
              <p className="text-sm text-slate-500 mt-1">{b.notes}</p>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <button className="btn" onClick={() => onEdit(b.id)}>
              Edit
            </button>
            <button
              className="btn bg-red-500 text-white"
              onClick={() => onDelete(b.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
