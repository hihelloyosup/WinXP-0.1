import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import blissUrl from '../assets/wallpapers/bliss.png'
import { Icon } from './icons'
import { useOpenApp } from './WindowSystem'
import { useVirtualFS } from './VirtualFileSystem'
import { APPS } from './apps'

const GRID_COLS = 8
const GRID_ROWS = 4
const CELL_W = 80
const CELL_H = 86

export interface DesktopIconDef {
  id: string
  title: string
  icon: string
  appId: string
  gridX: number // column (0-based)
  gridY: number // row (0-based)
  vfsId?: string
}

interface Props {
  icons: DesktopIconDef[]
  wallpaperName?: string
  onIconsChange?: (icons: DesktopIconDef[]) => void
  children?: React.ReactNode
}

function snapToGrid(px: number, py: number): { gx: number; gy: number } {
  const gx = Math.max(0, Math.min(GRID_COLS - 1, Math.round(px / CELL_W)))
  const gy = Math.max(0, Math.min(GRID_ROWS - 1, Math.round(py / CELL_H)))
  return { gx, gy }
}

function findFreeSlot(
  icons: DesktopIconDef[],
  desiredX: number,
  desiredY: number,
  excludeId: string
): { gx: number; gy: number } {
  const occupied = new Set(
    icons.filter((i) => i.id !== excludeId).map((i) => `${i.gridX},${i.gridY}`)
  )
  if (!occupied.has(`${desiredX},${desiredY}`)) return { gx: desiredX, gy: desiredY }
  // Search nearby
  for (let r = 1; r < GRID_COLS + GRID_ROWS; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        const nx = desiredX + dx
        const ny = desiredY + dy
        if (nx < 0 || nx >= GRID_COLS || ny < 0 || ny >= GRID_ROWS) continue
        if (!occupied.has(`${nx},${ny}`)) return { gx: nx, gy: ny }
      }
    }
  }
  return { gx: desiredX, gy: desiredY }
}

const wallpaperByName: Record<string, string> = {
  Bliss: blissUrl,
  Praia: 'https://win98icons.alexmeub.com/images/beach.jpg',
  Outono: 'https://win98icons.alexmeub.com/images/autumn.jpg',
  Floresta: 'https://win98icons.alexmeub.com/images/forest.jpg',
  Azul: ''
}

