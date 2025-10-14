import { isBefore, isEqual, parseISO } from 'date-fns'
import type { Booking } from './types'

export function overlaps(a: Booking, b: Booking) {
  const aStart = parseISO(a.startDate)
  const aEnd = parseISO(a.endDate)
  const bStart = parseISO(b.startDate)
  const bEnd = parseISO(b.endDate)
  return (
    (isBefore(aStart, bEnd) || isEqual(aStart, bEnd)) &&
    (isBefore(bStart, aEnd) || isEqual(bStart, aEnd))
  )
}

export function isInvalidRange(startISO: string, endISO: string) {
  const s = parseISO(startISO)
  const e = parseISO(endISO)
  return isBefore(e, s)
}
