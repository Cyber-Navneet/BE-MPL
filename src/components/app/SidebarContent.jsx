import { NavLink } from 'react-router-dom'
import { RECRUITER_SIDEBAR_NAV, SIDEBAR_NAV } from '../../data/appNav.js'
import { useAuth } from '../../hooks/useAuth.js'
import { cn } from '../../utils/cn.js'

const itemClasses =
  'flex h-11 w-full items-center gap-3 rounded-lg px-4 text-[15px] text-navy transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary'

// Navigation list shared by the desktop sidebar and the mobile drawer.
export default function SidebarContent({ onComingSoon, onNavigate }) {
  const { user } = useAuth()
  const items = user.role === 'recruiter' ? RECRUITER_SIDEBAR_NAV : SIDEBAR_NAV

  return (
    <div className="flex h-full flex-col px-3 py-6">
      <nav aria-label="Dashboard">
        <ul className="space-y-1">
          {items.map(({ label, icon: Icon, to }) => (
            <li key={label}>
              {to ? (
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(itemClasses, isActive && 'bg-selected text-primary hover:bg-selected')
                  }
                >
                  <Icon size={19} aria-hidden="true" />
                  {label}
                </NavLink>
              ) : (
                <button type="button" onClick={() => onComingSoon(label)} className={itemClasses}>
                  <Icon size={19} aria-hidden="true" />
                  {label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
