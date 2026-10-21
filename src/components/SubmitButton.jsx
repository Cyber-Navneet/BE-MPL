import { ArrowRight, LoaderCircle } from 'lucide-react'

export default function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-[50px] w-full items-center justify-center gap-2.5 rounded-[10px] bg-primary text-base text-white shadow-[0_2px_6px_rgba(33,99,246,0.25)] transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-80"
    >
      {children}
      {loading ? (
        <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
      ) : (
        <ArrowRight size={18} aria-hidden="true" />
      )}
    </button>
  )
}
