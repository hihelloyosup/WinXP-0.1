import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from './icons'
import { useSystemSettings } from './SystemSettings'
import { theme } from './theme'
import { useWindows } from './WindowSystem'
import { useVirtualFS } from './VirtualFileSystem'

interface Props {
  startOpen: boolean
  onStartClick: () => void
  username: string
  onOpenSecurity?: () => void
}

export const Taskbar: React.FC<Props> = ({
  onOpenSecurity, onStartClick, startOpen, username: _username }) => {
  const { instances, focusedId, focus, minimize, restore } = useWindows()
  const { settings, updateSettings } = useSystemSettings()
  const { files } = useVirtualFS()
  const [now, setNow] = useState(() => new Date())
  const [showBalloon, setShowBalloon] = useState(true)
  const [clockHover, setClockHover] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (showBalloon) {
      const timer = setTimeout(() => setShowBalloon(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [showBalloon])

  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const isAppActive = (appId: string) => {
    const requiresExe = ['paint', 'notepad', 'cmd', 'ie']
    if (requiresExe.includes(appId)) {
      return files.some(f => f.appId === appId && f.name.toLowerCase().endsWith('.exe') && f.deletedAt === undefined)
    }
    return true
  }

  return (
    <Root>
      <StartBtn onClick={onStartClick} $active={startOpen}>
        <StartIcon src={Icon.start} />
      </StartBtn>
      <QuickLaunch>
        {isAppActive('ie') && <QuickIcon src={Icon.ie16} alt="IE" title="Launch Internet Explorer" />}
        <QuickIcon src={Icon.mediaPlayer16} alt="WMP" title="Windows Media Player" />
        <QuickIcon src={Icon.outlook16} alt="Outlook" title="Outlook Express" />
        <Separator />
      </QuickLaunch>
      <Tasks>
        {instances.map((inst) => (
          <TaskBtn
            key={inst.id}
            $focused={!inst.minimized && focusedId === inst.id}
            onClick={() => {
              if (inst.minimized) restore(inst.id)
              if (focusedId === inst.id && !inst.minimized) minimize(inst.id)
              else focus(inst.id)
            }}
          >
            <TaskIcon src={inst.icon} />
            <TaskTitle>{inst.title}</TaskTitle>
          </TaskBtn>
        ))}
      </Tasks>
      <Tray>
        {showBalloon && (
          <NotificationBalloon>
            <BalloonClose onClick={() => setShowBalloon(false)}>×</BalloonClose>
            <BalloonTitle>
              <BalloonIcon src={Icon.security16} alt="" />
              Central de Segurança do Windows
            </BalloonTitle>
            <BalloonText>
              Seu computador pode estar em risco. Clique aqui para verificar o status de segurança.
            </BalloonText>
            <BalloonArrow />
          </NotificationBalloon>
        )}
        <TrayIcon
          src={Icon.security16}
          alt="security"
          onClick={onOpenSecurity}
          title="Centro de Segurança"
        />
        <TrayIcon
          src={settings.muted ? Icon.mute16 : Icon.sound16}
          alt="sound"
          onClick={() => updateSettings({ muted: !settings.muted })}
          title={settings.muted ? 'Ativar som' : 'Desativar som'}
        />
        <TrayIcon
          src={settings.networkConnected ? Icon.wireless16 : Icon.noWireless16}
          alt="network"
          onClick={() => updateSettings({ networkConnected: !settings.networkConnected })}
          title={settings.networkConnected ? 'Desconectar rede' : 'Conectar rede'}
        />
        <TrayIcon
          src={Icon.msgInfo16}
          alt="notifications"
          onClick={() => {
            // Mostra uma notificação de teste
            const event = new CustomEvent('systemNotification', {
              detail: { title: 'Notificações', message: 'Você não tem novas notificações.' }
            })
            window.dispatchEvent(event)
          }}
          title="Notificações"
        />
        <ClockArea 
          onMouseEnter={() => setClockHover(true)} 
          onMouseLeave={() => setClockHover(false)}
        >
          <Clock>{time}</Clock>
          {clockHover && (
            <DateTooltip>{dateStr}</DateTooltip>
          )}
        </ClockArea>
      </Tray>
    </Root>
  )
}

const Root = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  display: flex;
  align-items: stretch;
  background: ${theme.gradients.taskbar};
  border-top: 1px solid #0c3f9b;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.25);
  z-index: 1000;
  font-family: ${theme.fonts.ui};
`

const StartBtn = styled.button<{ $active: boolean }>`
  height: 100%;
  border: none;
  padding: 0;
  margin: 0;
  background: ${(p) => (p.$active ? theme.gradients.startButtonHover : theme.gradients.startButton)};
  border-top-right-radius: 14px;
  border-bottom-right-radius: 14px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
  &:hover { filter: brightness(1.08); }
`

const StartIcon = styled.img`
  height: 26px;
  display: block;
`

const QuickLaunch = styled.div`
  display: flex;
  align-items: center;
  padding: 0 4px;
  gap: 2px;
`

const QuickIcon = styled.img`
  width: 16px;
  height: 16px;
  padding: 2px;
  border-radius: 2px;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.15); }
