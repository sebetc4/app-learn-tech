import { LessonProgressStatus, PrismaClient } from '@prisma/client'

interface CreateLessonProgress {
    courseId: string
    lessonId: string
    userId: string
}

export class ProgressDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    createLessonProgress = async ({ courseId, lessonId, userId }: CreateLessonProgress) => {
        return await this.#prisma.lessonProgress.create({
            data: {
                courseId,
                lessonId,
                userId
            }
        })
    }

    updateLessonProgress = async (progressId: string, status: LessonProgressStatus) => {
        return await this.#prisma.lessonProgress.update({
            where: {
                id: progressId
            },
            data: {
                status
            }
        })
    }
}
