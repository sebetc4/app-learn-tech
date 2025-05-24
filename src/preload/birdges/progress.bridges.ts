import { IPC } from '@/constants'
import { ipcRenderer } from 'electron'

import {
    CreateLessonProgressIPCHandlerParams,
    ProgressAPI,
    ValidateLessonProgressIPCHandlerParams
} from '@/types'

export const progressContextBridge: ProgressAPI = {
    createLessonProgress: (params: CreateLessonProgressIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.PROGRESS.CREATE_LESSON_PROGRESS, params),
    validateLessonProgress: (params: ValidateLessonProgressIPCHandlerParams) =>
        ipcRenderer.invoke(IPC.PROGRESS.VALIDATE_LESSON_PROGRESS, params)
}
