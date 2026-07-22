import { useEffect } from 'react'
import AdminLoginForm from '../components/AdminLoginForm'

export default function AdminLogin() {
  useEffect(() => {
    document.title = 'Admin | EduTala PH'
  }, [])
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-surface dark:to-surface-alt">
      <AdminLoginForm />
    </div>
  )
}
