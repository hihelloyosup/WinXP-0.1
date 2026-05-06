import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getAppPath: () => ipcRenderer.invoke('xp:getAppPath'),
  getProjectPath: () => ipcRenderer.invoke('xp:getProjectPath'),
  readDir: (path: string) => ipcRenderer.invoke('xp:readDir', path),
  fileExists: (path: string) => ipcRenderer.invoke('xp:fileExists', path),
  createDir: (path: string) => ipcRenderer.invoke('xp:createDir', path),
  writeFile: (path: string, content: string | Buffer) => ipcRenderer.invoke('xp:writeFile', path, content),
  readFile: (path: string, encoding?: BufferEncoding) => ipcRenderer.invoke('xp:readFile', path, encoding),
  deleteFile: (path: string) => ipcRenderer.invoke('xp:deleteFile', path),
  deleteDir: (path: string) => ipcRenderer.invoke('xp:deleteDir', path),
  showSaveDialog: (options: any) => ipcRenderer.invoke('xp:showSaveDialog', options),
  openFile: (path: string) => ipcRenderer.invoke('xp:openFile', path),
  moveToTrash: (path: string) => ipcRenderer.invoke('xp:moveToTrash', path),
  onFsEvent: (callback: (data: { eventType: string; filename: string }) => void) => {
    const handler = (_event: any, data: any) => callback(data)
    ipcRenderer.on('xp:fs-event', handler)
    return () => ipcRenderer.removeListener('xp:fs-event', handler)
  },
  quit: () => ipcRenderer.invoke('xp:quit'),
  reload: () => ipcRenderer.invoke('xp:reload')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
