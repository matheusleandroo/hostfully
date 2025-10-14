import { act } from 'react'
import { useBookingsStore } from '../state/bookingsStore'

function snapshot() {
  return useBookingsStore.getState().bookings
}

test('CRUD with overlap prevention', () => {
  const s = useBookingsStore
  let res = s.getState().create({
    guestName: 'A',
    propertyName: 'Beach',
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-01-05T00:00:00.000Z',
  })
  expect(res.ok).toBe(true)
  const idA = (res as any).id
  res = s.getState().create({
    guestName: 'B',
    propertyName: 'Beach',
    startDate: '2024-01-03T00:00:00.000Z',
    endDate: '2024-01-06T00:00:00.000Z',
  })
  expect(res.ok).toBe(false)
  res = s.getState().create({
    guestName: 'C',
    propertyName: 'Mountain',
    startDate: '2024-01-03T00:00:00.000Z',
    endDate: '2024-01-06T00:00:00.000Z',
  })
  expect(res.ok).toBe(true)

  const upd = s.getState().update(idA, {
    guestName: 'A2',
    propertyName: 'Beach',
    startDate: '2024-01-02T00:00:00.000Z',
    endDate: '2024-01-04T00:00:00.000Z',
  })
  expect(upd.ok).toBe(true)

  act(() => s.getState().remove(idA))
  expect(snapshot().find((x) => x.id === idA)).toBeUndefined()
})
