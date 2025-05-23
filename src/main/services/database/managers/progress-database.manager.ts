import { PrismaClient } from '@prisma/client'

interface GetLessonsProgressParams {
    courseId: string
    userId: string
}

export class ProgressDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    getLessonsProgress({ courseId, userId }: GetLessonsProgressParams) {
        return this.#prisma.lessonProgress.findMany({
            where: {
                courseId,
                userId
            },
            select: {
                lessonId: true,
                status: true
            }
        })
    }
}
