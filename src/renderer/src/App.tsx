import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { VirtualFSProvider, useVirtualFS } from './xp/VirtualFileSystem'
import { Bsod } from './xp/Bsod'
import { SecurityScreen } from './xp/SecurityScreen'
import { useTranslation } from './xp/useTranslation'
import { Icon } from './xp/icons'

import { BootMenu } from './xp/BootMenu'
import { LastGoodLoading } from './xp/LastGoodLoading'
import type { BootOption, DebugOption } from './xp/types'
import { MsgBoxProvider, useMsgBox } from './xp/XpMessageBox'
import { ScreenSaver } from './xp/ScreenSaver'
import { NotificationProvider } from './xp/NotificationSystem'

const BootModeHandler: React.FC<{ bootMode: BootOption }> = ({ bootMode }) => {
  const { reset, createFile, files, loadLastGood, saveBackup } = useVirtualFS()
  const { updateSettings } = useSystemSettings()

  useEffect(() => {
    if (bootMode === 'restore') {
      reset()
    } else if (bootMode === 'last-good') {
      loadLastGood()
    } else if (bootMode === 'normal') {
      saveBackup()
    }
  }, [bootMode, reset, loadLastGood, saveBackup])

  useEffect(() => {
    if (bootMode === 'safe' || bootMode === 'safe-network' || bootMode === 'safe-cmd') {
      updateSettings({ wallpaper: '' }) // Fundo preto
      document.body.style.background = '#000'
    } else {
      document.body.style.background = ''
    }
  }, [bootMode, updateSettings])

  useEffect(() => {
    if (bootMode === 'log') {
      const cDrive = files.find(f => f.name === 'C:')
      if (cDrive) {
        // Verifica se já não existe
        const hasLog = files.some(f => f.parentId === cDrive.id && f.name === 'ntbtlog.txt')
        if (!hasLog) {
          const logContent = `Log de Inicialização do Windows XP\n--------------------------------\nCarregando kernel...\nCarregando hal.dll...\nCarregando drivers de sistema...\nCarregamento concluído com sucesso.\n`
          createFile('ntbtlog.txt', 'file', cDrive.id, logContent)
        }
      }
    }
  }, [bootMode, createFile, files])

  return null
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'tip'
  duration?: number
}

const NotificationContext = React.createContext<{
  notifications: NotificationItem[]
  showNotification: (n: Omit<NotificationItem, 'id'>) => void
  removeNotification: (id: string) => void
}>({ notifications: [], showNotification: () => {}, removeNotification: () => {} })

export const useNotifications = () => useContext(NotificationContext)

