import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AdminLogin from './pages/AdminLogin'

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    </AuthProvider>
  )
}
