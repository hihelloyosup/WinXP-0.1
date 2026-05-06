import React, { createContext, useCallback, useContext, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from './icons'
import { playSound, Sounds } from './sounds'
import { theme } from './theme'
import { playErrorBeep, playWarningBeep, playSuccessBeep, playInfoBeep } from './soundGenerator'

export type MsgBoxType = 'error' | 'warning' | 'info' | 'success' | 'critical'

interface MsgBoxOptions {
  title?: string
  message: string
  type?: MsgBoxType
  buttons?: string[]
  onButton?: (label: string) => void
}

interface MsgBoxContextType {
  showMessage: (opts: MsgBoxOptions) => void
}

const MsgBoxContext = createContext<MsgBoxContextType | null>(null)

export function useMsgBox(): MsgBoxContextType {
  const ctx = useContext(MsgBoxContext)
  if (!ctx) throw new Error('MsgBoxProvider missing')
  return ctx
}

// Also expose a global reference so non-React code can use it
let globalShowMessage: ((opts: MsgBoxOptions) => void) | null = null

export function showXpMessage(opts: MsgBoxOptions): void {
  if (globalShowMessage) {
    globalShowMessage(opts)
  } else {
    // Fallback if provider not mounted
    alert(`${opts.title || 'Alerta'}: ${opts.message}`)
  }
}

export const MsgBoxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<MsgBoxOptions[]>([])

  const showMessage = useCallback((opts: MsgBoxOptions) => {
    console.log('showMessage called with:', opts)
    setQueue((q) => [...q, opts])
    // Play appropriate sound based on type
    const type = opts.type || 'info'
    console.log('Playing sound for type:', type)
    if (type === 'critical') {
      console.log('Playing criticalStop:', Sounds.criticalStop)
      playSound(Sounds.criticalStop, 0.7)
    } else if (type === 'error') {
      console.log('Playing chord:', Sounds.chord)
      playSound(Sounds.chord, 0.6)
    } else if (type === 'warning') {
      console.log('Playing ding:', Sounds.ding)
      playSound(Sounds.ding, 0.5)
    } else if (type === 'success') {
      console.log('Playing tada:', Sounds.tada)
      playSound(Sounds.tada, 0.5)
    } else {
      console.log('Playing ding (info):', Sounds.ding)
      playSound(Sounds.ding, 0.4)
    }
  }, [])

  // Expose globally
  React.useEffect(() => {
    globalShowMessage = showMessage
    ;(window as any).showXpMessage = showMessage
    return () => {
      globalShowMessage = null
      delete (window as any).showXpMessage
    }
  }, [showMessage])

  const current = queue[0] || null

  const handleButton = (label: string) => {
    if (current?.onButton) {
      current.onButton(label)
    }
    setQueue((q) => q.slice(1))
  }

  const iconSrc = current
    ? (current.type === 'error' || current.type === 'critical')
      ? Icon.error32
      : current.type === 'warning'
        ? Icon.security32
        : current.type === 'success'
          ? Icon.help32
          : Icon.info16
    : Icon.info16

  const defaultTitle =
    current?.type === 'critical'
      ? 'Erro Fatal'
      : current?.type === 'error'
        ? 'Erro'
        : current?.type === 'warning'
          ? 'Aviso'
          : current?.type === 'success'
            ? 'Sucesso'
            : 'Informação'

  const buttons = current?.buttons || ['OK']

  return (
    <MsgBoxContext.Provider value={{ showMessage }}>
      {children}
      {current && (
        <Overlay>
          <DialogRoot>
            <DialogTitleBar>
              <DialogTitleIcon src={iconSrc} alt="" />
              <DialogTitleText>{current.title || defaultTitle}</DialogTitleText>
              <CloseBtn onClick={() => handleButton(buttons[buttons.length - 1])}>
                <span />
              </CloseBtn>
            </DialogTitleBar>
            <DialogBody>
              <DialogIcon src={iconSrc} alt="" />
              <DialogMessage>{current.message}</DialogMessage>
            </DialogBody>
            <DialogButtons>
              {buttons.map((b) => (
                <DialogBtn key={b} onClick={() => handleButton(b)} autoFocus={b === buttons[0]}>
                  {b}
                </DialogBtn>
              ))}
            </DialogButtons>
          </DialogRoot>
        </Overlay>
      )}
    </MsgBoxContext.Provider>
  )
}

const appear = keyframes`
  from { transform: scale(0.92); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
`

const DialogRoot = styled.div`
  min-width: 320px;
  max-width: 460px;
  background: #ece9d8;
  border: 1px solid #0831d9;
  border-radius: 8px 8px 4px 4px;
  box-shadow: 3px 3px 12px rgba(0, 0, 0, 0.45);
  font-family: ${theme.fonts.ui};
  animation: ${appear} 0.15s ease-out;
  overflow: hidden;
`

const DialogTitleBar = styled.div`
  height: 26px;
  display: flex;
  align-items: center;
  padding: 0 4px 0 6px;
  background: linear-gradient(180deg, #0058e6 0%, #3a93ff 8%, #0153d2 40%, #0148c0 88%, #003fa0 100%);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.4);
  gap: 4px;
`

const DialogTitleIcon = styled.img`
  width: 16px;
  height: 16px;
`

const DialogTitleText = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CloseBtn = styled.button`
  width: 22px;
  height: 22px;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 3px;
  background: radial-gradient(circle at 30% 30%, #f89c8a 0%, #e03e2f 50%, #a1110b 100%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:hover { filter: brightness(1.1); }
  span {
    display: block;
    width: 10px;
    height: 10px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><g stroke='white' stroke-width='2' stroke-linecap='round'><line x1='1' y1='1' x2='9' y2='9'/><line x1='9' y1='1' x2='1' y2='9'/></g></svg>");
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: center;
  }
`

const DialogBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 18px 14px;
`

const DialogIcon = styled.img`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
`

const DialogMessage = styled.div`
  flex: 1;
  font-size: 11px;
  line-height: 1.5;
  color: #000;
  word-wrap: break-word;
  white-space: pre-wrap;
`

const DialogButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 18px 14px;
`

const DialogBtn = styled.button`
  min-width: 75px;
  padding: 4px 14px;
  background: linear-gradient(180deg, #f6f4ec 0%, #ece9d8 45%, #c8c2a8 100%);
  border: 1px solid #003c74;
  border-radius: 3px;
  font-family: ${theme.fonts.ui};
  font-size: 11px;
  cursor: pointer;
  color: #000;
  box-shadow: inset 0 1px 0 #fff, inset 0 -1px 0 #8c846c;
  &:hover {
    background: linear-gradient(180deg, #fcfbf6 0%, #eae7d6 45%, #c2bda3 100%);
  }
  &:active {
    background: linear-gradient(0deg, #f6f4ec 0%, #d9d4bf 100%);
    box-shadow: inset 1px 1px 1px rgba(0, 0, 0, 0.25);
  }
  &:focus {
    outline: 1px dotted #000;
    outline-offset: -4px;
  }
`
