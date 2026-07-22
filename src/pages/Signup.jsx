import SignupForm from '../components/SignupForm'

export default function Signup() {
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
          <h1 className="text-3xl font-bold text-white mb-3">Join EduTala PH</h1>
          <p className="text-lg text-slate-300 mb-10">
            Start your journey in transforming Philippine education
          </p>

          <div className="w-12 h-0.5 mx-auto mb-6 rounded-full" style={{ backgroundColor: 'var(--color-white-muted)' }} />
          <blockquote className="text-xl font-light leading-relaxed text-slate-200">
            "The function of education is to teach one to think intensively and to think critically."
          </blockquote>
          <p className="mt-4 text-sm font-medium tracking-wider uppercase text-slate-400">— Martin Luther King Jr.</p>
        </div>
      </div>

      <div className="@container w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-surface dark:to-surface-alt">
        <SignupForm />
      </div>
    </div>
  )
}
