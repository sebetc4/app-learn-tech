import { chapters, courseProgress, lessonProgress, lessons } from '@/database/schemas'
import { and, count, eq } from 'drizzle-orm'

import {
    AutoSaveFunction,
    CourseProgress,
    DrizzleDB,
    LessonProgress,
    LessonProgressStatus
} from '@/types'

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
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
    }

    createLessonProgress = async ({
        courseId,
        lessonId,
        userId
    }: CreateLessonProgress): Promise<LessonProgress> => {
        return this.#autoSave(async () => {
            const result = await this.#db
                .insert(lessonProgress)
                .values({
                    id: crypto.randomUUID(),
                    courseId,
                    lessonId,
                    userId,
                    status: 'IN_PROGRESS'
                })
                .returning()

            return result[0]
        })
    }

    updateLessonProgress = async ({
        progressId,
        status
    }: UpdateLessonProgress): Promise<LessonProgress> => {
        return this.#autoSave(async () => {
            const result = await this.#db
                .update(lessonProgress)
                .set({ status })
                .where(eq(lessonProgress.id, progressId))
                .returning()

            return result[0]
        })
    }

    upsertCourseProgress = async ({
        courseId,
        userId
    }: UpsertCourseProgress): Promise<CourseProgress> => {
        return this.#autoSave(async () => {
            try {
                const existingProgress = await this.#db
                    .select()
                    .from(courseProgress)
                    .where(
                        and(
                            eq(courseProgress.userId, userId),
                            eq(courseProgress.courseId, courseId)
                        )
                    )

                if (existingProgress.length > 0) {
                    const current = existingProgress[0]
                    const newCompletedCourse = current.completedCourse + 1
                    const newPercentage = this.#floorPercentage(
                        newCompletedCourse,
                        current.totalCourse
                    )

                    const result = await this.#db
                        .update(courseProgress)
                        .set({
                            totalCourse: current.totalCourse,
                            completedCourse: newCompletedCourse,
                            percentage: newPercentage
                        })
                        .where(eq(courseProgress.id, current.id))
                        .returning()

                    return result[0]
                } else {
                    const totalCourse = await this.#getCourseTotalLessons(courseId)
                    const percentage = this.#floorPercentage(1, totalCourse)

                    const result = await this.#db
                        .insert(courseProgress)
                        .values({
                            id: crypto.randomUUID(),
                            courseId,
                            userId,
                            totalCourse,
                            completedCourse: 1,
                            percentage
                        })
                        .returning()

                    return result[0]
                }
            } catch (error) {
                console.error('Error in upsertCourseProgress:', error)
                throw new Error('Failed to upsert course progress')
            }
        })
    }

    #floorPercentage = (completed: number, total: number): number => {
        if (total === 0) return 0
        return Math.floor((completed / total) * 100)
    }

    #getCourseTotalLessons = async (courseId: string): Promise<number> => {
        const result = await this.#db
            .select({ count: count() })
            .from(lessons)
            .innerJoin(chapters, eq(lessons.chapterId, chapters.id))
            .where(eq(chapters.courseId, courseId))

        return result[0].count
    }
}
