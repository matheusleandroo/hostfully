import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import { useBookingsStore } from '../store/bookingsStore'

describe('App integration (store + list rendering)', () => {
  it('renders list from store and prevents overlap via store actions', async () => {
    const { getState, setState } = useBookingsStore
    setState({ ...getState(), items: [], isLoading: false, error: null }, true)

    await useBookingsStore.getState().create({
      guestName: 'John Doe',
      property: 'Beach House',
      startDate: new Date('2025-10-16'),
      endDate: new Date('2025-10-18'),
      notes: 'Notes 1',
    })

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: /Bookings Manager/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Booking Create/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /All bookings/i }),
    ).toBeInTheDocument()

    expect(useBookingsStore.getState().items).toHaveLength(1)

    const res = await useBookingsStore.getState().create({
      guestName: 'Jane',
      property: 'Beach House',
      startDate: new Date('2025-10-18'),
      endDate: new Date('2025-10-19'),
      notes: 'overlap attempt',
    })
    expect(res.ok).toBe(false)
    expect(useBookingsStore.getState().items).toHaveLength(1)
  })
})
