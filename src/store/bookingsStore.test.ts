import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBookingsStore } from './bookingsStore'

function d(s: string) {
  return new Date(s)
}

describe('bookingsStore', () => {
  beforeEach(() => {
    const { getState, setState } = useBookingsStore
    setState({ ...getState(), items: [], isLoading: false, error: null }, true)
    vi.stubGlobal('crypto', { randomUUID: () => 'id-1' } as any)
  })

  it('creates a valid booking', async () => {
    const res = await useBookingsStore.getState().create({
      guestName: 'A',
      property: 'P',
      startDate: d('2025-10-16'),
      endDate: d('2025-10-16'),
    })
    expect(res.ok).toBe(true)
  })

  it('fails when end < start', async () => {
    const r = await useBookingsStore.getState().create({
      guestName: 'A',
      property: 'P',
      startDate: d('2025-10-18'),
      endDate: d('2025-10-16'),
    })
    expect(r.ok).toBe(false)
  })

  it('prevents overlap on same property (inclusive end)', async () => {
    await useBookingsStore.getState().create({
      guestName: 'A',
      property: 'P',
      startDate: d('2025-10-16'),
      endDate: d('2025-10-18'),
    })
    const r = await useBookingsStore.getState().create({
      guestName: 'B',
      property: 'P',
      startDate: d('2025-10-18'),
      endDate: d('2025-10-19'),
    })
    expect(r.ok).toBe(false)
  })

  it('allows single-day ranges', async () => {
    const r = await useBookingsStore.getState().create({
      guestName: 'A',
      property: 'P',
      startDate: d('2025-10-16'),
      endDate: d('2025-10-16'),
    })
    expect(r.ok).toBe(true)
  })
})
