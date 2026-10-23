import { useRef } from 'react'
import { X } from 'lucide-react'
import BrandLogo from '../BrandLogo.jsx'
import SidebarContent from './SidebarContent.jsx'
import { useDialog } from '../../hooks/useDialog.js'

export default function MobileSidebar({ open, onClose, onComingSoon }) {
  const closeRef = useRef(null)
  useDialog({ open, onClose, initialFocusRef: closeRef })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl"
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <BrandLogo boxed />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SidebarContent
            onNavigate={onClose}
            onComingSoon={(label) => {
              onClose()
              onComingSoon(label)
            }}
          />
        </div>
      </div>
    </div>
  )
}
