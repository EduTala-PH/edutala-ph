import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ResetPasswordForm from './ResetPasswordForm'
import { api } from '../../lib/api'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../lib/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({
      success: true,
      message: 'Password reset successfully',
    }),
  },
  setAccessToken: vi.fn(),
}))

function Wrapper({ children }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

function renderForm(props = {}) {
  return render(<ResetPasswordForm token="test-token-123" {...props} />, { wrapper: Wrapper })
}

describe('ResetPasswordForm', () => {
  it('renders all form elements', () => {
    renderForm()
    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument()
    expect(screen.getByText('Back to login')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: 'Reset Password' }))
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('New Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm New Password'), 'different')
    await user.click(screen.getByRole('button', { name: 'Reset Password' }))
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })

  it('navigates to login on successful reset', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('New Password'), 'newpassword123')
    await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123')
    await user.click(screen.getByRole('button', { name: 'Reset Password' }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderForm()
    const passwordInput = screen.getByLabelText('New Password')
    expect(passwordInput).toHaveAttribute('type', 'password')
    const toggleButton = document.querySelector('button[tabindex="-1"]')
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('renders back to login link with correct href', () => {
    renderForm()
    expect(screen.getByText('Back to login')).toHaveAttribute('href', '/login')
  })

  it('shows API error on reset failure', async () => {
    api.post.mockResolvedValueOnce({
      success: false,
      error: { message: 'Invalid or expired token' },
    })
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('New Password'), 'newpassword123')
    await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123')
    await user.click(screen.getByRole('button', { name: 'Reset Password' }))
    await waitFor(() => {
      expect(screen.getByText('Invalid or expired token')).toBeInTheDocument()
    })
  })

  it('shows default error on reset failure without message', async () => {
    api.post.mockResolvedValueOnce({
      success: false,
      error: {},
    })
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('New Password'), 'newpassword123')
    await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123')
    await user.click(screen.getByRole('button', { name: 'Reset Password' }))
    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
    })
  })
})
