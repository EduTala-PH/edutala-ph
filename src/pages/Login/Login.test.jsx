import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AuthProvider } from '../../context/AuthContext'
import Login from './Login'

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <AuthProvider>{children}</AuthProvider>
    </MemoryRouter>
  )
}

function renderPage() {
  return render(<Login />, { wrapper: Wrapper })
}

describe('Login page', () => {
  it('renders EduTala PH branding', () => {
    renderPage()
    expect(screen.getByText('EduTala PH')).toBeInTheDocument()
  })

  it('renders the quote', () => {
    renderPage()
    expect(screen.getByText(/Education is the most powerful weapon/)).toBeInTheDocument()
  })

  it('renders the logo', () => {
    renderPage()
    expect(screen.getByAltText('EduTala PH')).toBeInTheDocument()
  })

  it('renders the welcome heading', () => {
    renderPage()
    expect(screen.getByText('Welcome to EduTala PH')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    renderPage()
    expect(screen.getByText('Empowering Philippine education through innovative technology')).toBeInTheDocument()
  })
})
