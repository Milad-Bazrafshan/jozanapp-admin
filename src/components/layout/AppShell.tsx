import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative">
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMobileToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
