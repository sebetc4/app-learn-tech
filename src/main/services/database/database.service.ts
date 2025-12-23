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
                // Use node_modules in dev/preview mode, resources in packaged app
                if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
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
        }

        this.#db = drizzle(this.#sqliteInstance, {
            schema: { ...schema, ...relations }
        })

        // Apply migrations
        await this.#applyMigrations()
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
            return path.join(process.cwd(), 'databases', 'dev.db')
        }
        const userDataPath = app.getPath('userData')
        return path.join(userDataPath, 'database.db')
    }

    async #applyMigrations() {
        try {
            // Create migrations tracking table if it doesn't exist
            this.#sqliteInstance.run(`
                CREATE TABLE IF NOT EXISTS __drizzle_migrations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    hash TEXT NOT NULL,
                    created_at INTEGER NOT NULL
                )
            `)

            // Get migrations path
            const migrationsPath =
                process.env.NODE_ENV === 'development' || !app.isPackaged
                    ? path.join(process.cwd(), 'src', 'database', 'migrations')
                    : path.join(process.resourcesPath, 'migrations')

            if (!fs.existsSync(migrationsPath)) {
                console.log('No migrations folder found, skipping migrations')
                return
            }

            // Get list of migration files
            const migrationFiles = fs
                .readdirSync(migrationsPath)
                .filter((file) => file.endsWith('.sql'))
                .sort()

            // Get already applied migrations
            const appliedMigrations = this.#sqliteInstance.exec(
                'SELECT hash FROM __drizzle_migrations'
            )
            const appliedHashes = new Set(
                appliedMigrations[0]?.values.map((row) => row[0]) || []
            )

            // Apply new migrations
            for (const file of migrationFiles) {
                if (!appliedHashes.has(file)) {
                    console.log(`Applying migration: ${file}`)
                    const migrationPath = path.join(migrationsPath, file)
                    const sql = fs.readFileSync(migrationPath, 'utf-8')

                    // Split by statement-breakpoint and execute each statement
                    const statements = sql
                        .split('--> statement-breakpoint')
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)

                    for (const statement of statements) {
                        try {
                            this.#sqliteInstance.run(statement)
                        } catch (error) {
                            console.error(`Error executing statement in ${file}:`, error)
                            throw error
                        }
                    }

                    // Record migration as applied
                    this.#sqliteInstance.run(
                        'INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)',
                        [file, Date.now()]
                    )

                    console.log(`✅ Migration ${file} applied successfully`)
                }
            }

            this.#saveDatabase()
        } catch (error) {
            console.error('Migration failed:', error)
            throw error
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
