import { ClipboardList, FileText, House, Search, Trophy, User } from 'lucide-react'

// Items without `to` are sections that are not built yet; they show a "coming soon" notice.
export const SIDEBAR_NAV = [
  { label: 'Home', icon: House, to: '/dashboard' },
  { label: 'My Profile', icon: User },
  { label: 'Resume Analysis', icon: FileText },
  { label: 'Job Discovery', icon: Search, to: '/jobs' },
  { label: 'Assessment', icon: ClipboardList },
  { label: 'Results', icon: Trophy },
]

export const TOP_NAV = [
  { label: 'Jobs', to: '/jobs' },
  { label: 'Profile' },
  { label: 'Resume' },
  { label: 'Assessment' },
]
