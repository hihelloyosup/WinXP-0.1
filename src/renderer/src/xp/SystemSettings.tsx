import React, { createContext, useContext, useMemo, useState } from 'react'

export type VisualStyle = 'xp' | 'classic' | 'high-contrast-white' | 'high-contrast-black' | 'high-contrast-1' | 'high-contrast-2'

export interface SystemSettings {
  wallpaper: string
  screensaver: string
  screensaverTimeout: number
  windowColor: string
  visualStyle: VisualStyle
  networkConnected: boolean
  volume: number
  muted: boolean
  username: string
  isAdmin: boolean
  boldLetters: boolean
  highContrast: boolean
  narrator: boolean
  recycleBinFull: boolean
  password?: string
  maxRamMb: number
  language: string
}

interface SystemSettingsContextValue {
  settings: SystemSettings
  updateSettings: (patch: Partial<SystemSettings>) => void
}

const defaultSettings: SystemSettings = {
  wallpaper: 'Bliss',
  screensaver: 'Nenhum',
  screensaverTimeout: 60,
  windowColor: '#245edc',
  visualStyle: 'xp',
  networkConnected: true,
  volume: 75,
  muted: false,
  username: 'Camilla',
  isAdmin: true,
  boldLetters: false,
  highContrast: false,
  narrator: false,
  recycleBinFull: true,
  password: undefined,
  maxRamMb: 1000,
  language: 'pt'
}

const SystemSettingsContext = createContext<SystemSettingsContextValue | null>(null)

export const SystemSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)

  const value = useMemo<SystemSettingsContextValue>(
    () => ({
      settings,
      updateSettings: (patch) => {
        setSettings((prev) => ({ ...prev, ...patch }))
      }
    }),
    [settings]
  )

  return <SystemSettingsContext.Provider value={value}>{children}</SystemSettingsContext.Provider>
}

export function useSystemSettings(): SystemSettingsContextValue {
  const ctx = useContext(SystemSettingsContext)
  if (!ctx) throw new Error('useSystemSettings must be used inside SystemSettingsProvider')
  return ctx
}
