import { useCallback, useState } from 'react'

function readIds(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(Number.isInteger) : []
  } catch {
    return []
  }
}

function writeIds(key, ids) {
  try {
    localStorage.setItem(key, JSON.stringify(ids))
  } catch {
    // Storage unavailable (e.g. private mode); the ids live in React state only.
  }
}

// A list of numeric ids kept in React state and mirrored to localStorage.
export function useStoredIds(key) {
  const [ids, setIds] = useState(() => readIds(key))

  const save = useCallback(
    (next) => {
      setIds(next)
      writeIds(key, next)
    },
    [key],
  )

  return {
    has: (id) => ids.includes(id),
    add: (id) => {
      if (!ids.includes(id)) save([...ids, id])
    },
    toggle: (id) => save(ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]),
  }
}
