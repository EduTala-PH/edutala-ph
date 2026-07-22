import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'
import logo from '../assets/EduTalaPH_Logo.png'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
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

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const { error: authError } = useAuth()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: false },
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedRemember = watch('remember')

  const onSubmit = async (data) => {
    await login(data.email, data.password)
  }

  const inputClass = 'input'
  const errorClass = cn(
    // Typography
    'text-red-400 dark:text-red-500 text-sm',
    // Spacing
    'mt-1.5',
    // Layout
    'flex items-center gap-1',
  )
  const labelClass = cn(
    // Layout
    'block',
    // Typography
    'text-sm font-semibold text-gray-700 dark:text-text-muted',
    // Spacing
    'mb-1.5',
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 sm:space-y-5">
      <div className="text-center mb-4 sm:mb-6">
        <img src={logo} alt="EduTala PH" className="h-16 sm:h-20 mx-auto mb-2 sm:mb-3" />
        <h2 className="text-xl sm:text-2xl tracking-tight text-gray-900 dark:text-text font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>EduTala PH</h2>
      </div>

      {authError && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm text-center">
          {authError}
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

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            className={cn(inputClass, 'pr-10')}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              // Position
              'absolute right-3 top-1/2 -translate-y-1/2',
              // Typography
              'text-gray-400 dark:text-text-subtle hover:text-gray-600 dark:hover:text-text-muted',
              // Animation
              'transition-colors',
            )}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-text-muted cursor-pointer select-none">
          <input type="checkbox" {...register('remember')} className="sr-only" />
          <span
            className={cn(
              // Sizing
              'w-4.5 h-4.5',
              // Borders
              'border-2 rounded',
              // Layout
              'flex items-center justify-center',
              // Animation
              'transition-all duration-150',
              // State
              watchedRemember ? 'bg-brand border-brand' : 'border-gray-300 dark:border-border bg-white dark:bg-surface',
            )}
          >
            {watchedRemember && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          Remember me
        </label>
        <a
          href="/forgot-password"
          className="text-sm text-brand hover:text-brand-hover font-medium transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          // Layout
          'w-full',
          // Background
          'bg-brand hover:bg-brand-hover active:bg-brand-active',
          // Typography
          'text-white font-semibold',
          // Spacing
          'py-3 px-4',
          // Borders
          'rounded-xl',
          // Animation
          'transition-all duration-200',
          // Shadow
          'hover:shadow-lg hover:shadow-brand/25',
          // Interaction
          'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {isSubmitting ? 'Signing in...' : 'Login'}
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-text-subtle pt-2 border-t border-gray-100 dark:border-border-light">
        Don't have an account?{' '}
        <a href="/signup" className="text-brand hover:text-brand-hover font-semibold transition-colors">
          Sign up
        </a>
      </p>
    </form>
  )
}
