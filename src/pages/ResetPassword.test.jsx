import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import ResetPassword from './ResetPassword'
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
  return <MemoryRouter>{children}</MemoryRouter>
}

function WrapperWithToken({ children }) {
  return <MemoryRouter initialEntries={['/reset-password?token=test-token']}>{children}</MemoryRouter>
}

function renderPage(hasToken) {
  const W = hasToken === false ? Wrapper : WrapperWithToken
  return render(
    <AuthProvider>
      <ResetPassword />
    </AuthProvider>,
    { wrapper: W },
  )
}

describe('ResetPassword page', () => {
  it('renders the page heading', () => {
    renderPage()
    expect(screen.getByText('Set a New Password')).toBeInTheDocument()
  })

  it('renders the form when token is present', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument()
    expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument()
  })

  it('shows error state when token is missing', () => {
    renderPage(false)
    expect(screen.getByText('Invalid Reset Link')).toBeInTheDocument()
    expect(screen.getByText('Request new reset link')).toBeInTheDocument()
  })

  it('renders the quote', () => {
    renderPage()
    expect(screen.getByText(/Education is the most powerful weapon/)).toBeInTheDocument()
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
