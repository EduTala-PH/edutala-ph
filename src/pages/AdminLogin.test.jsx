import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import AdminLogin from './AdminLogin'

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
}

function renderPage() {
  return render(<AdminLogin />, { wrapper: Wrapper })
}

describe('AdminLogin page', () => {
  it('renders Admin Control heading', () => {
    renderPage()
    expect(screen.getByText('Admin Control')).toBeInTheDocument()
  })

  it('renders email and password fields', () => {
    renderPage()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders sign in button', () => {
    renderPage()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('renders back link to client login', () => {
    renderPage()
    expect(screen.getByText('Back to client login')).toBeInTheDocument()
  })
})
