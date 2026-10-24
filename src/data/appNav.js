import { ClipboardList, FileText, House, Search, Send, Settings, User, WandSparkles } from 'lucide-react'

// Items without `to` are sections that are not built yet; they show a "coming soon" notice.
export const SIDEBAR_NAV = [
  { label: 'Home', icon: House, to: '/dashboard' },
  { label: 'My Profile', icon: User, to: '/profile' },
  { label: 'Resume Analysis', icon: FileText, to: '/resume' },
  { label: 'Job Discovery', icon: Search, to: '/jobs' },
  { label: 'Applications', icon: Send, to: '/applications' },
  { label: 'Assessments', icon: ClipboardList, to: '/assessments' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

// Recruiters see their own navigation; recruiter pages that are not built yet show "coming soon".
export const RECRUITER_SIDEBAR_NAV = [
  { label: 'Dashboard', icon: House, to: '/dashboard' },
  { label: 'Company Profile', icon: User },
  { label: 'My Jobs', icon: WandSparkles },
  { label: 'Applications', icon: Send, to: '/applications' },
  { label: 'Assessment', icon: ClipboardList },
  { label: 'Settings', icon: Settings },
]
