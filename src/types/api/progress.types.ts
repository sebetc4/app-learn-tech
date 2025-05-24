import type {
    CreateLessonProgressIPCHandlerParams,
    CreateLessonProgressIPCHandlerReturn,
    ValidateLessonProgressIPCHandlerParams,
    ValidateLessonProgressIPCHandlerReturn
} from '../ipc/progress-ipc.types'

export interface ProgressAPI {
    createLessonProgress: (
        params: CreateLessonProgressIPCHandlerParams
    ) => CreateLessonProgressIPCHandlerReturn
    validateLessonProgress: (
        params: ValidateLessonProgressIPCHandlerParams
    ) => ValidateLessonProgressIPCHandlerReturn
}
