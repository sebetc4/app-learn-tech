import {
    ChapterDatabaseManager,
    CourseDatabaseManager,
    LessonDatabaseManager,
    ResourceDatabaseManager
} from './managers'
import { CodeSnippetDatabaseManager } from './managers/code-snippet-database.manager'
import { CoursesFolderDatabaseManager } from './managers/setting.manager'
import { PrismaClient, SettingKey } from '@prisma/client'

export class DatabaseService {
    readonly #DEFAULT_SETTINGS: Partial<Record<SettingKey, string>> = {
        THEME: 'system'
    }

    #prisma: PrismaClient

    #courseManager: CourseDatabaseManager
    #chapterManager: ChapterDatabaseManager
    #lessonManager: LessonDatabaseManager
    #codeSnippetManager: CodeSnippetDatabaseManager
    #resourceManager: ResourceDatabaseManager
    #settingManager: CoursesFolderDatabaseManager

    get course() {
        return this.#courseManager
    }

    get chapter() {
        return this.#chapterManager
    }

    get lesson() {
        return this.#lessonManager
    }

    get codeSnippet() {
        return this.#codeSnippetManager
    }

    get resource() {
        return this.#resourceManager
    }

    get setting() {
        return this.#settingManager
    }

    constructor() {
        this.#prisma = new PrismaClient()

        this.#courseManager = new CourseDatabaseManager(this.#prisma)
        this.#chapterManager = new ChapterDatabaseManager(this.#prisma)
        this.#lessonManager = new LessonDatabaseManager(this.#prisma)
        this.#codeSnippetManager = new CodeSnippetDatabaseManager(this.#prisma)
        this.#resourceManager = new ResourceDatabaseManager(this.#prisma)
        this.#settingManager = new CoursesFolderDatabaseManager(this.#prisma)
    }

    async initialize() {
        for (const [keyString, value] of Object.entries(this.#DEFAULT_SETTINGS)) {
            const key = keyString as SettingKey
            const existing = await this.#settingManager.get(key)

            if (existing === null || existing === undefined) {
                await this.#settingManager.create({
                    key,
                    value
                })
            }
        }
    }

    async disconnect() {
        await this.#prisma.$disconnect()
    }
}
