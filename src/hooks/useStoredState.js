import { useEffect, useState } from 'react'

function readValue(key, initialValue, isValid) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return initialValue()
    const parsed = JSON.parse(raw)
    return isValid(parsed) ? parsed : initialValue()
  } catch {
    return initialValue()
  }
}

// useState mirrored to localStorage under `key`. `initialValue` is a function that builds the seed
// used when nothing valid is stored. Falls back to memory-only state when storage is unavailable.
export function useStoredState(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => readValue(key, initialValue, isValid))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage unavailable (e.g. private mode); the value lives in React state only.
    }
  }, [key, value])

  return [value, setValue]
}
