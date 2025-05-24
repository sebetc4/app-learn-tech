import { DatabaseService } from '../database'

interface CreateLessonProgressParams {
    courseId: string
    lessonId: string
    userId: string
}

interface ValidateLessonProgressParams {
    progressId: string
}

export class ProgressService {
    #database: DatabaseService
    constructor(database: DatabaseService) {
        this.#database = database
    }

    createLessonProgress = async (data: CreateLessonProgressParams) => {
        return await this.#database.progress.createLessonProgress(data)
    }

    validateLessonProgress = async ({ progressId }: ValidateLessonProgressParams) => {
        return await this.#database.progress.updateLessonProgress(progressId, 'COMPLETED')
    }
}
