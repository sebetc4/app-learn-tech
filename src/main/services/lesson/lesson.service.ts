import { DatabaseService } from '../database'

import { LessonViewModel } from '@/types'

interface GetLessonViewModelParams {
    lessonId: string
    userId: string
}

interface GetNavigationElementParams {
    courseId: string
    chapterId: string
    lessonId: string
    userId: string
}

export class LessonService {
    #database: DatabaseService
    constructor(database: DatabaseService) {
        this.#database = database
    }

    // Read
    async getLessonViewModel({
        lessonId,
        userId
    }: GetLessonViewModelParams): Promise<LessonViewModel> {
        try {
            const lesson = await this.#database.lesson.getLessonViewModelById({ lessonId, userId })
            if (!lesson) {
                throw new Error(`Lesson with ID ${lessonId} not found`)
            }
            return lesson
        } catch (error) {
            console.error(`Error retrieving lesson with ID ${lessonId}: ${error}`)
            throw error
        }
    }

    async getLessonStoreData({
        courseId,
        chapterId,
        lessonId,
        userId
    }: GetNavigationElementParams) {
        try {
            const lesson = await this.getLessonViewModel({ lessonId, userId })
            const course = await this.#database.course.getOneById(courseId)
            if (!course) {
                throw new Error(`Course with ID ${courseId} not found`)
            }
            const chapter = await this.#database.chapter.getById(chapterId)
            if (!chapter) {
                throw new Error(`Chapter with ID ${chapterId} not found`)
            }
            const { previousLesson, nextLesson } = await this.#database.lesson.getAdjacentLessons(
                courseId,
                lesson.position
            )
            return {
                course: {
                    id: courseId,
                    name: course.name
                },
                chapter: {
                    id: chapter.id,
                    name: chapter.name,
                    position: chapter.position
                },
                lesson,
                adjacentLessons: {
                    previous: previousLesson
                        ? {
                              ...previousLesson,
                              position: lesson.position - 1
                          }
                        : null,
                    next: nextLesson
                        ? {
                              ...nextLesson,
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
