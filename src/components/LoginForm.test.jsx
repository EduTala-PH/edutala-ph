import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import LoginForm from './LoginForm'

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
}

function renderForm() {
  return render(<LoginForm />, { wrapper: Wrapper })
}

describe('LoginForm', () => {
  it('renders all form fields', () => {
    renderForm()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByText('Remember me')).toBeInTheDocument()
    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('shows brand name', () => {
    renderForm()
    expect(screen.getByText('EduTala PH')).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByText('Login'))
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.type(screen.getByLabelText('Email'), 'test@school.edu.ph')
    await user.type(screen.getByLabelText('Password'), '123')
    await user.click(screen.getByText('Login'))
    expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
  })

  it('renders forgot password link with correct href', () => {
    renderForm()
    expect(screen.getByText('Forgot password?')).toHaveAttribute(
      'href',
      '/forgot-password',
    )
  })

  it('renders sign up link with correct href', () => {
    renderForm()
    expect(screen.getByText('Sign up')).toHaveAttribute('href', '/signup')
  })
})
