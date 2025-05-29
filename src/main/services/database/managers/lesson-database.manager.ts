import { Lesson, LessonType, PrismaClient } from '@prisma/client'

import { LessonViewModel } from '@/types'

interface CreatLessonParams {
    id: string
    position: number
    name: string

    type: LessonType
    videoDuration?: number

    chapterId: string
    courseId: string
}

interface GetByLessonViewModelByIdParams {
    lessonId: string
    userId: string
}

export class LessonDatabaseManager {
    #prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async create(data: CreatLessonParams): Promise<Lesson> {
        return await this.#prisma.lesson.create({ data })
    }

    async getOneById(id: string): Promise<Lesson> {
        try {
            const lesson = await this.#prisma.lesson.findUnique({ where: { id } })
            if (!lesson) {
                throw new Error(`Lesson with ID ${id} not found`)
            }
            return lesson
        } catch (error) {
            console.error(`Error retrieving lesson by ID: ${error}`)
            throw error
        }
    }

    async getLessonViewModelById({
        lessonId,
        userId
    }: GetByLessonViewModelByIdParams): Promise<LessonViewModel | null> {
        return await this.#prisma.lesson.findUnique({
            where: { id: lessonId },
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
                },
                lessonProgress: {
                    where: { lessonId, userId },
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        })
    }

    async getAdjacentLessons(courseId: string, currentLessonPosition: number) {
        const previousLesson =
            currentLessonPosition > 1
                ? await this.#prisma.lesson.findFirst({
                      where: {
                          courseId,
                          position: currentLessonPosition - 1
                      },
                      select: { id: true, chapterId: true, name: true }
                  })
                : null

        const nextLesson = await this.#prisma.lesson.findFirst({
            where: {
                courseId,
                position: currentLessonPosition + 1
            },
            select: { id: true, chapterId: true, name: true }
        })

        return {
            previousLesson: previousLesson || null,
            nextLesson: nextLesson || null
        }
    }

    async getLessonCountByCourseId(courseId: string): Promise<number | null> {
        const result = await this.#prisma.course.findUnique({
            where: { id: courseId },
            select: {
                _count: {
                    select: {
                        chapters: {
                            where: {
                                lessons: {
                                    some: {}
                                }
                            }
                        }
                    }
                }
            }
        })

        return result?._count.chapters || null
    }
}
