import icon from '../../resources/icon.png?asset'
import { registerCourseIpcHandlers, registerThemeIpcHandlers } from './ipc'
import { registerFolderIpcHandlers } from './ipc/folder.ipc'
import { registerMediaProtocol } from './protocol'
import { CoursesFolderService } from './services'
import { DatabaseService } from './services/database'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { join } from 'path'

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow.show()
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

const registerProtocols = async (courseFolderService: CoursesFolderService) => {
    registerMediaProtocol(courseFolderService)
}

const registerIpcHandlers = async (
    database: DatabaseService,
    courseFolderService: CoursesFolderService
) => {
    registerCourseIpcHandlers(database, courseFolderService)
    registerFolderIpcHandlers(courseFolderService)
    await registerThemeIpcHandlers(database)
}

app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    const database = new DatabaseService()
    await database.initialize()

    const courseFolderService = new CoursesFolderService(database)
    await courseFolderService.initialize()

    registerProtocols(courseFolderService)
    registerIpcHandlers(database, courseFolderService)

    ipcMain.on('ping', () => console.log('pong'))

    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
