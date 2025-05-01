import { LessonViewModel } from '../view-model'
import type { IPCHandlerReturnWithData } from './core-ipc.types'

// Get One
export type GetOneLessonIPCHandlerParams = {
    lessonId: string
}

export type GetOneLessonIPCHandlerReturn = IPCHandlerReturnWithData<{
    lesson: LessonViewModel
}>
