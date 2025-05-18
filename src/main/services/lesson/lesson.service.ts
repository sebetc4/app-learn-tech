import { DatabaseService } from '../database'

import { LessonViewModel } from '@/types'

interface GetNavigationElementParams {
    courseId: string
    chapterId: string
    lessonId: string
}

export class LessonService {
    #database: DatabaseService
    constructor(database: DatabaseService) {
        this.#database = database
    }

    // Read
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

    async getData({ courseId, chapterId, lessonId }: GetNavigationElementParams) {
        try {
            const lesson = await this.getOne(lessonId)
            const course = await this.#database.course.getById(courseId)
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`)
            }
            const chapter = await this.#database.chapter.getById(chapterId)
            if (!chapter) {
                throw new Error(`Chapter with ID ${chapterId} not found`)
            }
            const { previousLessonId, nextLessonId } =
                await this.#database.lesson.getAdjacentLessons(courseId, lesson.position)
            return {
                course: {
                    id: course.id,
                    name: course.name
                },
                chapter: {
                    id: chapter.id,
                    name: chapter.name,
                    position: chapter.position
                },
                lesson,
                adjacentLessons: {
                    previous: previousLessonId
                        ? {
                              id: previousLessonId,
                              position: lesson.position - 1
                          }
                        : null,
                    next: nextLessonId
                        ? {
                              id: nextLessonId,
                              position: lesson.position + 1
                          }
                        : null
                }
            }
        } catch (error) {
            console.error(`Error retrieving navigation element: ${error}`)
            throw error
        }
    }
}
