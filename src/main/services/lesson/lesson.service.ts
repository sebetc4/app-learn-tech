import { DatabaseService } from '../database'

import { LessonViewModel } from '@/types'

export class LessonService {
    #database: DatabaseService
    constructor(database: DatabaseService) {
        this.#database = database
    }

    async getOne(lessonId: string): Promise<LessonViewModel> {
        try {
            const lesson = await this.#database.lesson.getById(lessonId)
            if (!lesson) {
                throw new Error(`Lesson with ID ${lessonId} not found`)
            }
            return lesson
        } catch (error) {
            console.error(`Error retrieving lesson with ID ${lessonId}: ${error}`)
            throw error
        }
    }
}
