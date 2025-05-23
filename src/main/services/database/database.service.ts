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
import { PrismaClient } from '@prisma/client'

export class DatabaseService {
    #prisma: PrismaClient
    #chapterManager: ChapterDatabaseManager
    #codeSnippetManager: CodeSnippetDatabaseManager
    #courseManager: CourseDatabaseManager
    #lessonManager: LessonDatabaseManager
    #progressManager: ProgressDatabaseManager
    #resourceManager: ResourceDatabaseManager
    #settingManager: SettingDatabaseManager
    #userManager: UserDatabaseManager

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
        this.#prisma = new PrismaClient()

        this.#chapterManager = new ChapterDatabaseManager(this.#prisma)
        this.#codeSnippetManager = new CodeSnippetDatabaseManager(this.#prisma)
        this.#courseManager = new CourseDatabaseManager(this.#prisma)
        this.#lessonManager = new LessonDatabaseManager(this.#prisma)
        this.#progressManager = new ProgressDatabaseManager(this.#prisma)
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
