import { useEffect } from 'react'

// Closes a popover when the user clicks outside `ref` or presses Escape.
export function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose()
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, open, onClose])
}
