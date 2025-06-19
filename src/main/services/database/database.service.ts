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
import * as relations from '@/database/relations'
import * as schema from '@/database/schemas'
import { drizzle } from 'drizzle-orm/sql-js'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import initSqlJs, { Database } from 'sql.js'

import { DrizzleDB, JsonString } from '@/types'

export class DatabaseService {
    #db!: DrizzleDB
    #sqliteInstance: Database | null = null
    #dbPath: string
    #chapterManager: ChapterDatabaseManager | null = null
    #codeSnippetManager: CodeSnippetDatabaseManager | null = null
    #courseManager: CourseDatabaseManager | null = null
    #lessonManager: LessonDatabaseManager | null = null
    #progressManager: ProgressDatabaseManager | null = null
    #resourceManager: ResourceDatabaseManager | null = null
    #settingManager: SettingDatabaseManager | null = null
    #userManager: UserDatabaseManager | null = null
    #saveTimeout: NodeJS.Timeout | null = null

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

    constructor() {
        this.#dbPath = this.#getDatabasePath()
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
            this.#executeWithAutoSave.bind(this),
            this.#queryWithRelations.bind(this)
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

        return this.#db
    }

    #getDatabasePath(): string {
        if (process.env.NODE_ENV === 'development') {
            return path.join(process.cwd(), 'resources', 'database', 'sqlite.db')
        }
        const userDataPath = app.getPath('userData')
        return path.join(userDataPath, 'database.db')
    }

    async #copyInitialDatabase() {
        try {
            const initialDbPath = path.join(process.resourcesPath, 'database', 'sqlite.db')
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

    #parseRelations<T extends Record<string, unknown>>(data: T): T {
        if (!data || typeof data !== 'object') return data

        const parsed = { ...data } as Record<string, unknown>

        Object.keys(parsed).forEach((key) => {
            const value = parsed[key]

            if (this.#isJsonString(value)) {
                try {
                    const parsedValue: unknown = JSON.parse(value)

                    if (this.#isArray(parsedValue)) {
                        parsed[key] = parsedValue.map((item) => {
                            return this.#isObject(item) ? this.#parseRelations(item) : item
                        })
                    } else if (this.#isObject(parsedValue)) {
                        parsed[key] = this.#parseRelations(parsedValue)
                    } else {
                        parsed[key] = parsedValue
                    }
                } catch (e) {
                    console.warn(`Failed to parse relation ${key}:`, e)
                }
            }
        })

        return parsed as T
    }

    async #queryWithRelations<T>(queryFn: () => Promise<T>): Promise<T> {
        const result = await queryFn()

        if (result && typeof result === 'object' && !Array.isArray(result)) {
            return this.#parseRelations(result as Record<string, unknown>) as T
        }

        return result
    }

    #isObject(value: unknown): value is Record<string, unknown> {
        return value !== null && typeof value === 'object' && !Array.isArray(value)
    }

    #isJsonString(value: unknown): value is JsonString {
        return typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))
    }

    #isArray(value: unknown): value is unknown[] {
        return Array.isArray(value)
    }

    async initialize() {
        await this.initializeDatabase()

        const newUser = await this.#userManager?.createDefaultUserIfNoneExist()
        if (newUser) {
            await this.#settingManager?.create({
                key: 'CURRENT_USER',
                value: newUser.id
            })
        }
        this.#saveDatabase()
    }

    async disconnect() {
        this.#saveDatabase()
    }
}
