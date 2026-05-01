import { ElectronAPI } from '@electron-toolkit/preload'

export interface XpAPI {
  getAppPath: () => Promise<string>
  getProjectPath: () => Promise<string>
  readDir: (path: string) => Promise<{ name: string; isDirectory: boolean; isFile: boolean }[]>
  fileExists: (path: string) => Promise<boolean>
  createDir: (path: string) => Promise<boolean>
  writeFile: (path: string, content: string | Buffer) => Promise<boolean>
  readFile: (path: string, encoding?: BufferEncoding) => Promise<string | null>
  deleteFile: (path: string) => Promise<boolean>
  deleteDir: (path: string) => Promise<boolean>
  showSaveDialog: (options: any) => Promise<any>
  openFile: (path: string) => Promise<boolean>
  moveToTrash: (path: string) => Promise<boolean>
  onFsEvent: (callback: (data: { eventType: string; filename: string }) => void) => () => void
  quit: () => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: XpAPI
  }
}
