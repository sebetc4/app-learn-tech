import { PrismaClient } from '@prisma/client'

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
        
        const progress = await this.#prisma.lessonProgress.create({
            data: {
                courseId,
                lessonId,
                userId
            }
        })
        console.log()

        return progress
    }
}
