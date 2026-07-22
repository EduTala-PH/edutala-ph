import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import ForgotPassword from './ForgotPassword'
import { api } from '../lib/api'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

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

  it('redirects authenticated users to dashboard', async () => {
    api.post.mockResolvedValueOnce({
      success: true,
      data: {
        access_token: 'mock-token',
        user: { email: 'test@school.edu.ph', name: 'Test' },
      },
    })
    renderPage()
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })
})
