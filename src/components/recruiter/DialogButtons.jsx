import { cn } from '../../utils/cn.js'

const base =
  'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-blue'

const tones = {
  primary: 'bg-home-blue text-white hover:bg-primary-hover',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-danger text-white hover:bg-red-700',
}

// Footer row: Cancel plus one primary action. Pass `form` to submit a form outside the footer.
export default function DialogButtons({ cancelLabel = 'Cancel', onCancel, confirmLabel, confirmIcon: Icon, tone = 'primary', onConfirm, form }) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} className={cn(base, 'border border-home-border bg-white text-home-ink hover:bg-slate-50')}>
        {cancelLabel}
      </button>
      {confirmLabel && (
        <button type={form ? 'submit' : 'button'} form={form} onClick={onConfirm} className={cn(base, tones[tone])}>
          {Icon && <Icon size={16} aria-hidden="true" />}
          {confirmLabel}
        </button>
      )}
    </div>
  )
}
