import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { GlobalStyle } from './xp/GlobalStyle'
import { BootScreen } from './xp/BootScreen'
import { LoginScreen } from './xp/LoginScreen'
import { Desktop, DefaultDesktopIcons } from './xp/Desktop'
import type { DesktopIconDef } from './xp/Desktop'
import { Taskbar } from './xp/Taskbar'
import { StartMenu } from './xp/StartMenu'
import { XpWindow } from './xp/Window'
import { WindowSystemProvider, useWindows, useOpenApp } from './xp/WindowSystem'
import { APPS } from './xp/apps'
import { setAudioPreferences, Sounds, playSound } from './xp/sounds'
import type { PowerState } from './xp/types'
import { SystemSettingsProvider, useSystemSettings } from './xp/SystemSettings'
import { VirtualFSProvider } from './xp/VirtualFileSystem'
import { Bsod } from './xp/Bsod'
import { SecurityScreen } from './xp/SecurityScreen'
import { useTranslation } from './xp/useTranslation'
import { Icon } from './xp/icons'

function App(): React.JSX.Element {
  const [power, setPower] = useState<PowerState>('BOOTING')
  const [user, setUser] = useState<string>('Camilla')
  const [startOpen, setStartOpen] = useState(false)
  const [securityOpen, setSecurityOpen] = useState(false)
  const [shutdownMenuOpen, setShutdownMenuOpen] = useState(false)

  useEffect(() => {
    if (power === 'BOOTING') playSound(Sounds.startup, 0.4)
  }, [power])

  useEffect(() => {
    const handleBsod = () => setPower('BSOD')
    window.addEventListener('bsod', handleBsod)
    return () => window.removeEventListener('bsod', handleBsod)
  }, [])

  const handleShutdown = () => {
    setShutdownMenuOpen(true)
    setStartOpen(false)
  }

  const handleRestart = () => {
    setShutdownMenuOpen(false)
    setPower('SHUTTING_DOWN')
    setTimeout(() => setPower('BOOTING'), 2000)
  }

  const handleQuit = () => {
    if (window.api?.quit) {
      window.api.quit()
    }
  }

  return (
    <>
      <GlobalStyle />
      <Root>
        {power === 'BOOTING' && <BootScreen onDone={() => setPower('LOGIN')} />}
        {power === 'LOGIN' && (
          <LoginScreen
            onLogin={(name) => {
              setUser(name)
              playSound(Sounds.logon, 0.45)
              setPower('RUNNING')
            }}
          />
        )}
        {power === 'RUNNING' && (
          <VirtualFSProvider>
            <SystemSettingsProvider>
              <WindowSystemProvider apps={APPS}>
                <MainAppContent
                  username={user}
                  startOpen={startOpen}
                  onStartClick={() => setStartOpen((s) => !s)}
                  onShutdown={handleShutdown}
                  onCloseStart={() => setStartOpen(false)}
                  onOpenSecurity={() => setSecurityOpen(true)}
                  securityOpen={securityOpen}
                  setSecurityOpen={setSecurityOpen}
                  shutdownMenuOpen={shutdownMenuOpen}
                  setShutdownMenuOpen={setShutdownMenuOpen}
                  onRestart={handleRestart}
                  onQuit={handleQuit}
                />
              </WindowSystemProvider>
            </SystemSettingsProvider>
          </VirtualFSProvider>
        )}
        {power === 'SHUTTING_DOWN' && (
          <Shutdown>
            <ShutdownLogo>ASUS</ShutdownLogo>
            <ShutdownText>Salvando sua sessão...</ShutdownText>
          </Shutdown>
        )}
        {power === 'BSOD' && <Bsod onRestart={() => setPower('BOOTING')} />}
      </Root>
    </>
  )
}

interface MainAppContentProps {
  username: string
  startOpen: boolean
  onStartClick: () => void
  onShutdown: () => void
  onCloseStart: () => void
  onOpenSecurity: () => void
  securityOpen: boolean
  setSecurityOpen: (open: boolean) => void
  shutdownMenuOpen: boolean
  setShutdownMenuOpen: (open: boolean) => void
  onRestart: () => void
  onQuit: () => void
}

