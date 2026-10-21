import { Briefcase, GraduationCap } from 'lucide-react'
import { cn } from '../utils/cn.js'

const options = [
  { value: 'student', label: 'Student', icon: GraduationCap },
  { value: 'recruiter', label: 'Recruiter', icon: Briefcase },
]

export default function RoleSelector({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Account type" className="grid h-[54px] grid-cols-2 gap-1 rounded-[14px] bg-segment p-1">
      {options.map(({ value: optionValue, label, icon: Icon }) => {
        const selected = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(optionValue)}
            className={cn(
              'flex items-center justify-center gap-2.5 rounded-[10px] text-base transition-colors focus-visible:outline-2 focus-visible:outline-primary',
              selected ? 'bg-white text-primary shadow-[0_1px_3px_rgba(16,25,46,0.1)]' : 'text-secondary hover:text-heading',
            )}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
