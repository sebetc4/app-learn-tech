import icon from '../../resources/icon.png?asset';
import { registerCourseIpcHandlers, registerFolderIpcHandlers, registerLessonIpcHandlers, registerThemeIpcHandlers } from './ipc';
import { registerCourseProtocol, registerIconProtocol } from './protocol';
import { CourseService, FolderService, LessonService, StorageService, ThemeService } from './services';
import { DatabaseService } from './services/database';
import { PROTOCOL } from '@/constants';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app, ipcMain, protocol, shell } from 'electron';
import { join } from 'path';





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

protocol.registerSchemesAsPrivileged([
    {
        scheme: PROTOCOL.COURSE,
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            stream: true,
            bypassCSP: true
        }
    }
])

const registerProtocols = (folderService: FolderService) => {
    registerCourseProtocol(folderService)
    registerIconProtocol()
}

const registerIpcHandlers = (
    courseService: CourseService,
    folderService: FolderService,
    lessonService: LessonService,
    themeService: ThemeService
) => {
    registerFolderIpcHandlers(courseService, folderService)
    registerCourseIpcHandlers(courseService)
    registerLessonIpcHandlers(lessonService)
    registerThemeIpcHandlers(themeService)
}

app.whenReady().then(async () => {
    electronApp.setAppUserModelId('com.electron')
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    const database = new DatabaseService()
    await database.initialize()

    const storageService = new StorageService()

    const folderService = new FolderService(database)
    await folderService.initialize()

    const courseService = new CourseService(database, storageService, folderService)

    const lessonService = new LessonService(database)

    const themeService = new ThemeService(database)
    await themeService.initialize()

    registerProtocols(folderService)
    registerIpcHandlers(courseService, folderService, lessonService, themeService)

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