`

const Separator = styled.div`
  width: 1px;
  height: 60%;
  background: rgba(0,0,0,0.25);
  margin: 0 4px;
  box-shadow: 1px 0 0 rgba(255,255,255,0.18);
`

const Tasks = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 2px 2px;
  gap: 3px;
  overflow: hidden;
  min-width: 0;
`

const TaskBtn = styled.button<{ $focused: boolean }>`
  height: 24px;
  min-width: 140px;
  max-width: 170px;
  flex: 0 1 auto;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px;
  border: 1px solid ${(p) => (p.$focused ? '#071c58' : '#2a5bc4')};
  border-radius: 3px;
  background: ${(p) =>
    p.$focused
      ? 'linear-gradient(180deg, #1c52b8 0%, #1943a0 40%, #1749ac 100%)'
      : 'linear-gradient(180deg, #3c81f3 0%, #2f6ed0 45%, #3476d8 100%)'};
  box-shadow: ${(p) =>
    p.$focused ? 'inset 1px 1px 2px rgba(0,0,0,0.4)' : 'inset 0 1px 0 rgba(255,255,255,0.25)'};
  color: #fff;
  cursor: pointer;
  font-size: 11px;
  text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
  &:hover { filter: brightness(1.08); }
`

const TaskIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`

const TaskTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`

const Tray = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px 0 8px;
  background: linear-gradient(180deg, #0f9dee 0%, #1178d0 50%, #0b59a6 100%);
  border-left: 1px solid rgba(0,0,0,0.3);
  box-shadow: inset 1px 0 0 rgba(255,255,255,0.25);
  flex-shrink: 0;
`

const TrayIcon = styled.img`
  width: 16px;
  height: 16px;
`

const ClockArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Clock = styled.div`
  color: #fff;
  font-size: 11px;
  padding: 0 4px 0 8px;
  min-width: 60px;
  text-align: right;
`

const DateTooltip = styled.div`
  position: absolute;
  bottom: 32px;
  right: 0;
  background: #ffffe1;
  color: #000;
  border: 1px solid #000;
  padding: 4px 8px;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  white-space: nowrap;
  z-index: 10000;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  pointer-events: none;
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const NotificationBalloon = styled.div`
  position: absolute;
  bottom: 34px;
  right: 8px;
  width: 260px;
  background: #ffffe1;
  border: 1px solid #000;
  border-radius: 3px;
  padding: 10px 12px;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  color: #000;
  z-index: 10001;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.3);
  animation: ${fadeIn} 0.4s ease-out;
  cursor: pointer;
`

const BalloonClose = styled.div`
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  color: #666;
  &:hover { color: #000; }
`

const BalloonTitle = styled.div`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`

const BalloonIcon = styled.img`
  width: 16px;
  height: 16px;
`

const BalloonText = styled.div`
  font-size: 11px;
  line-height: 1.3;
  color: #333;
`

const BalloonArrow = styled.div`
  position: absolute;
  bottom: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #ffffe1;
  &::before {
    content: '';
    position: absolute;
    bottom: 1px;
    left: -9px;
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-top: 9px solid #000;
    z-index: -1;
  }
`
