import { IPCHandlerReturnWithData } from './core-ipc.types'
import { LessonProgress } from '@/types'

// Create Status Progress
export interface CreateLessonProgressIPCHandlerParams {
    courseId: string
    lessonId: string
    userId: string
}

export type CreateLessonProgressIPCHandlerReturn = IPCHandlerReturnWithData<{
    progress: LessonProgress
}>

export interface ValidateLessonProgressIPCHandlerParams {
    lessonProgressId: string
    courseId: string
    userId: string
}

export type ValidateLessonProgressIPCHandlerReturn = IPCHandlerReturnWithData<{
    progress: LessonProgress
}>
