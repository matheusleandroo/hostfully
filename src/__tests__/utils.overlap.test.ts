import { overlaps, isInvalidRange } from '../lib/utils'
const mk = (s: string, e: string) => ({
  id: '1',
  guestName: 'g',
  propertyName: 'p',
  startDate: s,
  endDate: e,
})

test('detects overlap when ranges intersect', () => {
  expect(
    overlaps(
      mk('2024-01-01T00:00:00.000Z', '2024-01-10T00:00:00.000Z'),
      mk('2024-01-05T00:00:00.000Z', '2024-01-12T00:00:00.000Z'),
    ),
  ).toBe(true)
})
test('no overlap when ranges are disjoint', () => {
  expect(
    overlaps(
      mk('2024-01-01T00:00:00.000Z', '2024-01-10T00:00:00.000Z'),
      mk('2024-01-11T00:00:00.000Z', '2024-01-12T00:00:00.000Z'),
    ),
  ).toBe(false)
})
test('end before start is invalid', () => {
  expect(
    isInvalidRange('2024-01-10T00:00:00.000Z', '2024-01-01T00:00:00.000Z'),
  ).toBe(true)
})
