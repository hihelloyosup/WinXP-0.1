import type React from 'react'

export interface AppDefinition {
  id: string
  title: string
  icon: string
  defaultSize?: { width: number; height: number }
  minSize?: { width: number; height: number }
  resizable?: boolean
  multiInstance?: boolean
  render: (instance: AppInstance) => React.ReactNode
}

export interface AppInstance {
  id: number
  defId: string
  title: string
  icon: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
  maximized: boolean
  args?: unknown
}

export type PowerState = 'BOOTING' | 'ADVANCED_BOOT_MENU' | 'LOGIN' | 'RUNNING' | 'SHUTTING_DOWN' | 'BSOD' | 'OFF'

export type DebugOption = 
  | 'no-icons'
  | 'inverted-colors'
  | 'random-icons'
  | 'glitch-mode'
  | 'slow-motion'
  | 'matrix-mode'
  | 'grayscale'
  | 'flicker'

export type BootOption = 
  | 'normal' 
  | 'safe' 
  | 'safe-network' 
  | 'safe-cmd' 
  | 'log' 
  | 'vga' 
  | 'last-good' 
  | 'dsrm' 
  | 'debug' 
  | 'restore'
