import { chapters, courseProgress, courses, lessonProgress, lessons } from '@/database/schemas'
import { and, eq } from 'drizzle-orm'

import {
    AutoSaveFunction,
    Chapter,
    ChapterInCourseViewModel,
    Course,
    CoursePreview,
    CourseProgress,
    CourseViewModel,
    DrizzleDB,
    Lesson,
    LessonInCourseViewModel,
    LessonProgress,
    LessonProgressViewModel
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

    constructor(db: DrizzleDB, autoSaveFunction: AutoSaveFunction) {
        this.#db = db
        this.#autoSave = autoSaveFunction
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
        const [courseInfo] = await this.#db
            .select()
            .from(courses)
            .where(eq(courses.id, courseId))
            .limit(1)

        if (!courseInfo) return null

        const chaptersData = await this.#db
            .select()
            .from(chapters)
            .where(eq(chapters.courseId, courseId))
            .orderBy(chapters.position)

        const lessonsData = await this.#db
            .select()
            .from(lessons)
            .where(eq(lessons.courseId, courseId))
            .orderBy(lessons.position)

        const progressData = await this.#db
            .select()
            .from(lessonProgress)
            .where(and(eq(lessonProgress.courseId, courseId), eq(lessonProgress.userId, userId)))

        const courseProgressData = await this.#db
            .select()
            .from(courseProgress)
            .where(and(eq(courseProgress.courseId, courseId), eq(courseProgress.userId, userId)))

        return this.#formatCourseViewModelData(
            courseInfo,
            chaptersData,
            lessonsData,
            progressData,
            courseProgressData
        )
    }

    #formatCourseViewModelData(
        course: Course,
        chapters: Chapter[],
        lessons: Lesson[],
        lessonProgress: LessonProgress[],
        courseProgress: CourseProgress[]
    ): CourseViewModel {
        const progressByLessonId = new Map<string, LessonProgressViewModel>(
            lessonProgress.map((p) => [
                p.lessonId,
                {
                    id: p.id,
                    status: p.status
                }
            ])
        )

        const lessonsByChapterId = lessons.reduce<Record<string, LessonInCourseViewModel[]>>(
            (acc, lesson) => {
                if (!acc[lesson.chapterId]) {
                    acc[lesson.chapterId] = []
                }

                const lessonViewModel: LessonInCourseViewModel = {
                    id: lesson.id,
                    position: lesson.position,
                    name: lesson.name,
                    type: lesson.type,
                    videoDuration: lesson.videoDuration,
                    progress: progressByLessonId.get(lesson.id) || null
                }

                acc[lesson.chapterId].push(lessonViewModel)
                return acc
            },
            {}
        )

        const chaptersViewModel: ChapterInCourseViewModel[] = chapters.map((chapter) => ({
            id: chapter.id,
            position: chapter.position,
            name: chapter.name,
            lessons: lessonsByChapterId[chapter.id] || []
        }))

        return {
            ...course,
            chapters: chaptersViewModel,
            progress: courseProgress[0]?.percentage || null
        }
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
