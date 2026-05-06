import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react'
import type { AppDefinition, AppInstance } from './types'
import { useVirtualFS } from './VirtualFileSystem'

interface State {
  instances: AppInstance[]
  nextId: number
  nextZ: number
  focusedId: number | null
}

type Action =
  | { type: 'OPEN'; def: AppDefinition; args?: unknown }
  | { type: 'CLOSE'; id: number }
  | { type: 'FOCUS'; id: number }
  | { type: 'MINIMIZE'; id: number }
  | { type: 'TOGGLE_MAX'; id: number }
  | { type: 'MOVE'; id: number; x: number; y: number }
  | { type: 'RESIZE'; id: number; width: number; height: number; x?: number; y?: number }
  | { type: 'RESTORE'; id: number }

const initial: State = { instances: [], nextId: 1, nextZ: 10, focusedId: null }

function centerFor(w: number, h: number, idx: number): { x: number; y: number } {
  const cw = typeof window !== 'undefined' ? window.innerWidth : 1280
  const ch = typeof window !== 'undefined' ? window.innerHeight - 30 : 770
  const offset = (idx % 8) * 24
  return {
    x: Math.max(10, Math.round((cw - w) / 2) + offset),
    y: Math.max(10, Math.round((ch - h) / 2) + offset - 40)
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN': {
      const def = action.def
      if (!def.multiInstance) {
        const existing = state.instances.find((i) => i.defId === def.id)
        if (existing) {
          const z = state.nextZ + 1
          return {
            ...state,
            nextZ: z,
            focusedId: existing.id,
            instances: state.instances.map((i) =>
              i.id === existing.id ? { ...i, zIndex: z, minimized: false } : i
            )
          }
        }
      }
      const w = def.defaultSize?.width ?? 640
      const h = def.defaultSize?.height ?? 480
      const pos = centerFor(w, h, state.nextId)
      const inst: AppInstance = {
        id: state.nextId,
        defId: def.id,
        title: def.title,
        icon: def.icon,
        x: pos.x,
        y: pos.y,
        width: w,
        height: h,
        zIndex: state.nextZ + 1,
        minimized: false,
        maximized: false,
        args: action.args
      }
      return {
        ...state,
        instances: [...state.instances, inst],
        nextId: state.nextId + 1,
        nextZ: state.nextZ + 1,
        focusedId: inst.id
      }
    }
    case 'CLOSE': {
      const instances = state.instances.filter((i) => i.id !== action.id)
      const top = instances.reduce<AppInstance | null>(
        (acc, cur) => (!cur.minimized && (!acc || cur.zIndex > acc.zIndex) ? cur : acc),
        null
      )
      return { ...state, instances, focusedId: top ? top.id : null }
    }
    case 'FOCUS': {
      const z = state.nextZ + 1
      return {
        ...state,
        nextZ: z,
        focusedId: action.id,
        instances: state.instances.map((i) =>
          i.id === action.id ? { ...i, zIndex: z, minimized: false } : i
        )
      }
    }
    case 'MINIMIZE': {
      return {
        ...state,
        focusedId: state.focusedId === action.id ? null : state.focusedId,
        instances: state.instances.map((i) =>
          i.id === action.id ? { ...i, minimized: true } : i
        )
      }
    }
    case 'TOGGLE_MAX':
      return {
        ...state,
        instances: state.instances.map((i) =>
          i.id === action.id ? { ...i, maximized: !i.maximized } : i
        )
      }
    case 'MOVE':
      return {
        ...state,
        instances: state.instances.map((i) =>
          i.id === action.id ? { ...i, x: action.x, y: action.y } : i
        )
      }
    case 'RESIZE':
      return {
        ...state,
        instances: state.instances.map((i) =>
          i.id === action.id
            ? {
                ...i,
                width: action.width,
                height: action.height,
                x: action.x ?? i.x,
                y: action.y ?? i.y
              }
            : i
        )
      }
    case 'RESTORE':
      return {
        ...state,
        instances: state.instances.map((i) =>
          i.id === action.id ? { ...i, minimized: false } : i
        )
      }
    default:
      return state
  }
}

interface Ctx {
  instances: AppInstance[]
  focusedId: number | null
  open: (def: AppDefinition, args?: unknown) => void
  close: (id: number) => void
  focus: (id: number) => void
  minimize: (id: number) => void
  restore: (id: number) => void
  toggleMax: (id: number) => void
  move: (id: number, x: number, y: number) => void
  resize: (id: number, w: number, h: number, x?: number, y?: number) => void
  registerApp: (def: AppDefinition) => void
  getDef: (id: string) => AppDefinition | undefined
  apps: AppDefinition[]
}

const WindowCtx = createContext<Ctx | null>(null)

export const WindowSystemProvider: React.FC<{ children: React.ReactNode; apps: AppDefinition[] }> = ({
  children,
  apps
}) => {
  const [state, dispatch] = useReducer(reducer, initial)
  const registry = useRef<Map<string, AppDefinition>>(new Map(apps.map((a) => [a.id, a])))

  const api: Ctx = useMemo(
    () => ({
      instances: state.instances,
      focusedId: state.focusedId,
      apps,
      open: (def, args) => dispatch({ type: 'OPEN', def, args }),
      close: (id) => dispatch({ type: 'CLOSE', id }),
      focus: (id) => dispatch({ type: 'FOCUS', id }),
      minimize: (id) => dispatch({ type: 'MINIMIZE', id }),
      restore: (id) => dispatch({ type: 'RESTORE', id }),
      toggleMax: (id) => dispatch({ type: 'TOGGLE_MAX', id }),
      move: (id, x, y) => dispatch({ type: 'MOVE', id, x, y }),
      resize: (id, width, height, x, y) =>
        dispatch({ type: 'RESIZE', id, width, height, x, y }),
      registerApp: (def) => registry.current.set(def.id, def),
      getDef: (id) => registry.current.get(id)
    }),
    [state.instances, state.focusedId, apps]
  )
  return <WindowCtx.Provider value={api}>{children}</WindowCtx.Provider>
}

export function useWindows(): Ctx {
  const v = useContext(WindowCtx)
  if (!v) throw new Error('WindowSystemProvider missing')
  return v
}

export function useOpenApp(): (defId: string, args?: unknown) => void {
  const ctx = useWindows()
  const { files } = useVirtualFS()
  return useCallback(
    (defId, args) => {
      const def = ctx.getDef(defId)
      if (def) {
        // Verificar se o app precisa de um arquivo virtual e se ele ainda existe
        const requiresExe = ['paint', 'notepad', 'cmd', 'ie'] // apps que podem ser deletados
        if (requiresExe.includes(defId)) {
          const exeExists = files.some(f => f.appId === defId && f.name.toLowerCase().endsWith('.exe') && f.deletedAt === undefined)
          if (!exeExists) {
            // Em vez de chamar showXpMessage que pode dar erro se o contexto não estiver montado na árvore certa,
            // ou se causar problemas com as janelas, usamos a versão global se existir, senão alert.
            // Para ser 100% seguro em qualquer lugar.
            const globalShowMessage = (window as any).showXpMessage
            if (globalShowMessage) {
              globalShowMessage({
                title: 'Erro',
                message: `O arquivo executável para o aplicativo '${def.title}' não foi encontrado.`,
                type: 'error'
              })
            } else {
              alert(`Erro: O arquivo executável para o aplicativo '${def.title}' não foi encontrado.`)
            }
            return
          }
        }
        ctx.open(def, args)
      }
    },
    [ctx, files]
  )
}
