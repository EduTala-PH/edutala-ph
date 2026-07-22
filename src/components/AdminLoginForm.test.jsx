import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import AdminLoginForm from './AdminLoginForm'

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
}

function renderForm() {
  return render(<AdminLoginForm />, { wrapper: Wrapper })
}

describe('AdminLoginForm', () => {
  it('renders all form fields', () => {
    renderForm()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('renders brand heading', () => {
    renderForm()
    expect(screen.getByText('Admin Control')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByText('Sign in'))
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('Email'), 'admin@edutala.ph')
    await user.type(screen.getByLabelText('Password'), '123')
    await user.click(screen.getByText('Sign in'))
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('renders back to client login link', () => {
    renderForm()
    expect(screen.getByText('Back to client login')).toHaveAttribute('href', '/login')
  })

  it('does not render remember me checkbox', () => {
    renderForm()
    expect(screen.queryByText('Remember me')).not.toBeInTheDocument()
  })
})
