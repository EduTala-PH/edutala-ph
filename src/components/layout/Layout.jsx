import { useState } from 'react'
import { cn } from '../../lib/utils'
import NavBar from './NavBar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const sidebarWidth = sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-64'

  return (
    <div className="min-h-screen bg-surface">
      <NavBar
        onMenuClick={() => setSidebarOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />
      <main className={cn('pt-21 min-h-screen transition-all duration-300', sidebarWidth)}>
        {children}
      </main>
    </div>
  )
}