const MainAppContent: React.FC<MainAppContentProps> = (props) => {
  const openApp = useOpenApp()
  const { settings } = useSystemSettings()
  const { t } = useTranslation()

  useEffect(() => {
    if (settings.boldLetters) {
      document.body.style.fontWeight = 'bold'
    } else {
      document.body.style.fontWeight = 'normal'
    }
  }, [settings.boldLetters])
  
  useEffect(() => {
    if (settings.highContrast) {
      document.body.style.filter = 'contrast(1.5)'
    } else {
      document.body.style.filter = 'none'
    }
  }, [settings.highContrast])

  const handleLogoff = () => {
    props.setSecurityOpen(false)
    props.onQuit()
  }
  
  const handleControlPanel = () => {
    props.setSecurityOpen(false)
    openApp('controlPanel')
  }
  
  const handleTaskManager = () => {
    props.setSecurityOpen(false)
    openApp('taskMgr')
  }
  
  return (
    <>
      <DesktopShell
        username={props.username}
        startOpen={props.startOpen}
        onStartClick={props.onStartClick}
        onShutdown={props.onShutdown}
        onCloseStart={props.onCloseStart}
        onOpenSecurity={props.onOpenSecurity}
      />
      {props.securityOpen && (
        <SecurityScreen
          onClose={() => props.setSecurityOpen(false)}
          onLogoff={handleLogoff}
          onControlPanel={handleControlPanel}
          onTaskManager={handleTaskManager}
        />
      )}
      {props.shutdownMenuOpen && (
        <ShutdownMenuOverlay onClick={() => props.setShutdownMenuOpen(false)}>
          <ShutdownMenu onClick={(e) => e.stopPropagation()}>
            <ShutdownMenuTitle>{t('Turn Off Computer')}</ShutdownMenuTitle>
            <ShutdownMenuButtons>
              <ShutdownMenuButton onClick={props.onRestart}>
                <img src={Icon.update16} alt={t('Restart')} style={{ width: 32, height: 32, marginBottom: 8 }} />
                {t('Restart')}
              </ShutdownMenuButton>
              <ShutdownMenuButton onClick={props.onQuit}>
                <img src={Icon.shutdown} alt={t('Turn Off Computer')} style={{ width: 32, height: 32, marginBottom: 8 }} />
                {t('Turn Off Computer')}
              </ShutdownMenuButton>
              <ShutdownMenuButton onClick={() => props.setShutdownMenuOpen(false)}>
                <img src={Icon.stop} alt={t('Cancel')} style={{ width: 32, height: 32, marginBottom: 8 }} />
                {t('Cancel')}
              </ShutdownMenuButton>
            </ShutdownMenuButtons>
          </ShutdownMenu>
        </ShutdownMenuOverlay>
      )}
    </>
  )
}

interface ShellProps {
  username: string
  startOpen: boolean
  onStartClick: () => void
  onShutdown: () => void
  onCloseStart: () => void
  onOpenSecurity: () => void
}

const DesktopShell: React.FC<ShellProps> = ({ username, startOpen, onStartClick, onShutdown, onCloseStart, onOpenSecurity }) => {
  const { instances, focusedId } = useWindows()
  const { settings } = useSystemSettings()
  const openApp = useOpenApp()
  const apps = useMemo(() => new Map(APPS.map((a) => [a.id, a])), [])
  
  const [desktopIcons, setDesktopIcons] = useState<DesktopIconDef[]>(() => {
    const saved = localStorage.getItem('xp-desktop-icons')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return DefaultDesktopIcons
      }
    }
    return DefaultDesktopIcons
  })

  const usedRamMb = useMemo(() => instances.length * 100, [instances.length])
  const ramPercent = useMemo(() => Math.min(100, Math.round((usedRamMb / settings.maxRamMb) * 100)), [usedRamMb, settings.maxRamMb])

  useEffect(() => {
    if (ramPercent >= 100) {
      window.dispatchEvent(new Event('bsod'))
    } else if (ramPercent >= 80) {
      const alertShown = sessionStorage.getItem('ram-alert-shown')
      if (!alertShown) {
        alert('⚠️ Aviso: Memória RAM está alta! Feche alguns aplicativos para evitar instabilidade.')
        sessionStorage.setItem('ram-alert-shown', 'true')
      }
    } else {
      sessionStorage.removeItem('ram-alert-shown')
    }
  }, [ramPercent])

  useEffect(() => {
    localStorage.setItem('xp-desktop-icons', JSON.stringify(desktopIcons))
  }, [desktopIcons])

  useEffect(() => {
    setAudioPreferences(settings.volume, settings.muted)
  }, [settings.volume, settings.muted])

  useEffect(() => {
    document.body.style.filter = settings.highContrast ? 'contrast(1.25) saturate(0.75)' : ''
    return () => {
      document.body.style.filter = ''
    }
  }, [settings.highContrast])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        onOpenSecurity()
      } else if (e.ctrlKey && e.altKey && e.key === 'Delete') {
        e.preventDefault()
        openApp('taskMgr')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onOpenSecurity, openApp])

  return (
    <>
      <Desktop icons={desktopIcons} onIconsChange={setDesktopIcons} wallpaperName={settings.wallpaper}>
        {instances.map((inst) => {
          const def = apps.get(inst.defId)
          if (!def) return null
          return (
            <XpWindow
              key={inst.id}
              instance={inst}
              focused={focusedId === inst.id}
              resizable={def.resizable !== false}
              minSize={def.minSize}
            >
              {def.render(inst)}
            </XpWindow>
          )
        })}
      </Desktop>
      {startOpen && (
        <StartMenu 
          username={settings.username || username} 
          onClose={onCloseStart} 
          onShutdown={onShutdown}
        />
      )}
      <StartBtnAnchor data-xp-start-btn="1">
        <Taskbar
          username={username}
          startOpen={startOpen}
          onStartClick={onStartClick}
        />
      </StartBtnAnchor>
    </>
  )
}

export default App

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #245edc;
`

const StartBtnAnchor = styled.div``

const Shutdown = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #0a1644 0%, #000 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Tahoma, sans-serif;
  font-size: 16px;
  gap: 16px;
`

const ShutdownLogo = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`

const ShutdownText = styled.div`
  font-size: 14px;
`

const ShutdownMenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
`

const ShutdownMenu = styled.div`
  background: #ece9d8;
  border: 3px solid #0055ea;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
`

const ShutdownMenuTitle = styled.h2`
  font-family: Tahoma, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  margin: 0;
`

const ShutdownMenuButtons = styled.div`
  display: flex;
  gap: 12px;
`

const ShutdownMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: #ece9d8;
  border: 1px solid #003c74;
  border-radius: 3px;
  cursor: pointer;
  font-family: Tahoma, sans-serif;
  font-size: 11px;
  color: #000;

  &:hover {
    background: #e3e0c8;
  }
`
