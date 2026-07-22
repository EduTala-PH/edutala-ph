import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { api } from '../../lib/api'
import { cn } from '../../lib/utils'
import logo from '../../assets/EduTalaPH_Logo.png'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

export default function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [apiError, setApiError] = useState(null)
  const timerRef = useRef(null)
  const submittedEmailRef = useRef('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startCooldown = () => {
    setCooldown(60)
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const onSubmit = async (data) => {
    setApiError(null)
    const res = await api.post('/api/v1/auth/forgot-password', { email: data.email })
    if (!res.success) {
      setApiError(res.error?.message || 'Something went wrong. Please try again.')
      return
    }
    submittedEmailRef.current = data.email
    setSubmitted(true)
    startCooldown()
  }

  const handleResend = async () => {
    setApiError(null)
    const res = await api.post('/api/v1/auth/forgot-password', { email: submittedEmailRef.current })
    if (!res.success) {
      setApiError(res.error?.message || 'Something went wrong. Please try again.')
      return
    }
    startCooldown()
  }

  const inputClass = 'input'
  const errorClass = cn(
    'text-red-400 dark:text-red-500 text-sm',
    'mt-1.5',
    'flex items-center gap-1',
  )
  const labelClass = cn(
    'block',
    'text-sm font-semibold text-gray-700 dark:text-text-muted',
    'mb-1.5',
  )

  if (submitted) {
    return (
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <img src={logo} alt="EduTala PH" className="h-16 sm:h-20 mx-auto mb-2 sm:mb-3" />
          <h2 className="text-xl sm:text-2xl tracking-tight text-gray-900 dark:text-text font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Check Your Email</h2>
        </div>

        <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-center">
          <div className="mb-4">
            <svg className="w-12 h-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-green-800 dark:text-green-300 font-medium mb-2">
            Reset link sent!
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            If an account with that email exists, we've sent a password reset link.
            Please check your inbox and spam folder.
          </p>
        </div>

        <div className="mt-6 text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-gray-500 dark:text-text-subtle mb-4">
              Resend available in <span className="font-semibold text-gray-700 dark:text-text-muted">{cooldown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className={cn(
                'w-full',
                'bg-brand hover:bg-brand-hover active:bg-brand-active',
                'text-white font-semibold',
                'py-3 px-4',
                'rounded-xl',
                'transition-all duration-200',
                'hover:shadow-lg hover:shadow-brand/25',
                'active:scale-[0.98]',
              )}
            >
              Resend email
            </button>
          )}

          <p className="mt-4 text-sm text-gray-500 dark:text-text-subtle">
            <a href="/login" className="text-brand hover:text-brand-hover font-semibold transition-colors">
              Back to login
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)} noValidate className="w-full max-w-md space-y-4 sm:space-y-5">
      <div className="text-center mb-4 sm:mb-6">
        <img src={logo} alt="EduTala PH" className="h-16 sm:h-20 mx-auto mb-2 sm:mb-3" />
        <h2 className="text-xl sm:text-2xl tracking-tight text-gray-900 dark:text-text font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Forgot Password</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-text-subtle">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      {apiError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
          {apiError}
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={inputClass}
          placeholder="you@school.edu.ph"
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          'w-full',
          'bg-brand hover:bg-brand-hover active:bg-brand-active',
          'text-white font-semibold',
          'py-3 px-4',
          'rounded-xl',
          'transition-all duration-200',
          'hover:shadow-lg hover:shadow-brand/25',
          'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-text-subtle pt-2 border-t border-gray-100 dark:border-border-light">
        Remember your password?{' '}
        <a href="/login" className="text-brand hover:text-brand-hover font-semibold transition-colors">
          Back to login
        </a>
      </p>
    </form>
  )
}
