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

    async getAdjacentLessons(courseId: string, currentLessonPosition: number) {
        const previousLesson =
            currentLessonPosition > 1
                ? await this.#prisma.lesson.findFirst({
                      where: {
                          courseId,
                          position: currentLessonPosition - 1
                      },
                      select: { id: true }
                  })
                : null

        const nextLesson = await this.#prisma.lesson.findFirst({
            where: {
                courseId,
                position: currentLessonPosition + 1
            },
            select: { id: true }
        })

        return {
            previousLessonId: previousLesson?.id || null,
            nextLessonId: nextLesson?.id || null
        }
    }
}
