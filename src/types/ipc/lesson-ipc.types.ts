import { LessonViewModel } from '../view-model'
import type { IPCHandlerReturnWithData } from './core-ipc.types'

// Get One
export type GetOneLessonIPCHandlerParams = {
    lessonId: string
}

export type GetOneLessonIPCHandlerReturn = IPCHandlerReturnWithData<{
    lesson: LessonViewModel
}>

// Get Navigation Element
export type GetNavigationElementIPCHandlerParams = {
    courseId: string
    chapterId: string
}

export type GetNavigationElementIPCHandlerReturn = IPCHandlerReturnWithData<{
    navigationElement: {
        course: {
            id: string
            name: string
        }
        chapter: {
            id: string
            name: string
            position: number
        }
    }
}>
