import { ChapterDatabaseManager, CourseDatabaseManager, LessonDatabaseManager, ResourceDatabaseManager } from './managers'
import { PrismaClient } from '@prisma/client'
import { CodeSnippetDatabaseManager } from './managers/code-snippet-database.manager'

export class DatabaseService {
    #prisma: PrismaClient

    #courseManager: CourseDatabaseManager
    #chapterManager: ChapterDatabaseManager
    #lessonManager: LessonDatabaseManager
    #codeSnippetManager: CodeSnippetDatabaseManager
    #resourceManager: ResourceDatabaseManager


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

    constructor() {
        this.#prisma = new PrismaClient()

        this.#courseManager = new CourseDatabaseManager(this.#prisma)
        this.#chapterManager = new ChapterDatabaseManager(this.#prisma)
        this.#lessonManager = new LessonDatabaseManager(this.#prisma)
        this.#codeSnippetManager = new CodeSnippetDatabaseManager(this.#prisma)
        this.#resourceManager = new ResourceDatabaseManager(this.#prisma)
    }

    async disconnect() {
        await this.#prisma.$disconnect()
    }
}
