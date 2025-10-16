import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'
import { useBookingsStore } from '../store/bookingsStore'

describe('App snapshot', () => {
  it('matches', () => {
    const { getState, setState } = useBookingsStore
    setState({ ...getState(), items: [], isLoading: false, error: null }, true)
    const { container } = render(<App />)
    expect(container).toMatchSnapshot()
  })
})
