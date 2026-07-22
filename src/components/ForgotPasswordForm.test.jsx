import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ForgotPasswordForm from './ForgotPasswordForm'

vi.mock('../lib/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({
      success: true,
      message: 'Reset link sent',
    }),
  },
  setAccessToken: vi.fn(),
}))

function Wrapper({ children }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

function renderForm() {
  return render(<ForgotPasswordForm />, { wrapper: Wrapper })
}

describe('ForgotPasswordForm', () => {
  it('renders all form elements', () => {
    renderForm()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    expect(screen.getByText('Send Reset Link')).toBeInTheDocument()
    expect(screen.getByText('Remember your password?')).toBeInTheDocument()
  })

  it('shows validation error on empty submit', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByText('Send Reset Link'))
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('Email'), 'not-an-email')
    await user.click(screen.getByText('Send Reset Link'))
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
  })

  it('shows success state after submission', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('Email'), 'test@school.edu.ph')
    await user.click(screen.getByText('Send Reset Link'))
    await waitFor(() => {
      expect(screen.getByText('Check Your Email')).toBeInTheDocument()
    })
    expect(screen.getByText('Reset link sent!')).toBeInTheDocument()
    expect(screen.getByText('Back to login')).toBeInTheDocument()
  })

  it('renders back to login link with correct href', () => {
    renderForm()
    expect(screen.getByText('Back to login')).toHaveAttribute('href', '/login')
  })
})