export const Desktop: React.FC<Props> = ({ icons, wallpaperName = 'Bliss', onIconsChange, children }) => {
  const openApp = useOpenApp()
  const { files, createFile, deleteFile, getTrash } = useVirtualFS()
  const [selected, setSelected] = useState<string | null>(null)
  const [sel, setSel] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)
  const [promptValue1, setPromptValue1] = useState('')
  const [promptValue2, setPromptValue2] = useState('')
  const dragOffset = useRef<{ ox: number; oy: number }>({ ox: 0, oy: 0 })
  const gridRef = useRef<HTMLDivElement>(null)

  const iconsWithRecycleState = useMemo(() => {
    const recycleIsFull = getTrash().length > 0
    return icons
      .filter((icon) => {
        const requiresExe = ['paint', 'notepad', 'cmd', 'ie']
        if (requiresExe.includes(icon.appId)) {
          return files.some(f => f.appId === icon.appId && f.name?.toLowerCase().endsWith('.exe') && f.deletedAt === undefined)
        }
        return true
      })
      .map((icon) => {
        if (icon.id === 'recycle') {
          return {
            ...icon,
            icon: recycleIsFull ? Icon.recycleFull32 : Icon.recycleEmpty32
          }
        }
        return icon
      })
  }, [icons, files, getTrash])

  const onBgMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-xp-icon]')) return
      setSelected(null)
      const sx = e.clientX
      const sy = e.clientY
      const onMove = (ev: MouseEvent): void => {
        const x = Math.min(sx, ev.clientX)
        const y = Math.min(sy, ev.clientY)
        const w = Math.abs(sx - ev.clientX)
        const h = Math.abs(sy - ev.clientY)
        setSel({ x, y, w, h })
      }
      const onUp = (): void => {
        setSel(null)
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    []
  )

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Right-click detectado:', e.clientX, e.clientY)
    if ((e.target as HTMLElement).closest('[data-xp-icon]')) {
      console.log('Click em ícone, ignorando')
      return
    }
    console.log('Abrindo context menu')
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  const [promptState, setPromptState] = useState<{ text: string; text2?: string; onConfirm: (val1: string, val2?: string) => void; onCancel: () => void } | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selected && !promptState) {
        const icon = icons.find(i => i.id === selected)
        if (icon) {
          if (icon.id === 'recycle' || icon.id === 'myComputer') return
          
          if (onIconsChange) {
            onIconsChange(icons.filter(i => i.id !== icon.id))
          }
          if (icon.vfsId) {
            deleteFile(icon.vfsId)
          }
          setSelected(null)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected, icons, onIconsChange, promptState, deleteFile])

  const createDesktopItem = useCallback((type: 'file' | 'folder' | 'shortcut') => {
    const promptText =
      type === 'file' ? 'Digite o nome do documento:' :
      type === 'folder' ? 'Digite o nome da pasta:' :
      'Digite o nome do atalho:'
    
    const promptText2 = type === 'shortcut' ? 'Digite o ID do app (ex: notepad, paint, calculator):' : undefined

    setPromptValue1('')
    setPromptValue2('')
    setPromptState({
      text: promptText,
      text2: promptText2,
      onConfirm: (name, appIdStr) => {
        setPromptState(null)
        if (!name || !name.trim()) return
        
        // Encontrar posição livre na grid ANTES de criar
        const { gx, gy } = findFreeSlot(icons, 0, 0, '')
        
        let icon, appId, vfsId
        if (type === 'folder') {
          icon = Icon.folder32
          appId = 'myDocuments'
          vfsId = createFile(name.trim(), 'folder', 'desktop')
        } else if (type === 'shortcut') {
          if (!appIdStr) {
            alert('Erro: É necessário informar o ID do app!')
            return
          }
          const app = APPS.find(a => a.id === appIdStr.trim())
          if (!app) {
            alert(`Erro: App com ID "${appIdStr.trim()}" não encontrado!`)
            return
          }
          icon = app.icon
          appId = app.id
          vfsId = createFile(name.trim() + '.lnk', 'file', 'desktop', '', appId)
        } else {
          icon = Icon.notepad32
          appId = 'notepad'
          vfsId = createFile(name.trim() + '.txt', 'file', 'desktop', '', appId)
        }
        
        const newIcon: DesktopIconDef = {
          id: `desktop-${Date.now()}`,
          title: name.trim(),
          icon: icon,
          appId: appId,
          gridX: gx,
          gridY: gy,
          vfsId: vfsId
        }
        
        if (onIconsChange) {
          const newIcons = [...icons, newIcon]
          onIconsChange(newIcons)
        }
      },
      onCancel: () => setPromptState(null)
    })
    
    setContextMenu(null)
  }, [icons, onIconsChange])

  const onIconPointerDown = useCallback(
    (e: React.PointerEvent, icon: DesktopIconDef) => {
      e.stopPropagation()
      setSelected(icon.id)

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      dragOffset.current = { ox: e.clientX - rect.left, oy: e.clientY - rect.top }

      let moved = false
      const onMove = (ev: PointerEvent): void => {
        moved = true
        setDragId(icon.id)
        setDragPos({
          x: ev.clientX - dragOffset.current.ox,
          y: ev.clientY - dragOffset.current.oy
        })
      }
      const onUp = (ev: PointerEvent): void => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        
        if (moved) {
          // Verificar se foi solto sobre a célula da lixeira (sem selector :has).
          const recycleIcon = icons.find((i) => i.id === 'recycle')
          if (recycleIcon && icon.id !== 'recycle' && gridRef.current) {
            const gridRect = gridRef.current.getBoundingClientRect()
            const recycleRect = {
              left: gridRect.left + recycleIcon.gridX * CELL_W,
              top: gridRect.top + recycleIcon.gridY * CELL_H,
              right: gridRect.left + recycleIcon.gridX * CELL_W + CELL_W,
              bottom: gridRect.top + recycleIcon.gridY * CELL_H + CELL_H
            }
            if (
              ev.clientX >= recycleRect.left &&
              ev.clientX <= recycleRect.right &&
              ev.clientY >= recycleRect.top &&
              ev.clientY <= recycleRect.bottom
            ) {
              if (onIconsChange) {
                onIconsChange(icons.filter((i) => i.id !== icon.id))
              }
              if (icon.vfsId) {
                deleteFile(icon.vfsId)
              }
              setDragId(null)
              setDragPos(null)
              setSelected(null)
              return
            }
          }
          
          // Caso contrário, mover na grid
          if (gridRef.current && onIconsChange) {
            const gridRect = gridRef.current.getBoundingClientRect()
            const relX = ev.clientX - dragOffset.current.ox - gridRect.left
            const relY = ev.clientY - dragOffset.current.oy - gridRect.top
            const { gx: rawX, gy: rawY } = snapToGrid(relX, relY)
            const { gx, gy } = findFreeSlot(icons, rawX, rawY, icon.id)
            onIconsChange(
              icons.map((ic) => (ic.id === icon.id ? { ...ic, gridX: gx, gridY: gy } : ic))
            )
          }
        }
        
        setDragId(null)
        setDragPos(null)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [icons, onIconsChange, deleteFile]
  )

  return (
    <DesktopRoot onMouseDown={onBgMouseDown} onContextMenu={onContextMenu} $bg={wallpaperByName[wallpaperName] ?? blissUrl}>
      <IconGrid ref={gridRef}>
        {iconsWithRecycleState.map((it) => {
          const isDragging = dragId === it.id
          const style: React.CSSProperties = isDragging && dragPos
            ? { position: 'fixed', left: dragPos.x, top: dragPos.y, zIndex: 9999, opacity: 0.8 }
            : { gridColumn: it.gridX + 1, gridRow: it.gridY + 1 }
          return (
            <IconCell
              key={it.id}
              data-xp-icon="1"
              $selected={selected === it.id}
              style={style}
              onPointerDown={(e) => onIconPointerDown(e, it)}
              onDoubleClick={() => openApp(it.appId)}
            >
              <IconImg src={it.icon} alt={it.title} $selected={selected === it.id} />
              <IconLabel $selected={selected === it.id}>{it.title}</IconLabel>
            </IconCell>
          )
        })}
      </IconGrid>
      {sel && (
        <SelectionRect
          style={{ left: sel.x, top: sel.y, width: sel.w, height: sel.h }}
        />
      )}
      {contextMenu && (
        <>
          <ContextMenuBackdrop onMouseDown={() => setContextMenu(null)} />
          <ContextMenu style={{ position: 'fixed', left: contextMenu.x, top: contextMenu.y }}>
            <ContextMenuItem onMouseDown={(e) => { e.stopPropagation(); createDesktopItem('file'); setContextMenu(null) }}>Novo documento</ContextMenuItem>
            <ContextMenuItem onMouseDown={(e) => { e.stopPropagation(); createDesktopItem('folder'); setContextMenu(null) }}>Nova pasta</ContextMenuItem>
            <ContextMenuItem onMouseDown={(e) => { e.stopPropagation(); createDesktopItem('shortcut'); setContextMenu(null) }}>Novo atalho</ContextMenuItem>
          </ContextMenu>
        </>
      )}
      {children}
      {promptState && (
        <PromptOverlay onMouseDown={(e) => e.stopPropagation()}>
          <PromptDialog>
            <div className="title-bar">
              <div className="title-bar-text">Nova Entrada</div>
              <div className="title-bar-controls">
                <button aria-label="Close" onClick={promptState.onCancel}></button>
              </div>
            </div>
            <div className="window-body">
              <p>{promptState.text}</p>
              <input
                autoFocus
                type="text"
                value={promptValue1}
                onChange={(e) => setPromptValue1(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !promptState.text2) {
                    promptState.onConfirm(promptValue1)
                  }
                  if (e.key === 'Escape') promptState.onCancel()
                }}
              />
              {promptState.text2 && (
                <>
                  <p style={{ marginTop: 8 }}>{promptState.text2}</p>
                  <input
                    type="text"
                    value={promptValue2}
                    onChange={(e) => setPromptValue2(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        promptState.onConfirm(promptValue1, promptValue2)
                      }
                      if (e.key === 'Escape') promptState.onCancel()
                    }}
                  />
                </>
              )}
              <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => {
                  promptState.onConfirm(promptValue1, promptValue2)
                }}>OK</button>
                <button onClick={promptState.onCancel}>Cancelar</button>
              </div>
            </div>
          </PromptDialog>
        </PromptOverlay>
      )}
    </DesktopRoot>
  )
}

