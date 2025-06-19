import icon from '../../resources/icon.png?asset'
import {
    registerCourseIpcHandlers,
    registerFolderIpcHandlers,
    registerLessonIpcHandlers,
    registerProgressIpcHandlers,
    registerUserIpcHandlers
} from './ipc'
import { registerCourseProtocol, registerIconProtocol } from './protocol'
import {
    CourseService,
    DatabaseService,
    FolderService,
    ImportCourseService,
    LessonService,
    ProgressService,
    StorageService,
    ThemeService,
    UserService
} from './services'
import { PROTOCOL } from '@/constants'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { BrowserWindow, app, ipcMain, protocol, shell } from 'electron'
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
    userService: UserService,
    progressService: ProgressService
) => {
    registerFolderIpcHandlers(courseService, folderService)
    registerCourseIpcHandlers(courseService)
    registerLessonIpcHandlers(lessonService, folderService)
    registerUserIpcHandlers(userService)
    registerProgressIpcHandlers(progressService)
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

    const themeService = new ThemeService()
    const importCourseService = new ImportCourseService(database, storageService, folderService)
    const courseService = new CourseService(database, folderService, importCourseService)
    const lessonService = new LessonService(database)
    const userService = new UserService(database, themeService)
    const progressService = new ProgressService(database)

    registerProtocols(folderService)
    registerIpcHandlers(courseService, folderService, lessonService, userService, progressService)

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
