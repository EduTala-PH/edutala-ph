import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import ForgotPassword from './ForgotPassword'

vi.mock('../lib/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({ success: false }),
  },
  setAccessToken: vi.fn(),
}))

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
}

function renderPage() {
  return render(<ForgotPassword />, { wrapper: Wrapper })
}

describe('ForgotPassword page', () => {
  it('renders the page heading', () => {
    renderPage()
    expect(screen.getByText('Forgot Your Password?')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderPage()
    expect(screen.getByText(/No worries/)).toBeInTheDocument()
  })

  it('renders the quote', () => {
    renderPage()
    expect(screen.getByText(/Education is the most powerful weapon/)).toBeInTheDocument()
  })

  it('renders the form', () => {
    renderPage()
    expect(screen.getByText('Forgot Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByText('Send Reset Link')).toBeInTheDocument()
  })
})
