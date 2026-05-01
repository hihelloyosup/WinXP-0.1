import React, { useMemo, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Icon } from '../icons'
import { theme } from '../theme'
import {
  XpAddressBar,
  XpMenuBar,
  XpMenuItem,
  XpSidePanel,
  XpSidePanelSection,
  XpStatusBar,
  XpStatusField,
  XpToolbar,
  XpToolbarBtn
} from '../ui'
import { useOpenApp } from '../WindowSystem'
import { useVirtualFS } from '../VirtualFileSystem'

type EntryKind = 'drive' | 'folder' | 'file' | 'app' | 'control'

interface Entry {
  name: string
  icon: string
  kind: EntryKind
  detail?: string
  size?: string
  appId?: string
  virtualId?: string
  isRealProjectFile?: boolean
  realPath?: string
}

interface ExplorerProps {
  initialPath?: string
  variant?: 'computer' | 'documents' | 'recycle' | 'pictures' | 'driveC'
}

interface PromptState {
  title: string
  onConfirm: (value: string) => void
}

export const Explorer: React.FC<ExplorerProps> = ({ variant }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string>('root')
  const [selected, setSelected] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [promptState, setPromptState] = useState<PromptState | null>(null)
  const [promptValue, setPromptValue] = useState('')
  const openApp = useOpenApp()
  const { getChildren, createFile, deleteFile, getFileById, getTrash, emptyTrash, deletedRealFiles, deleteRealFile } = useVirtualFS()

  const [projectFiles, setProjectFiles] = useState<Entry[]>([])

  const loadProjectFiles = useCallback(async (dirPath?: string) => {
    if (!window.api) return
    try {
      const pathToRead = dirPath || await window.api.getProjectPath()
      const dirEntries = await window.api.readDir(pathToRead)
      const mapped: Entry[] = dirEntries.map((ent) => {
        const fullPath = (pathToRead.endsWith('\\') ? pathToRead : pathToRead + '\\') + ent.name
        if (ent.isDirectory) {
          return {
            name: ent.name,
            icon: Icon.folder32,
            kind: 'folder',
            detail: 'Pasta (Projeto Real)',
            isRealProjectFile: true,
            realPath: fullPath
          }
        }
        let icon = Icon.notepad16
        const ext = ent.name.toLowerCase().split('.').pop()
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'bmp' || ext === 'gif') {
          icon = Icon.myPictures32
        } else if (ext === 'txt' || ext === 'md' || ext === 'json') {
          icon = Icon.notepad16
        } else if (ext === 'js' || ext === 'ts' || ext === 'tsx' || ext === 'jsx') {
          icon = Icon.cmd16
        } else if (ext === 'lua') {
          icon = Icon.cmd16
        }
        return {
          name: ent.name,
          icon,
          kind: 'file',
          detail: 'Arquivo (Projeto Real)',
          isRealProjectFile: true,
          realPath: fullPath
        }
      })
      
      const filtered = mapped.filter(ent => !deletedRealFiles.includes(ent.realPath!))
      
      filtered.sort((a, b) => {
        if (a.kind === 'folder' && b.kind !== 'folder') return -1
        if (a.kind !== 'folder' && b.kind === 'folder') return 1
        return a.name.localeCompare(b.name)
      })
      setProjectFiles(filtered)
    } catch (e) {
      console.error(e)
    }
  }, [deletedRealFiles])

  useEffect(() => {
    if (currentFolderId.startsWith('real:')) {
      loadProjectFiles(currentFolderId.replace('real:', ''))
    } else {
      loadProjectFiles()
    }
  }, [loadProjectFiles, currentFolderId])

  useEffect(() => {
    if (!window.api?.onFsEvent) return
    
    let timeout: ReturnType<typeof setTimeout>
    const cleanup = window.api.onFsEvent(() => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (currentFolderId.startsWith('real:')) {
          loadProjectFiles(currentFolderId.replace('real:', ''))
        } else {
          loadProjectFiles()
        }
      }, 100)
    })
    return () => {
      clearTimeout(timeout)
      cleanup()
    }
  }, [currentFolderId, loadProjectFiles])

  const entries = useMemo(() => {
    if (variant === 'recycle') {
      const trashFiles = getTrash()
      const recycleEntries: Entry[] = trashFiles.map((v) => {
        let icon = Icon.notepad16
        if (v.type === 'folder') {
          icon = Icon.folder32
        } else if (v.name.toLowerCase().endsWith('.exe') || v.appId) {
          if (v.appId === 'paint') icon = Icon.paint16
          else if (v.appId === 'notepad') icon = Icon.notepad16
          else if (v.appId === 'cmd') icon = Icon.cmd16
          else icon = Icon.myComputer32
        }
        return {
          name: v.name,
          icon,
          kind: v.type === 'folder' ? 'folder' : 'file',
          detail: 'Original: Lixeira',
          virtualId: v.id
        }
      })
      return recycleEntries
    }

    if (currentFolderId === 'root') {
      const virtualEntries = getChildren(currentFolderId)
      const mapped: Entry[] = virtualEntries.map((v) => {
        let icon = Icon.folder32
        if (v.type === 'folder') {
          icon = Icon.folder32
        } else if (v.name.toLowerCase().endsWith('.exe') || v.appId) {
          if (v.appId === 'paint') icon = Icon.paint16
          else if (v.appId === 'notepad') icon = Icon.notepad16
          else if (v.appId === 'cmd') icon = Icon.cmd16
          else icon = Icon.myComputer32
        }
        return {
          name: v.name,
          icon,
          kind: v.type === 'folder' ? 'folder' : 'file',
          detail: v.type === 'folder' ? 'Pasta' : 'Arquivo',
          appId: v.appId,
          virtualId: v.id
        }
      })
      return mapped
    }

    const virtualEntries = getChildren(currentFolderId)
    const mappedVirtualEntries: Entry[] = virtualEntries.map((v) => {
      let icon = Icon.notepad16
      if (v.type === 'folder') {
        icon = Icon.folder32
      } else if (v.name.toLowerCase().endsWith('.exe') || v.appId) {
        if (v.appId === 'paint') icon = Icon.paint16
        else if (v.appId === 'notepad') icon = Icon.notepad16
        else if (v.appId === 'cmd') icon = Icon.cmd16
        else icon = Icon.myComputer32
      }
      return {
        name: v.name,
        icon,
        kind: v.type === 'folder' ? 'folder' : 'file',
        detail: v.type === 'folder' ? 'Pasta' : 'Arquivo',
        appId: v.appId,
        virtualId: v.id
      }
    })
    
    if (currentFolderId.startsWith('real:')) {
      return projectFiles
    }
    
    return currentFolderId === 'system32' ? [...mappedVirtualEntries, ...projectFiles] : mappedVirtualEntries
  }, [variant, currentFolderId, getChildren, getTrash, projectFiles])

  const navigateTo = useCallback((folderId: string) => {
    if (folderId) {
      setHistory((prev) => [...prev, currentFolderId])
    }
    setCurrentFolderId(folderId)
  }, [currentFolderId])

  const goBack = useCallback(() => {
    if (history.length > 0) {
      const last = history[history.length - 1]
      setHistory((prev) => prev.slice(0, -1))
      setCurrentFolderId(last)
    }
  }, [history])

  const goUp = useCallback(async () => {
    if (variant === 'recycle') return
    if (currentFolderId.startsWith('real:')) {
      const realPath = currentFolderId.replace('real:', '')
      const sep = realPath.includes('\\') ? '\\' : '/'
      const parts = realPath.split(sep)
      
      const projectPath = window.api ? await window.api.getProjectPath() : ''
      if (realPath === projectPath || parts.length <= 1) {
        navigateTo('system32')
        return
      }
      
      parts.pop()
      const parentPath = parts.join(sep)
      if (parentPath.length >= projectPath.length) {
        navigateTo('real:' + parentPath)
      } else {
        navigateTo('system32')
      }
      return
    }
    
    if (currentFolderId !== 'root' && currentFolderId !== 'system32') {
      const folder = getFileById(currentFolderId)
      if (folder && folder.parentId) {
        navigateTo(folder.parentId)
      }
    }
  }, [variant, currentFolderId, getFileById, navigateTo])

  const onDouble = useCallback(async (e: Entry) => {
    if (variant === 'recycle') return
    if (e.appId) {
      openApp(e.appId)
      return
    }
    if (e.kind === 'folder') {
      if (e.virtualId) {
        navigateTo(e.virtualId)
      } else if (e.isRealProjectFile && e.realPath) {
        navigateTo('real:' + e.realPath)
      }
    } else if (e.kind === 'file' && e.isRealProjectFile && e.realPath && window.api) {
      await window.api.openFile(e.realPath)
    }
  }, [navigateTo, openApp, variant])

  const displayPath = useMemo(() => {
    if (variant === 'recycle') return 'Lixeira'
    if (currentFolderId.startsWith('real:')) return currentFolderId.replace('real:', '')
    if (currentFolderId === 'root') return 'C:\\'
    if (currentFolderId === 'system32') return 'C:\\system32'
    const folder = getFileById(currentFolderId)
    if (!folder) return 'C:\\'
    return `C:\\${folder.name}`
  }, [currentFolderId, variant, getFileById])

  const createNewFolder = useCallback(() => {
    if (variant === 'recycle' || currentFolderId === 'system32') return
    setPromptValue('')
    setPromptState({
      title: 'Digite o nome da nova pasta:',
      onConfirm: async (value) => {
        const name = value.trim()
        if (!name) return
        if (currentFolderId.startsWith('real:')) {
          const realPath = currentFolderId.replace('real:', '')
          const sep = realPath.includes('\\') ? '\\' : '/'
          if (window.api) await window.api.createDir(realPath + sep + name)
        } else {
          createFile(name, 'folder', currentFolderId)
        }
      }
    })
  }, [currentFolderId, createFile, variant])

  const createNewFile = useCallback(() => {
    if (variant === 'recycle' || currentFolderId === 'system32') return
    setPromptValue('')
    setPromptState({
      title: 'Digite o nome do novo arquivo (ex: documento.txt):',
      onConfirm: async (value) => {
        const name = value.trim()
        if (!name) return
        if (currentFolderId.startsWith('real:')) {
          const realPath = currentFolderId.replace('real:', '')
          const sep = realPath.includes('\\') ? '\\' : '/'
          if (window.api) await window.api.writeFile(realPath + sep + name, '')
        } else {
          createFile(name, 'file', currentFolderId, '')
        }
      }
    })
  }, [currentFolderId, createFile, variant])

  const deleteSelected = useCallback(() => {
    console.log('Delete chamado. Variant:', variant, 'Selected:', selected)
    if (variant === 'recycle' || !selected) {
      console.log('Deletar ignorado')
      return
    }
    const entry = entries.find((e) => e.name === selected)
    console.log('Entry encontrada:', entry)
    if (!entry) return

    if (entry.isRealProjectFile && entry.realPath) {
      const confirmed = window.confirm(
        `Remover "${selected}" apenas nesta simulação?\n\n` +
        'Isso NAO deleta o arquivo real do projeto.'
      )
      if (!confirmed) return
      // Safe mode: never touch real disk files from the simulated Explorer.
      deleteRealFile(entry.realPath)
      setSelected(null)
      return
    }

    if (!entry.virtualId) return
    const confirmed = window.confirm(`Tem certeza que deseja deletar "${selected}"?`)
    if (!confirmed) {
      console.log('User cancelou delete')
      return
    }
    console.log('Deletando arquivo com ID:', entry.virtualId)
    deleteFile(entry.virtualId)
    setSelected(null)
  }, [entries, deleteFile, deleteRealFile, selected, variant])

  return (
    <Root>
      <XpMenuBar>
        <XpMenuItem>
          <u>A</u>rquivo
          <div style={{ position: 'absolute', background: '#fff', border: '1px solid #999', boxShadow: '2px 2px 4px rgba(0,0,0,0.2)', minWidth: '150px', marginTop: '2px', display: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.display = 'block' }} onMouseLeave={(e) => { e.currentTarget.style.display = 'none' }}>
            <div style={{ padding: '4px 12px', cursor: 'default' }} onClick={createNewFolder}>Nova Pasta</div>
            <div style={{ padding: '4px 12px', cursor: 'default' }} onClick={createNewFile}>Novo Documento</div>
            <div style={{ height: '1px', background: '#ccc', margin: '4px 0' }} />
            <div style={{ padding: '4px 12px', cursor: 'default', color: selected ? '#000' : '#999' }} onClick={deleteSelected}>Deletar</div>
          </div>
        </XpMenuItem>
        {['Editar', 'Exibir', 'Favoritos', 'Ferramentas', 'Ajuda'].map((m) => (
          <XpMenuItem key={m}><u>{m[0]}</u>{m.slice(1)}</XpMenuItem>
        ))}
      </XpMenuBar>
      <XpToolbar>
        <XpToolbarBtn $disabled={history.length === 0} onClick={goBack}>
          <img src={Icon.back} alt="" /> Voltar
        </XpToolbarBtn>
        <XpToolbarBtn $disabled><img src={Icon.forward} alt="" /> Avançar</XpToolbarBtn>
        <XpToolbarBtn onClick={goUp}><img src={Icon.folder} alt="" /> Acima</XpToolbarBtn>
        <ToolbarSep />
        <XpToolbarBtn><img src={Icon.refresh} alt="" /> Atualizar</XpToolbarBtn>
        <XpToolbarBtn onClick={() => navigateTo('root')}><img src={Icon.home} alt="" /> Início</XpToolbarBtn>
        <XpToolbarBtn><img src={Icon.history} alt="" /> Histórico</XpToolbarBtn>
      </XpToolbar>
      <XpAddressBar>
        <span className="label">Endereço:</span>
        <input value={displayPath} readOnly />
      </XpAddressBar>
      <Body>
        <XpSidePanel>
          <XpSidePanelSection>
            <header>Tarefas de arquivo</header>
            <ul>
              {variant === 'recycle' && getTrash().length > 0 && (
                <li onClick={() => emptyTrash()}>Esvaziar Lixeira</li>
              )}
              {variant !== 'recycle' && currentFolderId !== 'system32' && (
                <>
                  <li onClick={createNewFolder}>Criar uma nova pasta</li>
                  <li onClick={createNewFile}>Criar um novo documento</li>
                  {selected && <li onClick={deleteSelected}>Deletar</li>}
                </>
              )}
              {variant !== 'recycle' && currentFolderId === 'system32' && selected && (
                <li onClick={deleteSelected}>Deletar</li>
              )}
            </ul>
          </XpSidePanelSection>
          {variant !== 'recycle' && (
            <>
              <XpSidePanelSection>
                <header>Outros locais</header>
                <ul>
                  <li onClick={() => navigateTo('root')}>Meu computador</li>
                  <li onClick={() => openApp('controlPanel')}>Painel de Controle</li>
                </ul>
              </XpSidePanelSection>
              <XpSidePanelSection>
                <header>Detalhes</header>
                <small>{displayPath}</small>
                <br />
                {selected && <small>Selecionado: <b>{selected}</b></small>}
              </XpSidePanelSection>
            </>
          )}
        </XpSidePanel>
        <FileArea onMouseDown={() => setSelected(null)}>
          <Group>
            {entries.map((e) => (
              <EntryTile
                key={e.name + (e.virtualId || '')}
                $selected={selected === e.name}
                onMouseDown={(ev) => {
                  ev.stopPropagation()
                  setSelected(e.name)
                }}
                onDoubleClick={() => onDouble(e)}
              >
                <img src={e.icon} alt="" />
                <span>{e.name}</span>
              </EntryTile>
            ))}
          </Group>
        </FileArea>
      </Body>
      <XpStatusBar>
        <XpStatusField>{entries.length} itens</XpStatusField>
        <XpStatusField>Computador</XpStatusField>
      </XpStatusBar>
      {promptState && (
        <PromptOverlay onMouseDown={(e) => e.stopPropagation()}>
          <PromptDialog>
            <PromptTitle>{promptState.title}</PromptTitle>
            <PromptInput
              autoFocus
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  promptState.onConfirm(promptValue)
                  setPromptState(null)
                }
                if (e.key === 'Escape') {
                  setPromptState(null)
                }
              }}
            />
            <PromptActions>
              <button
                onClick={() => {
                  promptState.onConfirm(promptValue)
                  setPromptState(null)
                }}
              >
                OK
              </button>
              <button onClick={() => setPromptState(null)}>Cancelar</button>
            </PromptActions>
          </PromptDialog>
        </PromptOverlay>
      )}
    </Root>
  )
}

