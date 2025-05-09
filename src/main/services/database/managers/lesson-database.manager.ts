import { Lesson, LessonType, PrismaClient } from '@prisma/client'

import { LessonViewModel } from '@/types'

interface CreatLessonParams {
    id: string
    position: number
    name: string

    type: LessonType
    jsxPath?: string
    videoPath?: string
    videoDuration?: number

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

    async getById(id: string): Promise<LessonViewModel | null> {
        return await this.#prisma.lesson.findUnique({
            where: { id },
            include: {
                codeSnippets: {
                    select: {
                        id: true,
                        position: true,
                        language: true,
                        extension: true
                    }
                },
                resources: {
                    select: {
                        id: true,
                        type: true,
                        url: true
                    }
                }
            }
        })
    }
}
