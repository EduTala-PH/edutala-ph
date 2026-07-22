import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

const mockPost = vi.hoisted(() => vi.fn())

vi.mock('../lib/api', () => ({
  api: { post: mockPost },
  setAccessToken: vi.fn(),
}))

function TestComponent() {
  const { user, isAuthenticated, login, logout, signup, error } = useAuth()
  return (
    <div>
      <p data-testid="user">{user ? JSON.stringify(user) : 'null'}</p>
      <p data-testid="auth">{isAuthenticated ? 'true' : 'false'}</p>
      <p data-testid="error">{error || 'no error'}</p>
      <button onClick={() => login('test@school.edu.ph', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => signup('new@school.edu.ph', 'password', 'New User')}>Signup</button>
    </div>
  )
}

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  mockPost.mockReset()
  mockPost.mockResolvedValue({
    success: true,
    data: { access_token: 'mock-token', user: { email: 'test@school.edu.ph', name: 'test' } },
  })
})

describe('AuthContext', () => {
  it('throws when useAuth is used outside AuthProvider', () => {
    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within AuthProvider',
    )
  })

  it('provides initial unauthenticated state', () => {
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    )
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('auth')).toHaveTextContent('false')
    expect(screen.getByTestId('error')).toHaveTextContent('no error')
  })

  it('sets user on login', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    )
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByTestId('user')).toHaveTextContent(
      JSON.stringify({ email: 'test@school.edu.ph', name: 'test' }),
    )
    expect(screen.getByTestId('auth')).toHaveTextContent('true')
  })

  it('clears user on logout', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    )
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByTestId('auth')).toHaveTextContent('true')
    await user.click(screen.getByRole('button', { name: 'Logout' }))
    expect(screen.getByTestId('user')).toHaveTextContent('null')
    expect(screen.getByTestId('auth')).toHaveTextContent('false')
  })

  it('sets error on login failure', async () => {
    mockPost
      .mockReset()
      .mockResolvedValueOnce({ success: true, data: { access_token: 't', user: { email: 'e', name: 'n' } } })
      .mockResolvedValueOnce({ success: false, error: { message: 'Invalid credentials' } })
    const user = userEvent.setup()
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    )
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials')
  })

  it('clears previous error on login attempt', async () => {
    mockPost
      .mockReset()
      .mockResolvedValueOnce({ success: true, data: { access_token: 't', user: { email: 'e', name: 'n' } } })
      .mockResolvedValueOnce({ success: false, error: { message: 'First error' } })
      .mockResolvedValueOnce({ success: false, error: { message: 'Second error' } })
    const user = userEvent.setup()
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    )
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByTestId('error')).toHaveTextContent('First error')
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(screen.getByTestId('error')).toHaveTextContent('Second error')
  })

  it('calls signup with correct arguments', async () => {
    const user = userEvent.setup()
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    )
    await user.click(screen.getByRole('button', { name: 'Signup' }))
    expect(mockPost).toHaveBeenCalledWith('/api/v1/auth/register', {
      email: 'new@school.edu.ph',
      password: 'password',
      name: 'New User',
    })
  })

  it('sets error on signup failure', async () => {
    mockPost
      .mockReset()
      .mockResolvedValueOnce({ success: true, data: { access_token: 't', user: { email: 'e', name: 'n' } } })
      .mockResolvedValueOnce({ success: false, error: { message: 'Email already exists' } })
    const user = userEvent.setup()
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    )
    await user.click(screen.getByRole('button', { name: 'Signup' }))
    expect(screen.getByTestId('error')).toHaveTextContent('Email already exists')
  })
})
