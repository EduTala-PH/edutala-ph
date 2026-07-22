import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAccessToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.post('/api/v1/auth/refresh')
      .then((res) => {
        if (res.success) {
          setAccessToken(res.data.access_token)
          setUser(res.data.user)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    setError(null)
    const res = await api.post('/api/v1/auth/login', { email, password })
    if (!res.success) {
      setError(res.error.message)
      return false
    }
    setAccessToken(res.data.access_token)
    setUser(res.data.user)
    navigate('/dashboard')
    return true
  }, [navigate])

  const signup = useCallback(async (email, password, name) => {
    setError(null)
    const res = await api.post('/api/v1/auth/register', { email, password, name })
    if (!res.success) {
      setError(res.error.message)
      return false
    }
    return true
  }, [])

  const logout = useCallback(async () => {
    await api.post('/api/v1/auth/logout')
    setAccessToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, error, setError, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
