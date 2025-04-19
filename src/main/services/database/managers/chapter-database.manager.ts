import { Chapter, PrismaClient } from '@prisma/client'

interface CreateChapterParams {
    id: string
    position: number
    name: string
    courseId: string
}

export class ChapterDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreateChapterParams): Promise<Chapter> {
        return await this.#prisma.chapter.create({ data })
    }
}
