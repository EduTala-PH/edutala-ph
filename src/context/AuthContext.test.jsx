import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

vi.mock('../lib/api', () => ({
  api: {
    post: vi.fn().mockResolvedValue({
      success: true,
      data: { access_token: 'mock-token', user: { email: 'test@school.edu.ph', name: 'test' } },
    }),
  },
  setAccessToken: vi.fn(),
}))

function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <p data-testid="user">{user ? JSON.stringify(user) : 'null'}</p>
      <p data-testid="auth">{isAuthenticated ? 'true' : 'false'}</p>
      <button onClick={() => login('test@school.edu.ph', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
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
})
