import { ProgressService } from '../services'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

import {
    CreateLessonProgressIPCHandlerParams,
    CreateLessonProgressIPCHandlerReturn,
    ValidateLessonProgressIPCHandlerParams,
    ValidateLessonProgressIPCHandlerReturn
} from '@/types/ipc/progress-ipc.types'

export const registerProgressIpcHandlers = (progressService: ProgressService) => {
    ipcMain.handle(
        IPC.PROGRESS.CREATE_LESSON_PROGRESS,
        async (
            _event,
            params: CreateLessonProgressIPCHandlerParams
        ): CreateLessonProgressIPCHandlerReturn => {
            try {
                const progress = await progressService.createLessonProgress(params)
                return {
                    success: true,
                    data: { progress },
                    message: 'Lesson progress created successfully'
                }
            } catch (error) {
                console.error('Error during create lesson progress:', error)
                return {
                    success: false,
                    message: `Error creating lesson progress: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            }
        }
    )

    ipcMain.handle(
        IPC.PROGRESS.VALIDATE_LESSON_PROGRESS,
        async (
            _event,
            params: ValidateLessonProgressIPCHandlerParams
        ): ValidateLessonProgressIPCHandlerReturn => {
            try {
                const progress = await progressService.validateLessonProgress(params)
                return {
                    success: true,
                    data: { progress },
                    message: 'Lesson progress validated successfully'
                }
            } catch (error) {
                console.error('Error during validate lesson progress:', error)
                return {
                    success: false,
                    message: `Error validating lesson progress: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            }
        }
    )
}
