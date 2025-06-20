import { create } from 'zustand'

import { LessonViewModel } from '@/types'

interface LessonState {
    course: {
        id: string
        name: string
    } | null
    chapter: {
        id: string
        name: string
        position: number
    } | null
    lesson: LessonViewModel | null
    adjacentLessons: {
        previous: {
            id: string
            chapterId: string
            position: number
            name: string
        } | null
        next: {
            id: string
            chapterId: string
            position: number
            name: string
        } | null
    } | null
}

interface LessonAction {
    initialize: (
        courseId: string,
        chapterId: string,
        lessonId: string,
        userId: string
    ) => Promise<void>
    validate: (courseId: string, userId: string) => Promise<void>
}

interface LessonStore extends LessonState, LessonAction {}

const initialState: LessonState = {
    course: null,
    chapter: null,
    lesson: null,
    adjacentLessons: null
}

export const useLessonStore = create<LessonStore>()((set, get) => ({
    ...initialState,

    initialize: async (courseId, chapterId, lessonId, userId) => {
        if (!courseId || !chapterId) throw new Error('Course ID, Chapter ID are required')
        const response = await window.api.lesson.getLessonStoreData({
            courseId,
            chapterId,
            lessonId,
            userId
        })
        if (response.success) {
            const { course, chapter, lesson } = response.data
            if (!lesson.progress) {
                const progressResponse = await window.api.progress.createLessonProgress({
                    courseId,
                    lessonId: lesson.id,
                    userId
                })
                if (progressResponse.success) {
                    const { id: progressId } = progressResponse.data.progress
                    lesson.progress = {
                        id: progressId,
                        status: 'IN_PROGRESS'
                    }
                } else {
                    console.error(`Error creating lesson progress: ${progressResponse.message}`)
                }
            }
            set({
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
                    previous: response.data.adjacentLessons.previous
                        ? {
                              id: response.data.adjacentLessons.previous.id,
                              position: response.data.adjacentLessons.previous.position,
                              chapterId: response.data.adjacentLessons.previous.chapterId,
                              name: response.data.adjacentLessons.previous.name
                          }
                        : null,
                    next: response.data.adjacentLessons.next
                        ? {
                              id: response.data.adjacentLessons.next.id,
                              position: response.data.adjacentLessons.next.position,
                              chapterId: response.data.adjacentLessons.next.chapterId,
                              name: response.data.adjacentLessons.next.name
                          }
                        : null
                }
            })
        } else {
            console.error(`Error fetching navigation element: ${response.message}`)
        }
    },

    validate: async (courseId, userId) => {
        const currentLesson = get().lesson
        if (currentLesson?.progress) {
            const progressResponse = await window.api.progress.validateLessonProgress({
                lessonProgressId: currentLesson.progress.id,
                courseId,
                userId
            })
            if (progressResponse.success) {
                currentLesson.progress.status = 'COMPLETED'
                set({ lesson: currentLesson })
            } else {
                console.error(`Error validating lesson progress: ${progressResponse.message}`)
                throw new Error(`Error validating lesson progress: ${progressResponse.message}`)
            }
        } else {
            console.error(
                `Error creating lesson progress: No progress found for lesson ${currentLesson?.id}`
            )
        }
    }
}))
