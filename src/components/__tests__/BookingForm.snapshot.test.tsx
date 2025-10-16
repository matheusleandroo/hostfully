import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { useBookingsStore } from '../../store/bookingsStore'
import { BookingForm } from '../BookingForm'

describe('BookingForm basic render', () => {
  let originalConsoleError: typeof console.error

  beforeAll(() => {
    originalConsoleError = console.error.bind(console)

    vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      const first = args[0]
      if (
        typeof first === 'string' &&
        first.includes(
          'A component is changing a controlled input to be uncontrolled',
        )
      ) {
        return
      }
      originalConsoleError(...(args as [unknown, ...unknown[]]))
    })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it('shows required fields and primary action', () => {
    const { getState, setState } = useBookingsStore
    setState({ ...getState(), items: [], isLoading: false, error: null }, true)

    const initial: any = {
      guestName: '',
      property: '',
      notes: '',
      startDate: null,
      endDate: null,
    }

    const onSubmit = vi.fn()
    const onCancel = vi.fn()

    render(
      (
        <BookingForm
          initial={initial}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ) as any,
    )

    expect(screen.getByText(/Guest name/i)).toBeInTheDocument()
    expect(screen.getByText(/Property/i)).toBeInTheDocument()
    expect(screen.getByText(/Dates/i)).toBeInTheDocument()
    expect(screen.getByText(/Notes/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /Create booking|Save changes/i }),
    ).toBeInTheDocument()
  })
})
