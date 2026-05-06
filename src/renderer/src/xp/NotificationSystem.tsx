import React, { createContext, useContext, useState, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from './icons'

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'tip'
  duration?: number
}

interface NotificationContextType {
  notifications: NotificationItem[]
  showNotification: (n: Omit<NotificationItem, 'id'>) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  showNotification: () => {},
  removeNotification: () => {}
})

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const showNotification = useCallback((n: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notif = { ...n, id }
    setNotifications((prev) => [...prev, notif])
    if (n.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, n.duration || 5000)
    }
  }, [removeNotification])

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
      <NotificationContainer>
        {notifications.map(n => (
          <NotificationToast key={n.id} $type={n.type} onClick={() => removeNotification(n.id)}>
            <NotifIcon src={getIconForType(n.type)} />
            <NotifContent>
              <NotifTitle>{n.title}</NotifTitle>
              <NotifMessage>{n.message}</NotifMessage>
            </NotifContent>
            <CloseBtn>×</CloseBtn>
          </NotificationToast>
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  )
}

function getIconForType(type: NotificationItem['type']): string {
  switch (type) {
    case 'error': return Icon.error16
    case 'warning': return Icon.warning16
    case 'tip': return Icon.magnifier16
    default: return Icon.magnifier16
  }
}

const slideIn = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`

const NotificationContainer = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
`

const NotificationToast = styled.div<{ $type: NotificationItem['type'] }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  min-width: 280px;
  max-width: 360px;
  background: ${p => {
    switch (p.$type) {
      case 'error': return '#fff0f0'
      case 'warning': return '#fffbe6'
      case 'tip': return '#f0f9ff'
      default: return '#f8f8f8'
    }
  }};
  border: 1px solid ${p => {
    switch (p.$type) {
      case 'error': return '#ffcdd2'
      case 'warning': return '#ffe082'
      case 'tip': return '#90caf9'
      default: return '#e0e0e0'
    }
  }};
  border-left: 4px solid ${p => {
    switch (p.$type) {
      case 'error': return '#d32f2f'
      case 'warning': return '#f9a825'
      case 'tip': return '#1976d2'
      default: return '#757575'
    }
  }};
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.15);
  pointer-events: auto;
  cursor: pointer;
  animation: ${slideIn} 0.3s ease-out;
  font-family: Tahoma, sans-serif;
  
  &:hover {
    box-shadow: 2px 2px 12px rgba(0,0,0,0.2);
  }
`

const NotifIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
`

const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`

const NotifTitle = styled.div`
  font-weight: bold;
  font-size: 12px;
  color: #333;
  margin-bottom: 3px;
`

const NotifMessage = styled.div`
  font-size: 11px;
  color: #666;
  line-height: 1.4;
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:hover {
    color: #333;
  }
`