export const MyComputer: React.FC = () => <Explorer variant="computer" />
export const MyDocuments: React.FC = () => <Explorer variant="documents" />
export const MyPictures: React.FC = () => <Explorer variant="pictures" />
export const RecycleBin: React.FC = () => <Explorer variant="recycle" />

const Root = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${theme.colors.windowBg};
`

const ToolbarSep = styled.div`
  width: 1px;
  height: 60%;
  background: #b3b3b3;
  margin: 0 4px;
`

const Body = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
`

const FileArea = styled.div`
  flex: 1;
  overflow: auto;
  padding: 10px;
  background: #fff;
`

const Group = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 6px;
`

const EntryTile = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: default;
  background: ${(p) => (p.$selected ? '#3168c9' : 'transparent')};
  color: ${(p) => (p.$selected ? '#fff' : '#000')};
  img { width: 32px; height: 32px; image-rendering: pixelated; }
  span { font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  &:hover {
    background: ${(p) => (p.$selected ? '#3168c9' : '#eaeaea')};
  }
`

const PromptOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  z-index: 20;
`

const PromptDialog = styled.div`
  min-width: 320px;
  padding: 12px;
  background: #ece9d8;
  border: 1px solid #7f9db9;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.35);
`

const PromptTitle = styled.div`
  margin-bottom: 8px;
  font-size: 11px;
`

const PromptInput = styled.input`
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #7f9db9;
  font-size: 11px;
  box-sizing: border-box;
`

const PromptActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 10px;
`
