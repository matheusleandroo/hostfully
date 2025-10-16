import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

export type Booking = {
  id: string
  guestName: string
  property: string
  notes?: string
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
}

export type BookingInput = {
  guestName: string
  property: string
  notes?: string
  startDate: Date | null
  endDate: Date | null
  id?: string
}

type Result<T> = { ok: true; data: T } | { ok: false; error: string }

const bookingSchema = z.object({
  id: z.string(),
  guestName: z.string().min(1),
  property: z.string().min(1),
  notes: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

const bookingsSchema = z.array(bookingSchema)

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart <= bEnd && bStart <= aEnd
}

function normalizeStr(v: string) {
  return (v ?? '').trim().replace(/\s+/g, ' ')
}

type State = {
  items: Booking[]
  isLoading: boolean
  error: string | null
  create: (input: BookingInput) => Promise<Result<Booking>>
  update: (id: string, input: BookingInput) => Promise<Result<Booking>>
  remove: (id: string) => Promise<Result<string>>
  clearError: () => void
}

const STORAGE_KEY = 'hostfully_bookings_v1'

export const useBookingsStore = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      async create(input) {
        set({ isLoading: true, error: null })
        try {
          const validation = validateInput(input)
          if (!validation.ok) return fail(validation.error)

          const now = new Date()
          const id =
            globalThis.crypto?.randomUUID?.() ??
            `${now.getTime()}-${Math.random().toString(16).slice(2)}`
          const newBooking: Booking = {
            id,
            guestName: normalizeStr(input.guestName),
            property: normalizeStr(input.property),
            notes: input.notes?.trim() || '',
            startDate: validation.data.start.toISOString(),
            endDate: validation.data.end.toISOString(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
          }

          const overlap = get().items.some(
            (b) =>
              b.property === newBooking.property &&
              rangesOverlap(
                new Date(b.startDate),
                new Date(b.endDate),
                validation.data.start,
                validation.data.end,
              ),
          )
          if (overlap)
            return fail(
              'This date range overlaps an existing booking for this property.',
            )

          const items = [newBooking, ...get().items]
          set({ items, isLoading: false })
          return ok(newBooking)
        } catch {
          set({ isLoading: false, error: 'Failed to create booking.' })
          return fail('Failed to create booking.')
        }
      },

      async update(id, input) {
        set({ isLoading: true, error: null })
        try {
          const existing = get().items.find((b) => b.id === id)
          if (!existing) return fail('Booking not found.')

          const validation = validateInput(input)
          if (!validation.ok) return fail(validation.error)

          const updated: Booking = {
            ...existing,
            guestName: normalizeStr(input.guestName),
            property: normalizeStr(input.property),
            notes: input.notes?.trim() || '',
            startDate: validation.data.start.toISOString(),
            endDate: validation.data.end.toISOString(),
            updatedAt: new Date().toISOString(),
          }

          const overlap = get().items.some(
            (b) =>
              b.id !== id &&
              b.property === updated.property &&
              rangesOverlap(
                new Date(b.startDate),
                new Date(b.endDate),
                new Date(updated.startDate),
                new Date(updated.endDate),
              ),
          )
          if (overlap)
            return fail(
              'This date range overlaps an existing booking for this property.',
            )

          const items = get().items.map((b) => (b.id === id ? updated : b))
          set({ items, isLoading: false })
          return ok(updated)
        } catch {
          set({ isLoading: false, error: 'Failed to update booking.' })
          return fail('Failed to update booking.')
        }
      },

      async remove(id) {
        set({ isLoading: true, error: null })
        try {
          const exists = get().items.some((b) => b.id === id)
          if (!exists) return fail('Booking not found.')

          set({
            items: get().items.filter((b) => b.id !== id),
            isLoading: false,
          })
          return ok(id)
        } catch {
          set({ isLoading: false, error: 'Failed to delete booking.' })
          return fail('Failed to delete booking.')
        }
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        try {
          const raw = (state as any)?.items
          const parsed = bookingsSchema.safeParse(raw)
          if (!parsed.success) {
            ;(state as any).items = []
          }
        } catch {
          // ignore
        }
      },
    },
  ),
)

function ok<T>(data: T): Result<T> {
  return { ok: true, data }
}

function fail<T = never>(error: string): Result<T> {
  return { ok: false, error }
}

function validateInput(
  input: BookingInput,
): Result<{ start: Date; end: Date }> {
  const guest = normalizeStr(input.guestName || '')
  const property = normalizeStr(input.property || '')
  if (!guest) return fail('Guest name is required.')
  if (!property) return fail('Property is required.')
  if (!input.startDate || !input.endDate)
    return fail('Start and end dates are required.')

  const start = new Date(input.startDate)
  const end = new Date(input.endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
    return fail('Invalid dates.')
  if (end < start) return fail('End date cannot be before start date.')

  const MAX_RANGE_DAYS = 365
  const diffDays = Math.ceil((+end - +start) / 86_400_000) + 1
  if (diffDays > MAX_RANGE_DAYS) return fail('Date range is too long.')

  return ok({ start, end })
}
