import React, { createContext, useContext, useState, ReactNode } from 'react'

type VirtualFile = {
  id: string
  name: string
  type: 'file' | 'folder'
  content?: string
  parentId: string | null
  appId?: string
  isRealProjectFile?: boolean
  realPath?: string
  deletedAt?: number
  permanentlyDeleted?: boolean
}

const criticalIds = ['system32', 'root']

const initialFiles: VirtualFile[] = [
  { id: 'root', name: 'C:', type: 'folder', parentId: null },
  { id: 'system32', name: 'system32', type: 'folder', parentId: 'root' },
  { id: 'ntoskrnl', name: 'ntoskrnl.exe', type: 'file', parentId: 'system32', appId: 'cmd' },
  { id: 'hal', name: 'hal.dll', type: 'file', parentId: 'system32', appId: 'cmd' },
  { id: 'notepad', name: 'notepad.exe', type: 'file', parentId: 'system32', appId: 'notepad' },
  { id: 'paint', name: 'paint.exe', type: 'file', parentId: 'system32', appId: 'paint' },
  { id: 'cmd', name: 'cmd.exe', type: 'file', parentId: 'system32', appId: 'cmd' },
  { id: 'ie', name: 'iexplore.exe', type: 'file', parentId: 'system32', appId: 'ie' },
]

interface VirtualFSContextType {
  files: VirtualFile[]
  getChildren: (parentId: string | null) => VirtualFile[]
  createFile: (name: string, type: 'file' | 'folder', parentId: string | null, content?: string, appId?: string) => string
  deleteFile: (id: string) => void
  moveToTrash: (id: string) => void
  moveFile: (id: string, newParentId: string) => void
  restoreFromTrash: (id: string, parentId: string) => void
  getTrash: () => VirtualFile[]
  emptyTrash: () => void
  fileExists: (id: string) => boolean
  getFileById: (id: string) => VirtualFile | null
  deletedRealFiles: string[]
  deleteRealFile: (path: string) => void 
  reset: () => void
}

const VirtualFSContext = createContext<VirtualFSContextType | undefined>(undefined)

export const VirtualFSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<VirtualFile[]>(initialFiles)
  const [deletedRealFiles, setDeletedRealFiles] = useState<string[]>([])

  const getChildren = (parentId: string | null) => {
    return files.filter((f) => f.parentId === parentId)
  }

  const createFile = (name: string, type: 'file' | 'folder', parentId: string | null, content = '', appId?: string) => {
    const id = Date.now().toString()
    const newFile: VirtualFile = {
      id,
      name,
      type,
      parentId,
      content: type === 'file' ? content : undefined,
      appId,
    }
    setFiles((prev) => [...prev, newFile])
    return id
  }

  const moveFile = (id: string, newParentId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, parentId: newParentId } : f))
    )
  }

  const moveToTrash = (id: string) => {
    console.log('MoveToTrash chamado para ID:', id)
    
    const isCritical = (fileId: string): boolean => {
      if (criticalIds.includes(fileId)) return true
      const file = files.find(f => f.id === fileId)
      if (!file) return false
      if (file.parentId === 'system32' && ['ntoskrnl', 'hal'].includes(fileId)) return true
      return false
    }
    
    if (isCritical(id)) {
      window.dispatchEvent(new Event('bsod'))
    }
    
    setFiles((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, parentId: null, deletedAt: Date.now() } : f))
      console.log('Arquivos após moveToTrash:', updated)
      return updated
    })
  }

  const restoreFromTrash = (id: string, parentId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, parentId, deletedAt: undefined } : f))
    )
  }

  const getTrash = () => {
    return files.filter((f) => f.deletedAt !== undefined && !f.permanentlyDeleted)
  }

  const emptyTrash = () => {
    setFiles((prev) => prev.map((f) => f.deletedAt !== undefined ? { ...f, permanentlyDeleted: true } : f))
  }

  const deleteFile = (id: string) => {
    console.log('DeleteFile chamado para ID:', id)
    moveToTrash(id)
  }

  const fileExists = (id: string) => {
    return files.some((f) => f.id === id)
  }

  const getFileById = (id: string) => {
    return files.find((f) => f.id === id) || null
  }

  const deleteRealFile = (path: string) => {
    setDeletedRealFiles(prev => [...prev, path])
    const lowerPath = path.toLowerCase()
    if (lowerPath.includes('src') || lowerPath.includes('node_modules') || lowerPath.includes('package.json')) {
      window.dispatchEvent(new Event('bsod'))
    }
  }

  const reset = () => {
    setFiles(initialFiles)
    setDeletedRealFiles([])
  }

  return (
    <VirtualFSContext.Provider
      value={{ files, getChildren, createFile, deleteFile, moveToTrash, moveFile, restoreFromTrash, getTrash, emptyTrash, fileExists, getFileById, deletedRealFiles, deleteRealFile, reset }}
    >
      {children}
    </VirtualFSContext.Provider>
  )
}

export const useVirtualFS = () => {
  const context = useContext(VirtualFSContext)
  if (!context) {
    throw new Error('useVirtualFS must be used within a VirtualFSProvider')
  }
  return context
}
