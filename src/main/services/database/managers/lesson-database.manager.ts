import { Lesson, LessonType, PrismaClient } from '@prisma/client'

interface CreatLessonParams {
    id: string
    position: number
    name: string

    type: LessonType
    htmlPath?: string
    videoPath?: string

    chapterId: string
}

export class LessonDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreatLessonParams): Promise<Lesson> {
        return await this.#prisma.lesson.create({ data })
    }
}
