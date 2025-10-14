import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BookingForm } from '../components/BookingForm'

test('submits with required fields', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render((<BookingForm onSubmit={onSubmit} />) as any)
  await user.clear(screen.getByPlaceholderText('John Doe'))
  await user.type(screen.getByPlaceholderText('John Doe'), 'Jane')
  await user.clear(screen.getByPlaceholderText('Beach House'))
  await user.type(screen.getByPlaceholderText('Beach House'), 'Villa')
  await user.click(screen.getByRole('button', { name: /create booking/i }))
  expect(onSubmit).toHaveBeenCalled()
})
