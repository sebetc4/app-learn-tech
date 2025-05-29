import { LessonProgressStatus, PrismaClient } from '@prisma/client'

interface CreateLessonProgress {
    courseId: string
    lessonId: string
    userId: string
}

interface UpdateLessonProgress {
    progressId: string
    status: LessonProgressStatus
}

interface UpsertCourseProgress {
    courseId: string
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

    updateLessonProgress = async ({ progressId, status }: UpdateLessonProgress) => {
        return await this.#prisma.lessonProgress.update({
            where: {
                id: progressId
            },
            data: {
                status
            }
        })
    }

    upsertCourseProgress = async ({ courseId, userId }: UpsertCourseProgress) => {
        try {
            const courseProgress = await this.#prisma.courseProgress.findMany({
                where: { userId, courseId }
            })
            if (courseProgress.length > 0) {
                return await this.#prisma.courseProgress.update({
                    where: {
                        id: courseProgress[0].id
                    },
                    data: {
                        totalCourse: courseProgress[0].totalCourse,
                        completedCourse: courseProgress[0].completedCourse + 1,
                        percentage: this.#floorPercentage(
                            courseProgress[0].completedCourse + 1,
                            courseProgress[0].totalCourse
                        )
                    }
                })
            } else {
                const totalCourse = await this.#getCourseTotalLessons(courseId)

                return await this.#prisma.courseProgress.create({
                    data: {
                        courseId,
                        userId,
                        totalCourse,
                        completedCourse: 1,
                        percentage: this.#floorPercentage(1, totalCourse)
                    }
                })
            }
        } catch (error) {
            console.error('Error in upsertCourseProgress:', error)
            throw new Error('Failed to upsert course progress')
        }
    }

    #floorPercentage = (completed: number, total: number): number => {
        if (total === 0) return 0
        return Math.floor((completed / total) * 100)
    }

    #getCourseTotalLessons = async (courseId: string): Promise<number> => {
        const totalLessons = await this.#prisma.lesson.count({
            where: {
                chapter: {
                    courseId: courseId
                }
            }
        })
        return totalLessons
    }
}
