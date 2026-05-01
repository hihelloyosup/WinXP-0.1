import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import type { AppInstance } from './types'
import { useWindows } from './WindowSystem'
import { theme } from './theme'

interface Props {
  instance: AppInstance
  focused: boolean
  children: React.ReactNode
  resizable?: boolean
  minSize?: { width: number; height: number }
}

const MIN_W = 260
const MIN_H = 160

export const XpWindow: React.FC<Props> = ({ instance, focused, children, resizable = true, minSize }) => {
  const { move, resize, minimize, toggleMax, close, focus } = useWindows()
  const dragRef = useRef<{
    startX: number
    startY: number
    origX: number
    origY: number
    origW: number
    origH: number
    mode: 'move' | 'resize' | 'resize-n' | 'resize-s' | 'resize-w' | 'resize-e' | 'resize-ne' | 'resize-nw' | 'resize-se' | 'resize-sw'
  } | null>(null)
  const [, force] = useState(0)

  const onPointerDown = useCallback(
    (mode: 'move' | 'resize-n' | 'resize-s' | 'resize-w' | 'resize-e' | 'resize-ne' | 'resize-nw' | 'resize-se' | 'resize-sw') =>
      (e: React.PointerEvent) => {
        if (instance.maximized && mode !== 'move') return
        if (instance.maximized && mode === 'move') return
        e.preventDefault()
        focus(instance.id)
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          origX: instance.x,
          origY: instance.y,
          origW: instance.width,
          origH: instance.height,
          mode
        }
        const onMove = (ev: PointerEvent): void => {
          const d = dragRef.current
          if (!d) return
          const dx = ev.clientX - d.startX
          const dy = ev.clientY - d.startY
          const mw = minSize?.width ?? MIN_W
          const mh = minSize?.height ?? MIN_H
          if (d.mode === 'move') {
            move(instance.id, d.origX + dx, d.origY + dy)
          } else {
            let nx = d.origX
            let ny = d.origY
            let nw = d.origW
            let nh = d.origH
            if (d.mode.includes('e')) nw = Math.max(mw, d.origW + dx)
            if (d.mode.includes('s')) nh = Math.max(mh, d.origH + dy)
            if (d.mode.includes('w')) {
              const w2 = Math.max(mw, d.origW - dx)
              nx = d.origX + (d.origW - w2)
              nw = w2
            }
            if (d.mode.includes('n')) {
              const h2 = Math.max(mh, d.origH - dy)
              ny = d.origY + (d.origH - h2)
              nh = h2
            }
            resize(instance.id, nw, nh, nx, ny)
          }
          force((t) => t + 1)
        }
        const onUp = (): void => {
          dragRef.current = null
          window.removeEventListener('pointermove', onMove)
          window.removeEventListener('pointerup', onUp)
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
      },
    [focus, instance.id, instance.maximized, instance.x, instance.y, instance.width, instance.height, minSize, move, resize]
  )

  useEffect(() => {
    if (!instance.maximized) return
    const h = (): void => force((t) => t + 1)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [instance.maximized])

  const isMax = instance.maximized
  const style: React.CSSProperties = isMax
    ? { left: 0, top: 0, width: '100vw', height: 'calc(100vh - 30px)', zIndex: instance.zIndex }
    : {
        left: instance.x,
        top: instance.y,
        width: instance.width,
        height: instance.height,
        zIndex: instance.zIndex
      }

  if (instance.minimized) return null

  return (
    <WindowRoot
      style={style}
      $focused={focused}
      onPointerDown={() => focus(instance.id)}
    >
      <TitleBar
        $focused={focused}
        onPointerDown={onPointerDown('move')}
        onDoubleClick={() => toggleMax(instance.id)}
      >
        <TitleIcon src={instance.icon} alt="" />
        <TitleText>{instance.title}</TitleText>
        <TitleButtons onPointerDown={(e) => e.stopPropagation()}>
          <TitleBtn
            $variant="min"
            onClick={() => minimize(instance.id)}
            aria-label="Minimize"
          >
            <span />
          </TitleBtn>
          <TitleBtn
            $variant={isMax ? 'restore' : 'max'}
            onClick={() => toggleMax(instance.id)}
            aria-label="Maximize"
          >
            <span />
          </TitleBtn>
          <TitleBtn $variant="close" onClick={() => close(instance.id)} aria-label="Close">
            <span />
          </TitleBtn>
        </TitleButtons>
      </TitleBar>
      <WindowBody>{children}</WindowBody>
      {resizable && !isMax && (
        <>
          <Edge $side="n" onPointerDown={onPointerDown('resize-n')} />
          <Edge $side="s" onPointerDown={onPointerDown('resize-s')} />
          <Edge $side="w" onPointerDown={onPointerDown('resize-w')} />
          <Edge $side="e" onPointerDown={onPointerDown('resize-e')} />
          <Corner $side="nw" onPointerDown={onPointerDown('resize-nw')} />
          <Corner $side="ne" onPointerDown={onPointerDown('resize-ne')} />
          <Corner $side="sw" onPointerDown={onPointerDown('resize-sw')} />
          <Corner $side="se" onPointerDown={onPointerDown('resize-se')} />
        </>
      )}
    </WindowRoot>
  )
}

const WindowRoot = styled.div<{ $focused: boolean }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.windowBg};
  border: 1px solid ${(p) => (p.$focused ? '#0831d9' : '#7f9db9')};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  box-shadow: ${(p) =>
    p.$focused ? '2px 2px 10px rgba(0,0,0,0.35)' : '1px 1px 4px rgba(0,0,0,0.25)'};
  overflow: hidden;