function App(): React.JSX.Element {
  const [power, setPower] = useState<PowerState>('BOOTING')
  const [user, setUser] = useState<string>('Camilla')
  const [startOpen, setStartOpen] = useState(false)
  const [securityOpen, setSecurityOpen] = useState(false)
  const [shutdownMenuOpen, setShutdownMenuOpen] = useState(false)
  const [bootMode, setBootMode] = useState<BootOption>('normal')
  const [debugOption, setDebugOption] = useState<DebugOption | null>(null)
  const [autoF8, setAutoF8] = useState(false)
  const [showLastGoodLoading, setShowLastGoodLoading] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const showNotification = useCallback((n: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notif = { ...n, id }
    setNotifications(prev => [...prev, notif])
    if (n.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, n.duration || 5000)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  // Dica de boas-vindas ao fazer login
  useEffect(() => {
    if (power === 'RUNNING') {
      const timer = setTimeout(() => {
        showNotification({
          title: 'Bem-vindo ao Windows XP',
          message: 'Pressione Ctrl+Alt+Del para abrir o Gerenciador de Tarefas ou Ctrl+F para a tela de segurança.',
          type: 'tip',
          duration: 8000
        })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [power, showNotification])

  useEffect(() => {
    if (power === 'BOOTING') playSound(Sounds.startup, 0.4)
  }, [power])

  useEffect(() => {
    const handleBsod = () => {
      setPower('BSOD')
      setAutoF8(true) // Após BSOD, forçar o menu de boot F8 no próximo reinício
    }
    window.addEventListener('bsod', handleBsod)
    return () => window.removeEventListener('bsod', handleBsod)
  }, [])

  const handleShutdown = () => {
    playSound(Sounds.logoff, 0.4)
    setShutdownMenuOpen(true)
    setStartOpen(false)
  }

  const handleRestart = () => {
    setShutdownMenuOpen(false)
    setPower('SHUTTING_DOWN')
    setTimeout(() => {
      setPower('BOOTING')
      setBootMode('normal')
    }, 2000)
  }

  const handleBootOption = (option: BootOption, debugOpt?: DebugOption) => {
    setBootMode(option)
    if (debugOpt) {
      setDebugOption(debugOpt)
    }
    setAutoF8(false)
    if (option === 'restore') {
      // Restore system triggers a normal boot but we will handle the reset inside the VFS provider below
      setBootMode('restore')
      setDebugOption(null)
      setPower('LOGIN')
    } else if (option === 'safe-cmd') {
      window.location.hash = '#msdos'
      window.location.reload()
    } else if (option === 'last-good') {
      setShowLastGoodLoading(true)
    } else {
      setPower('LOGIN')
    }
  }

  const handleQuit = () => {
    playSound(Sounds.shutdown, 0.5)
    setTimeout(() => {
      if ((window as any).api?.quit) {
        (window as any).api.quit()
      }
    }, 500)
  }

  const handleLogoff = () => {
    playSound(Sounds.logoff, 0.4)
    setSecurityOpen(false)
    setStartOpen(false)
    // Fecha todas as janelas e volta pra tela de login
    setPower('SHUTTING_DOWN')
    setTimeout(() => {
      setPower('LOGIN')
      // Limpa sessão mas mantém usuário
      setStartOpen(false)
      setSecurityOpen(false)
      setShutdownMenuOpen(false)
    }, 1500)
  }

  return (
    <>
      <GlobalStyle />
      <Root $vga={bootMode === 'vga'} $debugOption={debugOption}>
        {showLastGoodLoading && (
          <LastGoodLoading
            onComplete={() => {
              setShowLastGoodLoading(false)
              setPower('LOGIN')
            }}
          />
        )}
        {!showLastGoodLoading && power === 'BOOTING' && <BootScreen onDone={() => setPower('LOGIN')} onF8={() => setPower('ADVANCED_BOOT_MENU')} autoF8={autoF8} />}
        {!showLastGoodLoading && power === 'ADVANCED_BOOT_MENU' && <BootMenu onSelect={handleBootOption} />}
        {!showLastGoodLoading && power === 'LOGIN' && (
          <LoginScreen
            onLogin={(name) => {
              setUser(name)
              playSound(Sounds.logon, 0.45)
              setPower('RUNNING')
            }}
          />
        )}
        {power === 'RUNNING' && (
          <NotificationProvider>
            <MsgBoxProvider>
              <VirtualFSProvider>
                <SystemSettingsProvider>
                  <WindowSystemProvider apps={APPS}>
                    <BootModeHandler bootMode={bootMode} />
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
                      onLogoff={handleLogoff}
                      bootMode={bootMode}
                      debugOption={debugOption}
                    />
                  </WindowSystemProvider>
                </SystemSettingsProvider>
              </VirtualFSProvider>
            </MsgBoxProvider>
          </NotificationProvider>
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
  onLogoff: () => void
  bootMode: BootOption
  debugOption: DebugOption | null
}

const MainAppContent: React.FC<MainAppContentProps> = (props) => {
  const openApp = useOpenApp()
  const { settings } = useSystemSettings()
  const { t } = useTranslation()
  const [screenSaverActive, setScreenSaverActive] = useState(false)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // Screen saver inactivity detection
  useEffect(() => {
    if (settings.screensaver === 'Nenhum' || screenSaverActive) return

    const resetTimer = () => {
      lastActivityRef.current = Date.now()
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      inactivityTimerRef.current = setTimeout(() => {
        setScreenSaverActive(true)
      }, (settings.screensaverTimeout || 60) * 1000)
    }

    const handleActivity = () => {
      resetTimer()
    }

    // Start the timer
    resetTimer()

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
    }
  }, [settings.screensaver, settings.screensaverTimeout, screenSaverActive])

  const handleScreenSaverExit = useCallback(() => {
    setScreenSaverActive(false)
    lastActivityRef.current = Date.now()
  }, [])

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
      {screenSaverActive && settings.screensaver !== 'Nenhum' && (
        <ScreenSaver
          type={settings.screensaver as any}
          onActivity={handleScreenSaverExit}
        />
      )}
      <DesktopShell
        username={props.username}
        startOpen={props.startOpen}
        onStartClick={props.onStartClick}
        onShutdown={props.onShutdown}
        onCloseStart={props.onCloseStart}
        onOpenSecurity={props.onOpenSecurity}
        bootMode={props.bootMode}
        debugOption={props.debugOption}
      />
      {props.securityOpen && (
        <SecurityScreen
          onClose={() => props.setSecurityOpen(false)}
          onLogoff={props.onLogoff}
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
  bootMode: BootOption
  debugOption: DebugOption | null
}

const DesktopShell: React.FC<ShellProps> = ({ username, startOpen, onStartClick, onShutdown, onCloseStart, onOpenSecurity, bootMode, debugOption }) => {
  const { instances, focusedId } = useWindows()
  const { settings } = useSystemSettings()
  const openApp = useOpenApp()
  const { showMessage } = useMsgBox()
  const apps = useMemo(() => new Map(APPS.map((a) => [a.id, a])), [])

  const [desktopIcons, setDesktopIcons] = useState<DesktopIconDef[]>(() => {
    const savedVersion = localStorage.getItem('xp-desktop-icons-version')
    const currentVersion = '3' // Incrementar quando mudar os icones
    if (savedVersion !== currentVersion) {
      localStorage.setItem('xp-desktop-icons-version', currentVersion)
      localStorage.removeItem('xp-desktop-icons')
      return DefaultDesktopIcons
    }
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
        showMessage({
          title: 'Aviso de Memória',
          message: 'Memória RAM está alta! Feche alguns aplicativos para evitar instabilidade.',
          type: 'warning'
        })
        sessionStorage.setItem('ram-alert-shown', 'true')
      }
    } else {
      sessionStorage.removeItem('ram-alert-shown')
    }
  }, [ramPercent, showMessage])

  useEffect(() => {
    const handleSystemWarning = (e: CustomEvent) => {
      showMessage({
        title: 'Aviso de Sistema',
        message: e.detail?.message || 'Arquivo de sistema crítico deletado!',
        type: 'error'
      })
    }
    window.addEventListener('systemWarning', handleSystemWarning as EventListener)
    return () => window.removeEventListener('systemWarning', handleSystemWarning as EventListener)
  }, [showMessage])

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
      <Desktop
        icons={desktopIcons}
        onIconsChange={setDesktopIcons}
        wallpaperName={settings.wallpaper}
        safeMode={bootMode === 'safe' || bootMode === 'safe-network' || bootMode === 'safe-cmd'}
        debugOption={debugOption}
      >
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
          onOpenSecurity={onOpenSecurity}
        />
      </StartBtnAnchor>
    </>
  )
}

export default App

const Root = styled.div<{ $vga?: boolean; $debugOption?: DebugOption | null }>`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background: #245edc;

  ${(p) =>
    p.$vga &&
    `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      );
      z-index: 9999999;
    }
    * {
      box-shadow: none !important;
      transition: none !important;
      animation: none !important;
      text-shadow: none !important;
    }
    transform: scale(0.8);
    transform-origin: top left;
    width: 125vw;
    height: 125vh;
  `}

  ${(p) =>
    p.$debugOption === 'inverted-colors' &&
    `
    filter: invert(100%);
  `}

  ${(p) =>
    p.$debugOption === 'glitch-mode' &&
    `
    animation: glitch 0.3s infinite;
    @keyframes glitch {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(2px, -2px); }
      60% { transform: translate(-2px, -2px); }
      80% { transform: translate(2px, 2px); }
    }
    * {
      text-shadow: 2px 0 #ff0000, -2px 0 #00ffff;
    }
  `}

  ${(p) =>
    p.$debugOption === 'slow-motion' &&
    `
    * {
      transition-duration: 5s !important;
    }
  `}

  ${(p) =>
    p.$debugOption === 'matrix-mode' &&
    `
    &::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        180deg,
        rgba(0,255,0,0.03) 0px,
        rgba(0,255,0,0.03) 1px,
        transparent 1px,
        transparent 20px
      );
      z-index: 9999999;
      animation: matrix-scroll 3s linear infinite;
    }
    @keyframes matrix-scroll {
      0% { background-position: 0 0; }
      100% { background-position: 0 100px; }
    }
    * {
      text-shadow: 0 0 3px #00ff00 !important;
      color: #00ff00 !important;
    }
    background: #000 !important;
  `}

  ${(p) =>
    p.$debugOption === 'grayscale' &&
    `
    filter: grayscale(100%);
  `}

  ${(p) =>
    p.$debugOption === 'flicker' &&
    `
    animation: flicker 4s infinite;
    @keyframes flicker {
      0%, 95%, 100% { opacity: 1; }
      96% { opacity: 0.8; }
      97% { opacity: 1; }
      98% { opacity: 0.5; }
      99% { opacity: 1; }
    }
  `}
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
