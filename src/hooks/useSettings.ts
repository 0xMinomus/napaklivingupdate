import { useEffect, useState } from 'react'
import { DEFAULT_SETTINGS, get } from '../api'
import type { Settings } from '../types'

export function useSettings(): Settings {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)

  useEffect(() => {
    let cancelled = false
    get<Settings>('/settings')
      .then((data) => {
        if (!cancelled) setSettings(data)
      })
      .catch(() => {
        if (!cancelled) setSettings(DEFAULT_SETTINGS)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return settings
}
