import { useEffect } from 'react'

// Shared modal behaviour: moves focus in on open and back out on close, locks page
// scroll, and closes on Escape. Pass `escapeEnabled: false` while a nested dialog is on top.
export function useDialog({ open, onClose, initialFocusRef, escapeEnabled = true }) {
  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    initialFocusRef?.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, initialFocusRef])

  useEffect(() => {
    if (!open || !escapeEnabled) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, escapeEnabled, onClose])
}
