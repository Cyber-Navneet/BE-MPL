import { NavLink } from 'react-router-dom'
import { SIDEBAR_NAV } from '../../data/appNav.js'
import { cn } from '../../utils/cn.js'

const itemClasses =
  'flex h-11 w-full items-center gap-3 rounded-lg px-4 text-[15px] text-navy transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-primary'

// Navigation list plus the AI Credits card; shared by the desktop sidebar and the mobile drawer.
export default function SidebarContent({ onComingSoon, onNavigate }) {
  return (
    <div className="flex h-full flex-col px-3 py-6">
      <nav aria-label="Dashboard">
        <ul className="space-y-1">
          {SIDEBAR_NAV.map(({ label, icon: Icon, to }) => (
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

      <div className="mt-auto rounded-xl bg-linear-to-br from-[#e6f0ff] to-[#e3f8ef] p-4">
        <p className="text-xs font-semibold text-navy">AI Credits</p>
        <p className="mt-1.5 text-3xl font-bold tracking-tight text-primary">847</p>
        <p className="mt-1.5 text-xs text-muted">Resets in 12 days</p>
      </div>
    </div>
  )
}
