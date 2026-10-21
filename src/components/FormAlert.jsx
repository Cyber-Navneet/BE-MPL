import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from '../utils/cn.js'

export default function FormAlert({ tone, children }) {
  const isError = tone === 'error'
  const Icon = isError ? CircleAlert : CircleCheck

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex items-center gap-2 rounded-[10px] border px-4 py-3 text-sm',
        isError ? 'border-red-200 bg-red-50 text-danger' : 'border-emerald-200 bg-emerald-50 text-emerald-700',
      )}
    >
      <Icon size={18} className="shrink-0" aria-hidden="true" />
      {children}
    </div>
  )
}
