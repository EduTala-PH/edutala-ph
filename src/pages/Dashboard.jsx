import { useAuth } from '../context/AuthContext'

function StatCard({ label, value }) {
  return (
    <div className="bg-white dark:bg-surface-alt border border-border-light rounded-xl p-6">
      <p className="text-sm text-text-muted mb-1">{label}</p>
      <p className="text-2xl font-semibold text-text">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-text mb-1">
        Welcome back, {user?.name?.split(' ')[0] || 'User'}
      </h1>
      <p className="text-text-muted mb-8">
        Here's an overview of your account.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Enrolled Courses" value="0" />
        <StatCard label="Completed Lessons" value="0" />
        <StatCard label="Hours Spent" value="0" />
      </div>
    </div>
  )
}
