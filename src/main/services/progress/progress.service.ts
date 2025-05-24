import { DatabaseService } from '../database'

interface CreateLessonProgressParams {
    courseId: string
    lessonId: string
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
}
