import { CircleCheck } from 'lucide-react'
import { trustIndicators } from '../data/landing.js'

export default function TrustIndicators() {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {trustIndicators.map((item) => (
        <li key={item} className="flex items-center gap-1.5 text-sm text-muted">
          <CircleCheck size={16} className="shrink-0 text-success" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}
