import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ResetPasswordForm from '../components/ResetPasswordForm'

export default function ResetPassword() {
  const { isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  return (
    <div className="fixed inset-0 flex">
      <div className="relative hidden lg:flex w-1/2 flex-col items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-brand via-brand-dark to-brand-darker">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-white-bright) 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, var(--color-white-bright) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Set a New Password</h1>
          <p className="text-lg text-slate-300 mb-10">
            Choose a strong password to secure your account
          </p>

          <div className="w-12 h-0.5 mx-auto mb-6 rounded-full" style={{ backgroundColor: 'var(--color-white-muted)' }} />
          <blockquote className="text-xl font-light leading-relaxed text-slate-200">
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <p className="mt-4 text-sm font-medium tracking-wider uppercase text-slate-400">— Nelson Mandela</p>
        </div>
      </div>

      <div className="@container w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-surface dark:to-surface-alt">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="w-full max-w-md text-center">
            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Invalid Reset Link</h2>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                This reset link is invalid or missing. Please request a new password reset.
              </p>
              <a
                href="/forgot-password"
                className="inline-block text-brand hover:text-brand-hover font-semibold transition-colors"
              >
                Request new reset link
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