Desktop.displayName = 'Desktop'

let col = 0
let row = 0
function nextSlot(): { gridX: number; gridY: number } {
  const s = { gridX: col, gridY: row }
  row++
  if (row >= GRID_ROWS) {
    row = 0
    col++
  }
  return s
}

export const DefaultDesktopIcons: DesktopIconDef[] = [
  { id: 'myComputer', title: 'Meu Computador', icon: Icon.myComputer32, appId: 'myComputer', ...nextSlot() },
  { id: 'ie', title: 'Internet Explorer', icon: Icon.ieBig, appId: 'ie', ...nextSlot() },
  { id: 'recycle', title: 'Lixeira', icon: Icon.recycleFull32, appId: 'recycleBin', ...nextSlot() }
]

const PromptOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PromptDialog = styled.div`
  width: 300px;
  background: #ECE9D8;
  border: 1px solid #0055EA;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;

  .title-bar {
    background: linear-gradient(to bottom, #0058e6 0%, #3a93ff 100%);
    padding: 3px 5px 3px 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-weight: bold;
  }
  
  .title-bar-controls button {
    width: 21px;
    height: 21px;
    background: #ff5c5c;
    border: 1px solid white;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
  }
  
  .title-bar-controls button::before,
  .title-bar-controls button::after {
    content: '';
    position: absolute;
    left: 9px;
    top: 4px;
    width: 2px;
    height: 11px;
    background: #fff;
  }
  
  .title-bar-controls button::before {
    transform: rotate(45deg);
  }
  
  .title-bar-controls button::after {
    transform: rotate(-45deg);
  }

  .window-body {
    padding: 12px;
  }

  input {
    width: 100%;
    padding: 3px;
    margin-top: 8px;
    border: 1px solid #7F9DB9;
  }

  button {
    min-width: 75px;
    padding: 3px 10px;
    background: #ECE9D8;
    border: 1px solid #003C74;
    border-radius: 3px;
    cursor: pointer;
    font-family: 'Tahoma', sans-serif;
    font-size: 11px;
    
    &:hover {
      background: #E3E0C8;
    }
  }
`

