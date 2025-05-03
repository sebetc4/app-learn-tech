import { DatabaseService } from '../database'

import { LessonViewModel } from '@/types'

interface GetNavigationElementParams {
    courseId: string
    chapterId: string
}

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

    async getNavigationElement({ courseId, chapterId }: GetNavigationElementParams) {
        try {
            const course = await this.#database.course.getById(courseId)
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`)
            }
            const chapter = await this.#database.chapter.getById(chapterId)
            if (!chapter) {
                throw new Error(`Chapter with ID ${chapterId} not found`)
            }
            return {
                course: {
                    id: course.id,
                    name: course.name
                },
                chapter: {
                    id: chapter.id,
                    name: chapter.name,
                    position: chapter.position
                }
            }
        } catch (error) {
            console.error(`Error retrieving navigation element: ${error}`)
            throw error
        }
    }
}
