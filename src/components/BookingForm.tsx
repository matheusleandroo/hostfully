import { useEffect, useState } from 'react'
import { Field } from './Field'
import { DateRangePicker } from './DateRange'
import type { Booking } from '../lib/types'

type Props = {
  initial?: Booking
  onSubmit: (data: Omit<Booking, 'id'>) => boolean
  onCancel?: () => void
}
export function BookingForm({ initial, onSubmit, onCancel }: Props) {
  const [guestName, setGuestName] = useState(initial?.guestName ?? '')
  const [propertyName, setPropertyName] = useState(initial?.propertyName ?? '')
  const [startDate, setStart] = useState(
    initial?.startDate ?? new Date().toISOString(),
  )
  const [endDate, setEnd] = useState(
    initial?.endDate ?? new Date(Date.now() + 86400000).toISOString(),
  )
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const reseteFields = () => {
    setGuestName('')
    setPropertyName('')
    setStart(new Date().toISOString())
    setEnd(new Date(Date.now() + 86400000).toISOString())
    setNotes('')
  }

  useEffect(() => {
    if (initial) {
      setGuestName(initial.guestName)
      setPropertyName(initial.propertyName)
      setStart(initial.startDate)
      setEnd(initial.endDate)
      setNotes(initial.notes ?? '')
    }
  }, [initial])

  return (
    <form
      className="card grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        const response = onSubmit({
          guestName,
          propertyName,
          startDate,
          endDate,
          notes,
        })

        if (response) reseteFields()
      }}
    >
      <h2 className="text-xl font-bold">
        Booking {initial ? 'Edit' : 'Create'}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Guest name *">
          <input
            className="input"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </Field>
        <Field label="Property *">
          <input
            className="input"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            placeholder="Beach House"
            required
          />
        </Field>
      </div>
      <div className="grid gap-2">
        <span className="label">Dates</span>
        <DateRangePicker
          startISO={startDate}
          endISO={endDate}
          onChange={(s, e) => {
            setStart(s)
            setEnd(e)
          }}
        />
      </div>
      <Field label="Notes">
        <textarea
          className="input min-h-24"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
        />
      </Field>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              reseteFields()
              onCancel()
            }}
          >
            Cancel
          </button>
        )}
        <button className="btn-primary" type="submit">
          {initial ? 'Save changes' : 'Create booking'}
        </button>
      </div>
    </form>
  )
}
