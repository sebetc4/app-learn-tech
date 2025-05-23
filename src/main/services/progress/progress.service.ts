import { DatabaseService } from '../database'

export class LessonService {
    #database: DatabaseService
    constructor(database: DatabaseService) {
        this.#database = database
    }

    getLessonsProgress = async (courseId: string, userId: string) => {
        try {
            this.#database.progress.getLessonsProgress({
                courseId,
                userId
            })
        } catch (error) {
            console.error(
                `Error retrieving lessons progress for course ${courseId} and user ${userId}: ${error}`
            )
            throw error
        }
    }
}
