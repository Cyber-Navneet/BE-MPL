import { useSyncExternalStore } from 'react'

// A tiny localStorage-backed store that every component can subscribe to.
// `parse` validates stored JSON; anything invalid falls back to `fallback()`.
// If storage is unavailable (e.g. private mode) the data lives in memory for the session.
export function createLocalStore(key, { fallback, parse }) {
  const listeners = new Set()
  let cache
  let cachedRaw
  let memoryOnly = false

  const readRaw = () => {
    try {
      return localStorage.getItem(key)
    } catch {
      memoryOnly = true
      return null
    }
  }

  const read = () => {
    if (memoryOnly && cache !== undefined) return cache
    const raw = readRaw()
    if (cache !== undefined && raw === cachedRaw) return cache
    cachedRaw = raw
    try {
      cache = raw == null ? fallback() : parse(JSON.parse(raw))
    } catch {
      cache = fallback()
    }
    return cache
  }

  const write = (updater) => {
    const current = read()
    const next = typeof updater === 'function' ? updater(current) : updater
    if (next === current) return
    cache = next
    try {
      cachedRaw = JSON.stringify(next)
      localStorage.setItem(key, cachedRaw)
    } catch {
      memoryOnly = true
    }
    listeners.forEach((listener) => listener())
  }

  const subscribe = (listener) => {
    listeners.add(listener)
    const onStorage = (event) => {
      if (event.key === key) listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  const useStore = () => useSyncExternalStore(subscribe, read)

  return { read, write, useStore }
}
