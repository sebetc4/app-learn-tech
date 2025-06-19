import { courseProgress, courses, lessonProgress } from '@/database/schemas'
import { and, eq } from 'drizzle-orm'

import {
    AutoSaveFunction,
    Course,
    CoursePreview,
    DrizzleDB,
    QueryWithRelationsFunction
} from '@/types'

interface CreateCourseParams {
    id: string
    name: string
    description: string
    folderName: string
    buildAt: string
}

interface GetCourseViewModelByIdParams {
    courseId: string
    userId: string
}

export class CourseDatabaseManager {
    #db: DrizzleDB
    #autoSave: AutoSaveFunction
    #queryWithRelations: QueryWithRelationsFunction

    constructor(
        db: DrizzleDB,
        autoSaveFunction: AutoSaveFunction,
        queryWithRelations: QueryWithRelationsFunction
    ) {
        this.#db = db
        this.#autoSave = autoSaveFunction
        this.#queryWithRelations = queryWithRelations
    }

    async create(data: CreateCourseParams): Promise<Course> {
        return this.#autoSave(async () => {
            const result = await this.#db.insert(courses).values(data).returning()

            return result[0]
        })
    }

    async getAll(): Promise<CoursePreview[]> {
        return await this.#db
            .select({
                id: courses.id,
                name: courses.name,
                description: courses.description,
                folderName: courses.folderName,
                buildAt: courses.buildAt
            })
            .from(courses)
    }

    async getById(id: string): Promise<Course | null> {
        try {
            const result = await this.#db.select().from(courses).where(eq(courses.id, id)).limit(1)

            return result[0] || null
        } catch (error) {
            console.error(`Error retrieving course by ID: ${error}`)
            throw error
        }
    }

    async getCourseViewModelById({ courseId, userId }: GetCourseViewModelByIdParams) {
        const result = await this.#db.query.courses.findFirst({
            where: eq(courses.id, courseId),
            with: {
                chapters: {
                    columns: {
                        id: true,
                        position: true,
                        name: true
                    },
                    with: {
                        lessons: {
                            columns: {
                                id: true,
                                position: true,
                                name: true,
                                videoDuration: true,
                                type: true
                            },
                            with: {
                                lessonProgresses: {
                                    where: eq(lessonProgress.userId, userId),
                                    columns: {
                                        id: true,
                                        status: true
                                    }
                                }
                            }
                        }
                    }
                },
                courseProgresses: {
                    where: and(
                        eq(courseProgress.userId, userId),
                        eq(courseProgress.courseId, courseId)
                    ),
                    columns: {
                        percentage: true
                    }
                }
            }
        })
        return result
    }

    async getOneById(id: string): Promise<Course> {
        try {
            const result = await this.#db.select().from(courses).where(eq(courses.id, id)).limit(1)

            const course = result[0]
            if (!course) {
                throw new Error(`Course with ID ${id} not found`)
            }

            return course
        } catch (error) {
            console.error(`Error retrieving course by ID: ${error}`)
            throw error
        }
    }

    async getByName(name: string): Promise<Course | null> {
        const result = await this.#db.select().from(courses).where(eq(courses.name, name)).limit(1)

        return result[0] || null
    }

    async deleteById(id: string): Promise<Course | null> {
        return this.#autoSave(async () => {
            const result = await this.#db.delete(courses).where(eq(courses.id, id)).returning()

            return result[0] || null
        })
    }
}
