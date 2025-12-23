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
import { BrowserWindow, app, dialog, protocol, shell } from 'electron'
import { join } from 'path'

let mainWindow: BrowserWindow | null = null

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            // Sandbox is disabled to allow Node.js integration in preload script
            // Required for direct file system access and database operations
            sandbox: false
        }
    })

    mainWindow.on('ready-to-show', () => {
        mainWindow?.show()
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
            // bypassCSP is required to load course content from custom protocol
            bypassCSP: true
        }
    }
])

// Application state
let database: DatabaseService | null = null

const registerProtocols = (folderService: FolderService): void => {
    registerCourseProtocol(folderService)
    registerIconProtocol()
}

const registerIpcHandlers = (
    courseService: CourseService,
    folderService: FolderService,
    lessonService: LessonService,
    userService: UserService,
    progressService: ProgressService
): void => {
    const getMainWindow = () => mainWindow
    registerFolderIpcHandlers(courseService, folderService, getMainWindow)
    registerCourseIpcHandlers(courseService)
    registerLessonIpcHandlers(lessonService, folderService)
    registerUserIpcHandlers(userService)
    registerProgressIpcHandlers(progressService)
}

const initializeApp = async (): Promise<void> => {
    try {
        electronApp.setAppUserModelId('com.electron')
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        })

        // Initialize database
        database = new DatabaseService()
        await database.initialize()

        const storageService = new StorageService()

        // Initialize folder service
        const folderService = new FolderService(database)
        await folderService.initialize()

        // Initialize other services
        const themeService = new ThemeService()
        const importCourseService = new ImportCourseService(database, storageService, folderService)
        const courseService = new CourseService(database, folderService, importCourseService)
        const lessonService = new LessonService(database)
        const userService = new UserService(database, themeService)
        const progressService = new ProgressService(database)

        // Register protocols and IPC handlers
        registerProtocols(folderService)
        registerIpcHandlers(
            courseService,
            folderService,
            lessonService,
            userService,
            progressService
        )

        // Create main window
        createWindow()

        app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
        })
    } catch (error) {
        console.error('Failed to initialize application:', error)
        dialog.showErrorBox(
            'Initialization Error',
            `Failed to start the application: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
        app.quit()
    }
}

const cleanup = async (): Promise<void> => {
    try {
        if (database) {
            await database.disconnect()
            database = null
        }
    } catch (error) {
        console.error('Error during cleanup:', error)
    }
}

app.whenReady().then(initializeApp)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        cleanup().then(() => app.quit())
    }
})

app.on('before-quit', async (event) => {
    event.preventDefault()
    await cleanup()
    app.exit()
})
