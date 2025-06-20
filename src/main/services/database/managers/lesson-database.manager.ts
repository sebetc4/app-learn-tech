import { codeSnippets, lessonProgress, lessons, resources } from '@/database/schemas'
import { and, count, eq } from 'drizzle-orm'

import {
    AutoSaveFunction,
    CodeSnippetViewModel,
    DrizzleDB,
    Lesson,
    LessonProgressViewModel,
    LessonType,
    LessonViewModel,
    ResourceViewModel
} from '@/types'

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
        const [lessonInfo] = await this.#db
            .select()
            .from(lessons)
            .where(eq(lessons.id, lessonId))
            .limit(1)

        if (!lessonInfo) return null

        const codeSnippetsData = await this.#db
            .select({
                id: codeSnippets.id,
                position: codeSnippets.position,
                language: codeSnippets.language,
                extension: codeSnippets.extension
            })
            .from(codeSnippets)
            .where(eq(codeSnippets.lessonId, lessonId))
            .orderBy(codeSnippets.position)

        const resourcesData = await this.#db
            .select({
                id: resources.id,
                type: resources.type,
                url: resources.url
            })
            .from(resources)
            .where(eq(resources.lessonId, lessonId))

        const [progressData] = await this.#db
            .select({
                id: lessonProgress.id,
                status: lessonProgress.status
            })
            .from(lessonProgress)
            .where(and(eq(lessonProgress.lessonId, lessonId), eq(lessonProgress.userId, userId)))
            .limit(1)

        return this.#formatLessonViewModel(
            lessonInfo,
            codeSnippetsData,
            resourcesData,
            progressData
        )
    }

    #formatLessonViewModel(
        lesson: Lesson,
        codeSnippets: CodeSnippetViewModel[],
        resources: ResourceViewModel[],
        progress: LessonProgressViewModel | undefined
    ): LessonViewModel {
        return {
            ...lesson,
            codeSnippets,
            resources,
            progress: progress || null
        }
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
