import {
    ChapterDatabaseManager,
    CodeSnippetDatabaseManager,
    CourseDatabaseManager,
    LessonDatabaseManager,
    ProgressDatabaseManager,
    ResourceDatabaseManager,
    SettingDatabaseManager,
    UserDatabaseManager
} from './managers'
import { CourseHistoryDatabaseManager } from './managers/course-history-database.manager'
import * as relations from '@/database/relations'
import * as schema from '@/database/schemas'
import { drizzle } from 'drizzle-orm/sql-js'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import initSqlJs, { Database } from 'sql.js'

import { DrizzleDB } from '@/types'

export class DatabaseService {
    #dbPath: string
    #db!: DrizzleDB
    #sqliteInstance!: Database
    #chapterManager!: ChapterDatabaseManager
    #codeSnippetManager!: CodeSnippetDatabaseManager
    #courseManager!: CourseDatabaseManager
    #lessonManager!: LessonDatabaseManager
    #progressManager!: ProgressDatabaseManager
    #resourceManager!: ResourceDatabaseManager
    #settingManager!: SettingDatabaseManager
    #userManager!: UserDatabaseManager
    #saveTimeout!: NodeJS.Timeout
    courseHistoryManager!: CourseHistoryDatabaseManager

    get chapter() {
        return this.#chapterManager
    }

    get codeSnippet() {
        return this.#codeSnippetManager
    }

    get course() {
        return this.#courseManager
    }

    get lesson() {
        return this.#lessonManager
    }

    get progress() {
        return this.#progressManager
    }

    get resource() {
        return this.#resourceManager
    }

    get setting() {
        return this.#settingManager
    }

    get user() {
        return this.#userManager
    }

    get courseHistory() {
        return this.courseHistoryManager
    }

    constructor() {
        this.#dbPath = this.#getDatabasePath()
    }

    async initialize() {
        await this.initializeDatabase()
        this.#initializeManagers()

        const newUser = await this.#userManager?.createDefaultUserIfNoneExist()
        if (newUser) {
            await this.#settingManager?.create({
                key: 'CURRENT_USER',
                value: newUser.id
            })
        }
        this.#saveDatabase()
    }

    async initializeDatabase() {
        const SQL = await initSqlJs({
            locateFile: (file: string) => {
                if (process.env.NODE_ENV === 'development') {
                    return path.join(__dirname, '../../node_modules/sql.js/dist/', file)
                }
                return path.join(process.resourcesPath, 'sql-wasm', file)
            }
        })

        if (fs.existsSync(this.#dbPath)) {
            const filebuffer = fs.readFileSync(this.#dbPath)
            this.#sqliteInstance = new SQL.Database(filebuffer)
        } else {
            this.#sqliteInstance = new SQL.Database()
            await this.#copyInitialDatabase()
        }

        this.#db = drizzle(this.#sqliteInstance, {
            schema: { ...schema, ...relations }
        })
    }

    #initializeManagers() {
        this.#chapterManager = new ChapterDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
        this.#codeSnippetManager = new CodeSnippetDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
        this.#courseManager = new CourseDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
        this.#lessonManager = new LessonDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
        this.#progressManager = new ProgressDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
        this.#resourceManager = new ResourceDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
        this.#settingManager = new SettingDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
        this.#userManager = new UserDatabaseManager(this.#db, this.#executeWithAutoSave.bind(this))
        this.courseHistoryManager = new CourseHistoryDatabaseManager(
            this.#db,
            this.#executeWithAutoSave.bind(this)
        )
    }

    #getDatabasePath(): string {
        if (process.env.NODE_ENV === 'development') {
            return path.join(process.cwd(), 'src', 'database', 'dev.db')
        }
        const userDataPath = app.getPath('userData')
        return path.join(userDataPath, 'database.db')
    }

    async #copyInitialDatabase() {
        try {
            const initialDbPath = path.join(process.resourcesPath, 'database', 'template.db')
            if (fs.existsSync(initialDbPath)) {
                console.log('Copying initial database from resources...')
                const initialData = fs.readFileSync(initialDbPath)
                this.#sqliteInstance = new (await initSqlJs()).Database(initialData)
                this.#saveDatabase()
            }
        } catch {
            console.log('No initial database found in resources, starting with empty database')
        }
    }

    #scheduleSave(): void {
        if (this.#saveTimeout) {
            clearTimeout(this.#saveTimeout)
        }

        this.#saveTimeout = setTimeout(async () => {
            this.#saveDatabase()
        }, 100)
    }

    async #executeWithAutoSave<T>(operation: () => Promise<T>): Promise<T> {
        try {
            const result = await operation()
            this.#scheduleSave()
            return result
        } catch (error) {
            console.error('Database operation failed:', error)
            throw error
        }
    }

    #saveDatabase() {
        if (this.#sqliteInstance) {
            try {
                const data = this.#sqliteInstance.export()
                const dir = path.dirname(this.#dbPath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true })
                }
                fs.writeFileSync(this.#dbPath, Buffer.from(data))
            } catch (error) {
                console.error('Error saving database:', error)
            }
        }
    }

    async disconnect() {
        this.#saveDatabase()
    }
}
