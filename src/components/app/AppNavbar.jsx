import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Sparkles } from 'lucide-react'
import BrandLogo from '../BrandLogo.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useDismiss } from '../../hooks/useDismiss.js'
import { cn } from '../../utils/cn.js'

const ROLE_LABELS = { student: 'Student', recruiter: 'Recruiter' }

const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

const focusRing = 'focus-visible:outline-2 focus-visible:outline-primary'

function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value)
          setUnread(false)
        }}
        aria-label={unread ? 'Notifications, 1 unread' : 'Notifications'}
        aria-expanded={open}
        className={cn('relative flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-slate-100', focusRing)}
      >
        <Bell size={20} aria-hidden="true" />
        {unread && <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-line bg-white p-2 shadow-lg">
          <p className="px-2 py-1.5 text-xs font-semibold tracking-wide text-muted uppercase">Notifications</p>
          <Link
            to="/jobs"
            onClick={close}
            className={cn('flex gap-3 rounded-lg p-2 hover:bg-slate-50', focusRing)}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pale text-primary">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            <span className="text-sm text-navy">
              New AI-matched jobs are ready for you.
              <span className="mt-0.5 block text-xs text-muted">Just now</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  )
}

function UserMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Account menu for ${user.name}`}
        aria-expanded={open}
        className={cn('flex items-center gap-2.5 rounded-lg py-1 pr-1 pl-1 hover:bg-slate-50 sm:pr-2', focusRing)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
          {initialsOf(user.name)}
        </span>
        <span className="hidden text-sm text-navy sm:inline">{user.name}</span>
        <ChevronDown size={16} className="text-muted" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-line bg-white p-2 shadow-lg">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-navy">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="my-1 border-t border-line" />
          <Link
            to="/dashboard"
            onClick={close}
            className={cn('flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-navy hover:bg-slate-50', focusRing)}
          >
            <LayoutDashboard size={16} aria-hidden="true" /> Dashboard
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className={cn('flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-danger hover:bg-red-50', focusRing)}
          >
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export default function AppNavbar({ onOpenMenu }) {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open menu"
          className={cn('-ml-2 flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-slate-100 lg:hidden', focusRing)}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <BrandLogo boxed />

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <span className="hidden rounded-full bg-selected px-3 py-1 text-xs font-semibold text-primary sm:inline">
            {ROLE_LABELS[user.role]}
          </span>
          <NotificationsMenu />
          <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />
          <UserMenu user={user} onSignOut={signOut} />
        </div>
      </div>
    </header>
  )
}