const DesktopRoot = styled.div<{ $bg: string }>`
  position: fixed;
  inset: 0 0 30px 0;
  background: ${(p) => (p.$bg ? `url(${p.$bg}) center/cover no-repeat, #245edc` : '#3a6ea5')};
  overflow: hidden;
`

const IconGrid = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  bottom: 12px;
  display: grid;
  grid-template-columns: repeat(${GRID_COLS}, ${CELL_W}px);
  grid-template-rows: repeat(${GRID_ROWS}, ${CELL_H}px);
`

const IconCell = styled.div<{ $selected: boolean }>`
  width: ${CELL_W}px;
  height: ${CELL_H}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: default;
  padding-top: 4px;
  user-select: none;
`

const IconImg = styled.img<{ $selected: boolean }>`
  width: 36px;
  height: 36px;
  image-rendering: pixelated;
  filter: ${(p) =>
    p.$selected ? 'drop-shadow(0 0 1px #4477ff) brightness(0.85)' : 'drop-shadow(1px 1px 1px rgba(0,0,0,0.35))'};
`

const IconLabel = styled.div<{ $selected: boolean }>`
  color: #fff;
  font-size: 11px;
  font-family: 'Tahoma', sans-serif;
  text-align: center;
  line-height: 1.2;
  max-width: 78px;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.8);
  background: ${(p) => (p.$selected ? '#0b61ff' : 'transparent')};
  padding: 1px 3px;
  border: ${(p) => (p.$selected ? '1px dotted #fff' : '1px solid transparent')};
  border-radius: 1px;
`

const SelectionRect = styled.div`
  position: fixed;
  pointer-events: none;
  border: 1px dotted #fff;
  background: rgba(59, 136, 230, 0.25);
`

const ContextMenuBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: auto;
`

const ContextMenu = styled.div`
  background: #ece9d8;
  border: 1px solid #dfdfdf;
  border-radius: 0;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  min-width: 160px;
`

const ContextMenuItem = styled.div`
  padding: 4px 12px;
  cursor: default;
  font-family: 'Tahoma', sans-serif;
  font-size: 11px;
  color: #000;
  user-select: none;

  &:hover {
    background: #0a246a;
    color: #fff;
  }
`
