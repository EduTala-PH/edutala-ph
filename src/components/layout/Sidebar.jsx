import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import logo from '../../assets/EduTalaPH_Logo.png'

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
          collapsed ? 'w-[72px]' : 'w-64',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className={cn('h-20 flex items-center', collapsed ? 'justify-center' : 'gap-4 pl-6 pr-4')}>
          <img src={logo} alt="EduTala PH" className="h-10 w-10 shrink-0" />
          {!collapsed && (
            <span className="text-xl font-semibold text-text truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>EduTala PH</span>
          )}
        </div>

        <nav className="py-1">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center text-base font-medium transition-all duration-200 border-l-4 group relative',
                    collapsed && 'justify-center -ml-0.5',
                    isActive
                      ? 'bg-brand/10 text-brand border-brand'
                      : 'text-text-muted hover:bg-brand/10 hover:text-brand border-transparent hover:border-brand',
                  )
                }
              >
                <span className={cn('flex items-center py-4 transition-all duration-200', collapsed ? 'justify-center' : 'gap-3 pl-7 pr-4 group-hover:translate-x-1 group-aria-current-page:translate-x-1')}>
                  <Icon size={24} />
                  <span className={cn('transition-all duration-300 overflow-hidden whitespace-nowrap', collapsed ? 'max-w-0 opacity-0' : 'max-w-40 opacity-100')}>
                    {link.label}
                  </span>
                  <span className={cn('absolute left-full top-0 h-full flex items-center bg-gradient-to-r from-white via-white to-transparent dark:from-surface-alt dark:via-surface-alt dark:to-transparent shadow-lg w-40 text-brand border-l border-border-light z-50 transition-all duration-200 pl-5 pr-3 -translate-x-2 opacity-0 invisible', collapsed && 'group-hover:translate-x-0 group-hover:opacity-100 group-hover:visible')}>
                    {link.label}
                  </span>
                </span>
              </NavLink>
            )
          })}
        </nav>

      </aside>
    </>
  )
}
