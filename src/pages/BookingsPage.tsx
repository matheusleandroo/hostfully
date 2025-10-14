import { useMemo, useState } from 'react'
import { BookingForm } from '../components/BookingForm'
import { BookingList } from '../components/BookingList'
import { useBookingsStore } from '../state/bookingsStore'
import { toast } from 'react-toastify'

export function BookingsPage() {
  const { bookings, create, update, remove, findById } = useBookingsStore()
  const [editingId, setEditingId] = useState<string | null>(null)

  const onCreate = (data: any): boolean => {
    const res = create(data)
    if (!res.ok) {
      toast.error(
        'There was a problem creating the reservation, please try again.',
      )
      console.error(res.reason)
      return false
    }
    toast.success('Reservation created successfully!')

    return true
  }
  const onUpdate = (data: any): boolean => {
    if (!editingId) return false
    const res = update(editingId, data)
    if (!res.ok) {
      toast.error(
        'There was a problem updating your reservation, please try again.',
      )
      console.error(res.reason)
      return false
    }
    toast.success('Reservation updated successfully!')
    setEditingId(null)
    return true
  }

  const onDelete = (id: string): boolean => {
    try {
      remove(id)

      toast.success('Reservation deleted successfully!')
      return true
    } catch (error) {
      toast.error(
        'There was a problem deleting your reservation, please try again.',
      )
      console.error(error)
      return false
    }
  }

  const editing = useMemo(
    () => (editingId ? findById(editingId) : undefined),
    [editingId, bookings],
  )

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 grid gap-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Bookings Manager
        </h1>
        <p className="text-slate-600">
          Create, read, update and delete bookings with validation & overlaps
          prevention.
        </p>
      </header>

      <section>
        <BookingForm
          initial={editing}
          onSubmit={editing ? onUpdate : onCreate}
          onCancel={editing ? () => setEditingId(null) : undefined}
        />
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">All bookings</h2>
        <BookingList
          items={bookings}
          onEdit={setEditingId}
          onDelete={onDelete}
        />
      </section>

      <footer className="text-center text-xs text-slate-500 py-6">
        Built with love by{' '}
        <a
          href="https://matheusleandro.com/"
          className="text-cyan-900"
          target="_blank"
        >
          Matheus
        </a>
        .
      </footer>
    </div>
  )
}
