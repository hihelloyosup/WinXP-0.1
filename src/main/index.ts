import { app, shell, BrowserWindow, ipcMain, screen, dialog } from 'electron'
import { join } from 'path'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fsPromises from 'fs/promises'
import fs from 'fs'

let fsWatcher: fs.FSWatcher | null = null

function createWindow(): void {
  const primary = screen.getPrimaryDisplay()
  const { width, height } = primary.workAreaSize

  const mainWindow = new BrowserWindow({
    width: Math.min(1280, width),
    height: Math.min(800, height),
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: 'Windows XP',
    backgroundColor: '#245edc',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    if (!fsWatcher) {
      try {
        fsWatcher = fs.watch(process.cwd(), { recursive: true }, (eventType, filename) => {
          if (filename && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('xp:fs-event', { eventType, filename })
          }
        })
      } catch (err) {
        console.error('Failed to start fs.watch:', err)
      }
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.winxp.clone')

  app.on('browser-window-created', () => {
    // optimizer.watchWindowShortcuts(window) // disabled to allow Ctrl+R in renderer
  })

  ipcMain.handle('xp:quit', () => app.quit())
  ipcMain.handle('xp:reload', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win) {
      win.webContents.reload()
    }
  })
  ipcMain.handle('xp:getAppPath', () => app.getAppPath())
  ipcMain.handle('xp:getProjectPath', () => process.cwd())
  ipcMain.handle('xp:readDir', async (_, path: string) => {
    try {
      const entries = await fsPromises.readdir(path, { withFileTypes: true })
      return entries.map((ent) => ({
        name: ent.name,
        isDirectory: ent.isDirectory(),
        isFile: ent.isFile()
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  })
  ipcMain.handle('xp:fileExists', async (_, path: string) => {
    try {
      await fsPromises.access(path)
      return true
    } catch {
      return false
    }
  })
  ipcMain.handle('xp:createDir', async (_, path: string) => {
    try {
      await fsPromises.mkdir(path, { recursive: true })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  })
  ipcMain.handle('xp:writeFile', async (_, path: string, content: string | Buffer) => {
    try {
      await fsPromises.writeFile(path, content)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  })
  ipcMain.handle('xp:readFile', async (_, path: string, encoding: BufferEncoding = 'utf-8') => {
    try {
      const content = await fsPromises.readFile(path, encoding)
      return content
    } catch (e) {
      console.error(e)
      return null
    }
  })
  ipcMain.handle('xp:deleteFile', async (_, path: string) => {
    try {
      await fsPromises.unlink(path)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  })
  ipcMain.handle('xp:deleteDir', async (_, path: string) => {
    try {
      await fsPromises.rm(path, { recursive: true, force: true })
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  })
  ipcMain.handle('xp:showSaveDialog', async (_, options: any) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null
    const result = await dialog.showSaveDialog(win, options)
    return result
  })
  ipcMain.handle('xp:openFile', async (_, path: string) => {
    try {
      await shell.openPath(path)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  })
  ipcMain.handle('xp:moveToTrash', async (_, path: string) => {
    try {
      await shell.trashItem(path)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (fsWatcher) {
    fsWatcher.close()
    fsWatcher = null
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
