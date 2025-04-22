import { MediaHandlerService } from '../services/media-handler/media-handler.service'
import { IPC } from '@/constants'
import { ipcMain } from 'electron'

import {
    CheckDiskSpaceIPCHandlerReturn,
    GetCodeSnippetContentIPCHandlerReturn,
    GetCodeSnippetContentParams,
    GetCourseSizeIPCHandlerParams,
    GetCourseSizeIPCHandlerReturn,
    GetVideoPathIPCHandlerParams,
    GetVideoPathIPCHandlerReturn
} from '@/types'

export const registerMediaIpcHandlers = () => {
    const mediaHandler = new MediaHandlerService()

    ipcMain.handle(
        IPC.MEDIA.GET_VIDEO_PATH,
        async (
            _event,
            { courseId, lessonId }: GetVideoPathIPCHandlerParams
        ): GetVideoPathIPCHandlerReturn => {
            try {
                const videoPath = mediaHandler.getLessonVideoPath(courseId, lessonId)
                return {
                    success: true,
                    data: { path: videoPath },
                    message: 'Video path retrieved successfully'
                }
            } catch (error) {
                console.error('Error retrieving video path:', error)
                return {
                    success: false,
                    message: `Error retrieving video path: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            }
        }
    )

    ipcMain.handle(
        IPC.MEDIA.GET_CODE_SNIPPET,
        async (
            _event,
            { courseId, lessonId, snippetId, extension }: GetCodeSnippetContentParams
        ): GetCodeSnippetContentIPCHandlerReturn => {
            try {
                const codeSnippetContent = mediaHandler.getCodeSnippetContent(
                    courseId,
                    lessonId,
                    snippetId,
                    extension
                )
                return {
                    success: true,
                    data: { codeSnippetContent },
                    message: 'Code snippet retrieved successfully'
                }
            } catch (error) {
                console.error('Error retrieving code snippet:', error)
                return {
                    success: false,
                    message: `Error retrieving code snippet: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            }
        }
    )

    ipcMain.handle(IPC.MEDIA.CHECK_DISK_SPACE, async (): CheckDiskSpaceIPCHandlerReturn => {
        try {
            const availableSpace = await mediaHandler.getAvailableDiskSpace()
            return {
                success: true,
                data: {
                    availableSpace
                },
                message: 'Disk space checked successfully'
            }
        } catch (error) {
            console.error('Error checking disk space:', error)
            return {
                success: false,
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
        }
    })

    ipcMain.handle(
        IPC.MEDIA.GET_COURSE_SIZE,
        async (
            _event,
            { courseId }: GetCourseSizeIPCHandlerParams
        ): GetCourseSizeIPCHandlerReturn => {
            try {
                const size = await mediaHandler.getCourseSize(courseId)
                return {
                    success: true,
                    data: { size },
                    message: 'Course size calculated successfully'
                }
            } catch (error) {
                console.error('Error calculating course size:', error)
                return {
                    success: false,
                    message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                }
            }
        }
    )
}
