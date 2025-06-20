import { DatabaseService } from '../database'

interface CreateLessonProgressParams {
    courseId: string
    lessonId: string
    userId: string
}

interface ValidateLessonProgressParams {
    lessonProgressId: string
    courseId: string
    userId: string
}

export class ProgressService {
    #database: DatabaseService
    constructor(database: DatabaseService) {
        this.#database = database
    }

    createLessonProgress = async (data: CreateLessonProgressParams) => {
        return await this.#database.progress.createLessonProgress(data)
    }

    validateLessonProgress = async ({
        lessonProgressId,
        courseId,
        userId
    }: ValidateLessonProgressParams) => {
        const lessonProgress = await this.#database.progress.updateLessonProgress({
            progressId: lessonProgressId,
            status: 'COMPLETED'
        })
        await this.#database.progress.upsertCourseProgress({
            courseId,
            userId
        })
        return lessonProgress
    }
}