`

const TitleBar = styled.div<{ $focused: boolean }>`
  height: 28px;
  display: flex;
  align-items: center;
  padding: 0 2px 0 5px;
  color: #fff;
  font-family: ${theme.fonts.ui};
  font-weight: bold;
  font-size: 12px;
  cursor: default;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.4);
  background: ${(p) => (p.$focused ? theme.gradients.titleActive : theme.gradients.titleInactive)};
  border-bottom: 1px solid ${(p) => (p.$focused ? '#0831d9' : '#7f9db9')};
  flex-shrink: 0;
`

const TitleIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  flex-shrink: 0;
`

const TitleText = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 4px;
`

const TitleButtons = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`

const btnBase = css`
  width: 22px;
  height: 22px;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:active { filter: brightness(0.9); }
  span { display: block; width: 10px; height: 10px; background-size: 10px 10px; background-repeat: no-repeat; background-position: center; }
`

const TitleBtn = styled.button<{ $variant: 'min' | 'max' | 'restore' | 'close' }>`
  ${btnBase}
  background: ${(p) =>
    p.$variant === 'close'
      ? 'radial-gradient(circle at 30% 30%, #f89c8a 0%, #e03e2f 50%, #a1110b 100%)'
      : 'linear-gradient(180deg, #6ca7ee 0%, #2b5dd1 50%, #1c3f99 100%)'};
  &:hover { filter: brightness(1.1); }
  span {
    ${(p) =>
      p.$variant === 'close' &&
      css`
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><g stroke='white' stroke-width='2' stroke-linecap='round'><line x1='1' y1='1' x2='9' y2='9'/><line x1='9' y1='1' x2='1' y2='9'/></g></svg>");
      `}
    ${(p) =>
      p.$variant === 'min' &&
      css`
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><rect x='1' y='7' width='8' height='2' fill='white'/></svg>");
        align-items: flex-end;
      `}
    ${(p) =>
      p.$variant === 'max' &&
      css`
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><rect x='1' y='1' width='8' height='8' fill='none' stroke='white' stroke-width='1.5'/><rect x='1' y='1' width='8' height='2' fill='white'/></svg>");
      `}
    ${(p) =>
      p.$variant === 'restore' &&
      css`
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'><rect x='3' y='1' width='6' height='6' fill='none' stroke='white' stroke-width='1'/><rect x='1' y='3' width='6' height='6' fill='%230058ee' stroke='white' stroke-width='1'/></svg>");
      `}
  }
`

const WindowBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${theme.colors.windowBg};
`

const Edge = styled.div<{ $side: 'n' | 's' | 'w' | 'e' }>`
  position: absolute;
  ${(p) =>
    p.$side === 'n' && 'left:5px;right:5px;top:-3px;height:6px;cursor:n-resize;'}
  ${(p) =>
    p.$side === 's' && 'left:5px;right:5px;bottom:-3px;height:6px;cursor:s-resize;'}
  ${(p) =>
    p.$side === 'w' && 'top:5px;bottom:5px;left:-3px;width:6px;cursor:w-resize;'}
  ${(p) =>
    p.$side === 'e' && 'top:5px;bottom:5px;right:-3px;width:6px;cursor:e-resize;'}
`

const Corner = styled.div<{ $side: 'ne' | 'nw' | 'se' | 'sw' }>`
  position: absolute;
  width: 12px;
  height: 12px;
  ${(p) => p.$side === 'nw' && 'top:-3px;left:-3px;cursor:nw-resize;'}
  ${(p) => p.$side === 'ne' && 'top:-3px;right:-3px;cursor:ne-resize;'}
  ${(p) => p.$side === 'sw' && 'bottom:-3px;left:-3px;cursor:sw-resize;'}
  ${(p) => p.$side === 'se' && 'bottom:-3px;right:-3px;cursor:se-resize;'}
`
