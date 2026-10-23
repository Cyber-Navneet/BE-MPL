import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppNavbar from '../components/app/AppNavbar.jsx'
import SidebarContent from '../components/app/SidebarContent.jsx'
import MobileSidebar from '../components/app/MobileSidebar.jsx'
import Toast from '../components/app/Toast.jsx'

// Shell for signed-in pages: top navbar, left sidebar (a drawer below `lg`) and a toast.
// Pages receive `notify(message, tone)` through the outlet context.
export default function AppLayout() {
  const [toast, setToast] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const notify = useCallback((message, tone = 'info') => setToast({ id: Date.now(), message, tone }), [])
  const dismissToast = useCallback(() => setToast(null), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const showComingSoon = useCallback((label) => notify(`${label} is coming soon.`), [notify])

  return (
    <div className="min-h-screen bg-canvas">
      <AppNavbar onOpenMenu={() => setMenuOpen(true)} onComingSoon={showComingSoon} />

      <div className="mx-auto flex w-full max-w-[1440px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-line bg-white lg:block">
          <SidebarContent onComingSoon={showComingSoon} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet context={{ notify }} />
        </main>
      </div>

      <MobileSidebar open={menuOpen} onClose={closeMenu} onComingSoon={showComingSoon} />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  )
}
