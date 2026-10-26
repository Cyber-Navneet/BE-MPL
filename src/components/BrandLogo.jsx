import { Link } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { cn } from '../utils/cn.js'

// `boxed` shows the white icon in a blue tile (header); otherwise a small blue icon (footer).
export default function BrandLogo({ boxed = false, className }) {
  return (
    <Link
      to="/"
      aria-label="TalentAtharva home"
      className={cn('inline-flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-primary', className)}
    >
      {boxed ? (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
          <Brain size={20} aria-hidden="true" />
        </span>
      ) : (
        <Brain size={20} className="text-primary" aria-hidden="true" />
      )}
      <span className={cn('font-bold tracking-tight text-navy', boxed ? 'text-xl' : 'text-base')}>TalentAtharva</span>
    </Link>
  )
}
