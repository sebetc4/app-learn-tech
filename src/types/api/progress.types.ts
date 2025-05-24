import type {
    CreateLessonProgressIPCHandlerParams,
    CreateLessonProgressIPCHandlerReturn
} from '../ipc/progress-ipc.types'

export interface ProgressAPI {
    createLessonProgress: (
        params: CreateLessonProgressIPCHandlerParams
    ) => CreateLessonProgressIPCHandlerReturn
}
