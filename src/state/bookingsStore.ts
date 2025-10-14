import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from './nanoid'
import type { Booking } from '../lib/types'
import { overlaps, isInvalidRange } from '../lib/utils'

type State = {
  bookings: Booking[]
}
type Actions = {
  create: (
    b: Omit<Booking, 'id'>,
  ) => { ok: true; id: string } | { ok: false; reason: string }
  update: (
    id: string,
    b: Omit<Booking, 'id'>,
  ) => { ok: true } | { ok: false; reason: string }
  remove: (id: string) => void
  findById: (id: string) => Booking | undefined
}

export const useBookingsStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      bookings: [],
      create: (b) => {
        if (isInvalidRange(b.startDate, b.endDate)) {
          return { ok: false, reason: 'End date must be after start date' }
        }
        const newBooking: Booking = { id: nanoid(), ...b }
        const conflict = get().bookings.some(
          (existing) =>
            existing.propertyName === b.propertyName &&
            overlaps(existing, newBooking),
        )
        if (conflict)
          return {
            ok: false,
            reason: 'Overlapping booking on the same property',
          }
        set((s) => ({ bookings: [newBooking, ...s.bookings] }))
        return { ok: true, id: newBooking.id }
      },
      update: (id, b) => {
        if (isInvalidRange(b.startDate, b.endDate)) {
          return { ok: false, reason: 'End date must be after start date' }
        }
        const updated: Booking = { id, ...b }
        const conflict = get().bookings.some(
          (existing) =>
            existing.id !== id &&
            existing.propertyName === b.propertyName &&
            overlaps(existing, updated),
        )
        if (conflict)
          return {
            ok: false,
            reason: 'Overlapping booking on the same property',
          }
        set((s) => ({
          bookings: s.bookings.map((x) => (x.id === id ? updated : x)),
        }))
        return { ok: true }
      },
      remove: (id) =>
        set((s) => ({ bookings: s.bookings.filter((x) => x.id !== id) })),
      findById: (id) => get().bookings.find((b) => b.id === id),
    }),
    { name: 'bookings-store' },
  ),
)
