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
            position: number
        } | null
        next: {
            id: string
            position: number
        } | null
    } | null
}

interface LessonAction {
    initialize: (courseId: string, chapterId: string, lessonId: string) => Promise<void>
}

interface LessonStore extends LessonState, LessonAction {}

const initialState: LessonState = {
    course: null,
    chapter: null,
    lesson: null,
    adjacentLessons: null
}

export const useLessonStore = create<LessonStore>()((set) => ({
    ...initialState,

    initialize: async (courseId, chapterId, lessonId) => {
        if (!courseId || !chapterId) throw new Error('Course ID, Chapter ID are required')
        const response = await window.api.lesson.getData({ courseId, chapterId, lessonId })
        if (response.success) {
            const { course, chapter, lesson } = response.data
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
                              position: response.data.adjacentLessons.previous.position
                          }
                        : null,
                    next: response.data.adjacentLessons.next
                        ? {
                              id: response.data.adjacentLessons.next.id,
                              position: response.data.adjacentLessons.next.position
                          }
                        : null
                }
            })
        } else {
            console.error(`Error fetching navigation element: ${response.message}`)
        }
    }
}))
