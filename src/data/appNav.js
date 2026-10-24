import { ClipboardList, FileText, House, Search, Send, Settings, User } from 'lucide-react'

// Items without `to` are sections that are not built yet; they show a "coming soon" notice.
export const SIDEBAR_NAV = [
  { label: 'Home', icon: House, to: '/dashboard' },
  { label: 'My Profile', icon: User },
  { label: 'Resume Analysis', icon: FileText, to: '/resume' },
  { label: 'Job Discovery', icon: Search, to: '/jobs' },
  { label: 'Applications', icon: Send, to: '/applications' },
  { label: 'Assessments', icon: ClipboardList, to: '/assessments' },
  { label: 'Settings', icon: Settings },
]
