import { Link } from 'react-router-dom'
import { cn } from '../utils/cn.js'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  outline: 'border border-line bg-white text-navy hover:bg-slate-50',
  inverse: 'bg-white text-primary hover:bg-pale',
}

const sizes = {
  sm: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

// Renders a router Link when `to` is given, otherwise a <button>.
export default function Button({ to, variant = 'primary', size = 'lg', className, children, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    variants[variant],
    sizes[size],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
