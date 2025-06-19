import { lessons } from '@/database/schemas'
import { and, count, eq } from 'drizzle-orm'

import { AutoSaveFunction, DrizzleDB, Lesson, LessonType, LessonViewModel } from '@/types'

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
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
    }

    async create(data: CreatLessonParams): Promise<Lesson> {
        return this.#autoSave(async () => {
            const result = await this.#db.insert(lessons).values(data).returning()

            return result[0]
        })
    }

    async getOneById(id: string): Promise<Lesson> {
        try {
            const result = await this.#db.select().from(lessons).where(eq(lessons.id, id)).limit(1)

            const lesson = result[0]
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
        return (await this.#db.query.lessons.findFirst({
            where: eq(lessons.id, lessonId),
            with: {
                codeSnippets: {
                    columns: {
                        id: true,
                        position: true,
                        language: true,
                        extension: true
                    },
                    orderBy: (codeSnippets, { asc }) => [asc(codeSnippets.position)]
                },
                resources: {
                    columns: {
                        id: true,
                        type: true,
                        url: true
                    }
                },
                lessonProgresses: {
                    where: (lessonProgress, { and, eq }) =>
                        and(
                            eq(lessonProgress.lessonId, lessonId),
                            eq(lessonProgress.userId, userId)
                        ),
                    columns: {
                        id: true,
                        status: true
                    }
                }
            }
        })) as LessonViewModel | null
    }

    async getAdjacentLessons(courseId: string, currentLessonPosition: number) {
        const previousLessonQuery =
            currentLessonPosition > 1
                ? await this.#db
                      .select({
                          id: lessons.id,
                          chapterId: lessons.chapterId,
                          name: lessons.name
                      })
                      .from(lessons)
                      .where(
                          and(
                              eq(lessons.courseId, courseId),
                              eq(lessons.position, currentLessonPosition - 1)
                          )
                      )
                      .limit(1)
                : []

        const nextLessonQuery = await this.#db
            .select({
                id: lessons.id,
                chapterId: lessons.chapterId,
                name: lessons.name
            })
            .from(lessons)
            .where(
                and(eq(lessons.courseId, courseId), eq(lessons.position, currentLessonPosition + 1))
            )
            .limit(1)

        return {
            previousLesson: previousLessonQuery[0] || null,
            nextLesson: nextLessonQuery[0] || null
        }
    }

    async getLessonCountByCourseId(courseId: string): Promise<number | null> {
        const result = await this.#db
            .select({
                count: count(lessons.id)
            })
            .from(lessons)
            .where(eq(lessons.courseId, courseId))

        return result[0]?.count || null
    }
}
