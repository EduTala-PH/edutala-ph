import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { cn } from '../lib/utils'
import logo from '../assets/EduTalaPH_Logo.png'

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function ResetPasswordForm({ token }) {
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState(null)
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    setApiError(null)
    const res = await api.post('/api/v1/auth/reset-password', {
      token,
      password: data.password,
    })
    if (!res.success) {
      setApiError(res.error?.message || 'Something went wrong. Please try again.')
      return
    }
    navigate('/login')
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-md space-y-4 sm:space-y-5">
      <div className="text-center mb-4 sm:mb-6">
        <img src={logo} alt="EduTala PH" className="h-16 sm:h-20 mx-auto mb-2 sm:mb-3" />
        <h2 className="text-xl sm:text-2xl tracking-tight text-gray-900 dark:text-text font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>Reset Password</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-text-subtle">Enter your new password</p>
      </div>

      {apiError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
          {apiError}
        </div>
      )}

      <div>
        <label htmlFor="password" className={labelClass}>New Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={cn(inputClass, 'pr-10')}
            placeholder="At least 6 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2',
              'text-gray-400 dark:text-text-subtle hover:text-gray-600 dark:hover:text-text-muted',
              'transition-colors',
            )}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>Confirm New Password</label>
        <input
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          {...register('confirmPassword')}
          className={inputClass}
          placeholder="Repeat your new password"
        />
        {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
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
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-text-subtle pt-2 border-t border-gray-100 dark:border-border-light">
        <a href="/login" className="text-brand hover:text-brand-hover font-semibold transition-colors">
          Back to login
        </a>
      </p>
    </form>
  )
}
