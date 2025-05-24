import { IPCHandlerReturnWithData } from './core-ipc.types'
import { LessonProgress } from '@prisma/client'

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
    progressId: string
}

export type ValidateLessonProgressIPCHandlerReturn = IPCHandlerReturnWithData<{
    progress: LessonProgress
}>
