import { NavLink } from 'react-router-dom'
import { cn } from '../lib/utils'
import logo from '../assets/EduTalaPH_Logo.png'

function HomeIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function UsersIcon({ size = 20 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/teachers', label: 'Teachers', icon: UsersIcon },
]

export default function Sidebar({ open, onClose, collapsed }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-white dark:bg-surface-alt border-r border-border-light z-40 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className={cn('h-16 flex items-center px-4', collapsed ? 'justify-center' : 'gap-3')}>
          <img src={logo} alt="EduTala PH" className="h-8 w-8 shrink-0" />
          {!collapsed && (
            <span className="text-lg font-semibold text-text truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>EduTala PH</span>
          )}
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center rounded-xl text-sm font-medium transition-colors',
                    collapsed
                      ? 'justify-center px-3 py-2.5'
                      : 'gap-3 px-4 py-2.5',
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'text-text-muted hover:bg-gray-50 dark:hover:bg-surface hover:text-text',
                  )
                }
              >
                <Icon size={collapsed ? 26 : 20} />
                {!collapsed && link.label}
              </NavLink>
            )
          })}
        </nav>

      </aside>
    </>
  )
}
