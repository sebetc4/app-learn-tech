import { courseHistory, courseProgress, courses } from '@/database/schemas'
import { and, desc, eq } from 'drizzle-orm'

import type { AutoSaveFunction, DrizzleDB, RecentCourseViewModel } from '@/types'

export class CourseHistoryDatabaseManager {
    #db: DrizzleDB
    #autoSave: AutoSaveFunction

    constructor(db: DrizzleDB, autoSave: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSave
    }

    async recordAccess(userId: string, courseId: string): Promise<void> {
        return this.#autoSave(async () => {
            const existing = await this.#db
                .select()
                .from(courseHistory)
                .where(and(eq(courseHistory.userId, userId), eq(courseHistory.courseId, courseId)))
                .limit(1)

            if (existing[0]) {
                await this.#db
                    .update(courseHistory)
                    .set({
                        accessedAt: new Date()
                    })
                    .where(eq(courseHistory.id, existing[0].id))
            } else {
                await this.#db.insert(courseHistory).values({
                    id: crypto.randomUUID(),
                    userId,
                    courseId,
                    accessedAt: new Date()
                })

                await this.#cleanup(userId)
            }
        })
    }

    async getRecentCourses(userId: string, limit: number = 5): Promise<RecentCourseViewModel[]> {
        const history = await this.#db
            .select({
                historyId: courseHistory.id,
                accessedAt: courseHistory.accessedAt,

                courseId: courses.id,
                courseName: courses.name,
                courseFolderName: courses.folderName,

                progressPercentage: courseProgress.percentage
            })
            .from(courseHistory)
            .leftJoin(courses, eq(courseHistory.courseId, courses.id))
            .leftJoin(
                courseProgress,
                and(eq(courseProgress.courseId, courses.id), eq(courseProgress.userId, userId))
            )
            .where(eq(courseHistory.userId, userId))
            .orderBy(desc(courseHistory.accessedAt))
            .limit(limit)

        return history.map((entry) => ({
            id: entry.courseId || '',
            name: entry.courseName || '',
            folderName: entry.courseFolderName || '',
            accessedAt: entry.accessedAt,
            progressPercentage: entry.progressPercentage || 0
        }))
    }

    async #cleanup(userId: string): Promise<void> {
        const allHistory = await this.#db
            .select()
            .from(courseHistory)
            .where(eq(courseHistory.userId, userId))
            .orderBy(desc(courseHistory.accessedAt))

        if (allHistory.length > 5) {
            const toDelete = allHistory.slice(5)
            for (const entry of toDelete) {
                await this.#db.delete(courseHistory).where(eq(courseHistory.id, entry.id))
            }
        }
    }
}
