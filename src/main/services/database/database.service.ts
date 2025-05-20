import {
    ChapterDatabaseManager,
    CourseDatabaseManager,
    LessonDatabaseManager,
    ResourceDatabaseManager
} from './managers'
import { CodeSnippetDatabaseManager } from './managers/code-snippet-database.manager'
import { SettingDatabaseManager } from './managers/setting.manager'
import { UserDatabaseManager } from './managers/user-database.manager'
import { PrismaClient } from '@prisma/client'

export class DatabaseService {
    #prisma: PrismaClient
    #courseManager: CourseDatabaseManager
    #chapterManager: ChapterDatabaseManager
    #lessonManager: LessonDatabaseManager
    #codeSnippetManager: CodeSnippetDatabaseManager
    #resourceManager: ResourceDatabaseManager
    #settingManager: SettingDatabaseManager
    #userManager: UserDatabaseManager

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

    get user() {
        return this.#userManager
    }

    constructor() {
        this.#prisma = new PrismaClient()

        this.#courseManager = new CourseDatabaseManager(this.#prisma)
        this.#chapterManager = new ChapterDatabaseManager(this.#prisma)
        this.#lessonManager = new LessonDatabaseManager(this.#prisma)
        this.#codeSnippetManager = new CodeSnippetDatabaseManager(this.#prisma)
        this.#resourceManager = new ResourceDatabaseManager(this.#prisma)
        this.#settingManager = new SettingDatabaseManager(this.#prisma)
        this.#userManager = new UserDatabaseManager(this.#prisma)
    }

    async initialize() {
        const newUser = await this.#userManager.createDefaultUserIfNoneExist()
        if (newUser) {
            this.#settingManager.create({
                key: 'CURRENT_USER',
                value: newUser.id
            })
        }
    }

    async disconnect() {
        await this.#prisma.$disconnect()
    }
}
